import React, { useState } from "react";

// PUBLIC_INTERFACE
function ItineraryPage() {
  /**
   * User provides trip info; Cohere API called using env var for key; AI itinerary displayed.
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

  const COHERE_KEY = process.env.REACT_APP_COHERE_KEY;

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
    } catch(err) {
      setError(err.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 540, marginTop: 110 }}>
      <h2 className="title" style={{ fontSize: "2.2rem", marginBottom: 16 }}>
        AI Itinerary Generator
      </h2>
      <form onSubmit={handleSubmit} style={{
        display: "flex", flexDirection: "column", gap: "14px",
        border: "1px solid var(--border-color)", borderRadius: 8, padding: 24, background: "rgba(255,255,255,0.04)"
      }}>
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
      {itinerary &&
        <div style={{ marginTop: 36, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 22, whiteSpace: "pre-line" }}>
          <div className="subtitle" style={{ marginBottom: 10 }}>AI-Generated Itinerary:</div>
          <div>{itinerary}</div>
        </div>
      }
    </div>
  );
}

export default ItineraryPage;
