import React, { useState } from "react";

// PUBLIC_INTERFACE
function ItineraryPage() {
  /**
   * Collects travel preferences, sends to an AI API (mocked), and displays the returned itinerary.
   */

  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    preferences: ""
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");

  // Simulate an AI API call (in real app, use fetch to your API)
  function aiApiMock(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: `Day-by-day itinerary for ${formData.destination}:`,
          days: [
            { day: 1, plan: `Arrival in ${formData.destination}, check-in, explore local restaurants.` },
            { day: 2, plan: `Visit top attractions based on your preferences: ${formData.preferences || "General sightseeing"}.` },
            { day: 3, plan: "Relax, optional guided tour, local shopping." },
            { day: 4, plan: "Final day, brunch, pack & depart." }
          ]
        });
      }, 1500);
    });
  }

  const handleChange = (e) => {
    setForm(f => ({...f, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setItinerary(null);
    try {
      // Replace with your actual AI API POST
      const data = await aiApiMock(form);
      setItinerary(data);
    } catch (e) {
      setError("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 540, marginTop:110 }}>
      <h2 className="title" style={{fontSize: "2.2rem", marginBottom:16}}>AI Itinerary Generator</h2>
      <form onSubmit={handleSubmit} style={{
        display: "flex", flexDirection: "column", gap: "14px",
        border: "1px solid var(--border-color)", borderRadius: 8, padding: 24, background: "rgba(255,255,255,0.04)"
      }}>
        <label>
          Destination:<br/>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            className="input"
            autoFocus
            placeholder="e.g., Paris"
          />
        </label>
        <div style={{display:"flex", gap:8}}>
          <label style={{flex: 1}}>
            Start Date:<br/>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label style={{flex: 1}}>
            End Date:<br/>
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
          Budget (USD):<br/>
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
          Preferences:<br/>
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
      {error && <div style={{color: "tomato", marginTop:12}}>{error}</div>}
      {itinerary &&
        <div style={{marginTop:36, background: "rgba(255,255,255,0.04)", borderRadius:8, padding: 20}}>
          <div className="subtitle" style={{marginBottom:10}}>{itinerary.summary}</div>
          <ol>
            {itinerary.days.map(day =>
              <li key={day.day} style={{marginBottom:12}}>
                <strong>Day {day.day}:</strong> {day.plan}
              </li>
            )}
          </ol>
        </div>
      }
    </div>
  );
}


export default ItineraryPage;
