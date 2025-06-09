import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function ItineraryPage() {
  /**
   * User provides trip info; Cohere API called using env var for key; AI itinerary displayed.
   * Also fetches real-time flight options via Amadeus API under the itinerary.
   */
  const [form, setForm] = useState({
    from: "",
    to: "",
    startDate: "",
    endDate: "",
    budget: "",
    preferences: ""
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");

  // Amadeus API integration state
  const [flightOptions, setFlightOptions] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [flightsError, setFlightsError] = useState("");
  const [authToken, setAuthToken] = useState("");

  const COHERE_KEY = 'xyV9r163fmM8ieMhIFAUbmymr6DakgKJ8wj520lv'//process.env.REACT_APP_COHERE_KEY;

  // In real deployment these should come from .env, here we use demonstration strings or process.env fallback
  const AMA_API_KEY = process.env.REACT_APP_AMADEUS_API_KEY || "";
  const AMA_API_SECRET = process.env.REACT_APP_AMADEUS_API_SECRET || "";

  async function fetchItineraryCohere(formData) {
    // Cohere "generate" API endpoint (generation, not chat)
    const prompt = `Create a personalized, day-by-day travel itinerary for a trip with these details:
From: ${formData.from}
To: ${formData.to}
Start date: ${formData.startDate}
End date: ${formData.endDate}
Budget: ${formData.budget || "Not specified"}
Preferences: ${formData.preferences || "None"}
Please provide recommendations for each day, with tips if possible.`;

    const res = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_KEY}`,
        "Content-Type": "application/json",
        "Cohere-Version": "2022-12-06"
      },
      body: JSON.stringify({
        model: "command",
        prompt,
        max_tokens: 600,
        temperature: 0.8
      }),
    });
    if (!res.ok) throw new Error("Failed to generate itinerary. API error.");
    const data = await res.json();
    // The result under .generations[0].text
    return data?.generations?.[0]?.text || "No result.";
  }

  // PUBLIC_INTERFACE
  async function fetchAmadeusAuth() {
    /**
     * Authorize with Amadeus API to get a bearer token.
     */
    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(AMA_API_KEY)}&client_secret=${encodeURIComponent(AMA_API_SECRET)}`
    });
    if (!res.ok) throw new Error("Failed to authenticate with Amadeus.");
    const data = await res.json();
    return data.access_token;
  }

  // PUBLIC_INTERFACE
  async function fetchAmadeusFlights({ from, to, startDate }) {
    /**
     * Fetch flight offers using the Amadeus Flight Offers Search API.
     */
    // Many airports share city names; in a real build, use IATA code lookup or a resolver!
    // For the demo, try the first 3 letters (best effort)
    const origin = from.length >= 3 ? from.slice(0, 3).toUpperCase() : from.toUpperCase();
    const destination = to.length >= 3 ? to.slice(0, 3).toUpperCase() : to.toUpperCase();

    // Using Amadeus's /v2/shopping/flight-offers endpoint, basic params
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${startDate}&adults=1&currencyCode=USD&max=6`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err.errors?.[0]?.detail || "Could not retrieve flights. Check airport codes and API credentials."
      );
    }
    const data = await res.json();
    return data.data || [];
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setItinerary(null);
    setLoading(true);
    try {
      if (!COHERE_KEY) throw new Error("AI API key is missing (REACT_APP_COHERE_KEY).");
      const text = await fetchItineraryCohere(form);
      setItinerary(text.trim());
    } catch (err) {
      setError(err.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  // Side effect: fetch flights AFTER both cities and startDate chosen, and after auth, when any change.
  useEffect(() => {
    async function loadFlights() {
      // Only search when both cities & startDate chosen
      if (
        form.from.trim().length >= 3 &&
        form.to.trim().length >= 3 &&
        form.startDate &&
        AMA_API_KEY &&
        AMA_API_SECRET
      ) {
        setFlightsError("");
        setFlightsLoading(true);
        try {
          let token = authToken;
          if (!token) {
            token = await fetchAmadeusAuth();
            setAuthToken(token);
          }
          // Use new token for this run
          const flights = await fetchAmadeusFlights({ from: form.from, to: form.to, startDate: form.startDate });
          setFlightOptions(flights);
        } catch (err) {
          setFlightsError(
            err.message ||
              "No flights found or error fetching. Note: free Amadeus test API may not return all city pairs."
          );
          setFlightOptions([]);
        } finally {
          setFlightsLoading(false);
        }
      } else {
        setFlightOptions([]);
      }
    }

    loadFlights();
    // eslint-disable-next-line
  }, [form.from, form.to, form.startDate, AMA_API_KEY, AMA_API_SECRET]); // Only runs on relevant param changes

  function formatFlight(f) {
    // Format a single flight offer details. Uses first itinerary/segment/price
    // Structure: https://developers.amadeus.com/self-service-apis/apis-docs/overview/summary/flights
    const out = f.itineraries?.[0]?.segments?.[0];
    const inArr = f.itineraries?.[0]?.segments?.[f.itineraries[0].segments.length - 1];
    return {
      airline: out?.carrierCode || "N/A",
      departure: out?.departure?.at || "N/A",
      arrival: inArr?.arrival?.at || "N/A",
      from: out?.departure?.iataCode || "",
      to: inArr?.arrival?.iataCode || "",
      duration: f.itineraries?.[0]?.duration || "",
      price: f.price?.total || "",
      currency: f.price?.currency || "USD"
    };
  }

  return (
    <div className="container" style={{ maxWidth: 540, marginTop: 110 }}>
      <h2 className="title" style={{ fontSize: "2.2rem", marginBottom: 16 }}>
        AI Itinerary Generator
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: 24,
          background: "rgba(255,255,255,0.04)"
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ flex: 1 }}>
            From:<br />
            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              required
              className="input"
              autoFocus
              placeholder="e.g., New York"
            />
          </label>
          <label style={{ flex: 1 }}>
            To:<br />
            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., Paris"
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ flex: 1 }}>
            Start Date:<br />
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label style={{ flex: 1 }}>
            End Date:<br />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
        </div>
        <label>
          Budget (USD):<br />
          <input
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
            placeholder="Optional"
            min="0"
            className="input"
          />
        </label>
        <label>
          Preferences:<br />
          <input
            name="preferences"
            value={form.preferences}
            onChange={handleChange}
            placeholder="e.g., museums, nature, food"
            className="input"
          />
        </label>
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>
      {error && <div style={{ color: "tomato", marginTop: 12 }}>{error}</div>}
      {itinerary && (
        <div
          style={{
            marginTop: 36,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: 22,
            whiteSpace: "pre-line"
          }}
        >
          <div className="subtitle" style={{ marginBottom: 10 }}>
            AI-Generated Itinerary:
          </div>
          <div>{itinerary}</div>
        </div>
      )}
      {/* FLIGHT OPTIONS SECTION */}
      {(form.from && form.to && form.startDate) && (
        <div
          style={{
            marginTop: 38,
            marginBottom: 18,
            background: "rgba(255,255,255,0.09)",
            borderRadius: 10,
            padding: 18,
            border: "1.5px solid var(--border-color)"
          }}
        >
          <div
            className="subtitle"
            style={{ color: "var(--secondary)", fontWeight: 600, marginBottom: 9, fontSize: "1.14rem" }}
          >
            Real-Time Flight Options:
          </div>
          {flightsLoading && (
            <div style={{ color: "var(--text-secondary)" }}>Loading flights...</div>
          )}
          {flightsError && (
            <div style={{ color: "tomato", marginTop: 2 }}>{flightsError}</div>
          )}
          {!flightsLoading && !flightsError && flightOptions && flightOptions.length === 0 && (
            <div style={{ color: "var(--text-secondary)" }}>
              No flight results found for these cities/dates.
            </div>
          )}
          {!flightsLoading && flightOptions && flightOptions.length > 0 && (
            <table style={{ width: "100%", fontSize: ".99rem", borderCollapse: "collapse", marginTop: 8 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={thStyle}>Airline</th>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>To</th>
                  <th style={thStyle}>Departure</th>
                  <th style={thStyle}>Arrival</th>
                  <th style={thStyle}>Duration</th>
                  <th style={thStyle}>Price</th>
                </tr>
              </thead>
              <tbody>
                {flightOptions.map((f, i) => {
                  const info = formatFlight(f);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={tdStyle}>{info.airline}</td>
                      <td style={tdStyle}>{info.from}</td>
                      <td style={tdStyle}>{info.to}</td>
                      <td style={tdStyle}>
                        {info.departure.replace("T", " ").slice(0, 16)}
                      </td>
                      <td style={tdStyle}>
                        {info.arrival.replace("T", " ").slice(0, 16)}
                      </td>
                      <td style={tdStyle}>{info.duration.replace("PT", "")}</td>
                      <td style={tdStyle}>
                        <b>
                          {info.currency} {info.price}
                        </b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 6, color: "var(--text-secondary)", fontSize: ".96rem" }}>
            Prices and flights shown are sample data from Amadeus.
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "4px 8px",
  textAlign: "left",
  fontWeight: 500
};
const tdStyle = {
  padding: "4px 8px"
};

export default ItineraryPage;
