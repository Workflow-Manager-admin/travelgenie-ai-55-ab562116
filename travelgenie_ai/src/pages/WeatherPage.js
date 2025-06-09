import React, { useState } from "react";

// PUBLIC_INTERFACE
function WeatherPage() {
  /**
   * Lets user enter a city, fetches & displays current weather and forecast via OpenWeatherMap API.
   * Uses process.env.REACT_APP_WEATHER_API_KEY.
   */
  const API_KEY = 'c8d2c05abce0a5d7f303c425e174d820'//process.env.REACT_APP_WEATHER_API_KEY|| "";
  console.log("API Key:", API_KEY);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchWeather(cityName) {
    // Live call to OpenWeatherMap
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("City not found");
    return res.json();
  }

  async function fetchForecast(cityName) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("Forecast unavailable");
    const data = await res.json();
    // OWM gives forecast in 3-hour intervals; pick one per day at ~12:00
    const dayForecasts = [];
    const seen = new Set();
    for (const slot of data.list) {
      const date = slot.dt_txt.split(" ")[0];
      if (!seen.has(date) && slot.dt_txt.includes("12:00:00")) {
        seen.add(date);
        dayForecasts.push({
          date,
          temp: Math.round(slot.main.temp),
          desc: slot.weather[0].description
        });
      }
      if (dayForecasts.length >= 5) break;
    }
    return dayForecasts;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWeather(null);
    setForecast([]);
    setLoading(true);
    try {
      if (!API_KEY) throw new Error("Weather API key missing (REACT_APP_WEATHER_API_KEY).");
      const cur = await fetchWeather(city);
      setWeather(cur);
      const fcast = await fetchForecast(city);
      setForecast(fcast);
    } catch (e) {
      setError(e.message || "City not found or network issue.");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 460, marginTop:110 }}>
      <h2 className="title" style={{fontSize: "2.2rem", marginBottom:18}}>Weather Checker</h2>
      <form onSubmit={handleSubmit} style={{
        display: "flex", gap: 12, marginBottom: 14,
        background: "rgba(255,255,255,0.04)", padding: "12px 18px", borderRadius: 8, alignItems:"flex-end"
      }}>
        <div style={{flex:1}}>
          <label>Destination (city):<br/>
            <input
              type="text"
              value={city}
              onChange={e=>setCity(e.target.value)}
              required
              placeholder="e.g., Rome"
              className="input"
            />
          </label>
        </div>
        <button className="btn btn-large" disabled={loading}>{loading ? "Loading..." : "Check"}</button>
      </form>
      {error && <div style={{ color:"tomato", margin: "12px 0" }}>{error}</div>}
      {weather &&
        <div style={{
          background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "20px", marginBottom:18
        }}>
          <div className="subtitle" style={{marginBottom:6}}>Current Weather: {weather.name}</div>
          <div style={{fontSize:"1.07rem"}}>
            <span><b>{weather.weather[0].main}</b> ({weather.weather[0].description})</span><br />
            Temp: <b>{weather.main.temp}&deg;C</b>,&nbsp;
            Humidity: <b>{weather.main.humidity}%</b>,&nbsp;
            Wind: <b>{weather.wind.speed} km/h</b>
          </div>
        </div>
      }
      {forecast.length > 0 &&
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius:8, padding: "16px"
        }}>
          <div className="subtitle" style={{marginBottom:8}}>Upcoming Forecast</div>
          <table style={{width:"100%", color:"inherit", borderCollapse:"collapse", fontSize:".98rem"}}>
            <thead>
              <tr style={{borderBottom:"1px solid var(--border-color)"}}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Temperature</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map(f =>
                <tr key={f.date} style={{borderBottom:"1px solid var(--border-color)"}}>
                  <td style={tdStyle}>{f.date}</td>
                  <td style={tdStyle}>{f.temp}&deg;C</td>
                  <td style={tdStyle}>{f.desc}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
      <div style={{marginTop:25, color:"var(--text-secondary)", fontSize:".93rem"}}>
        <b>Tip:</b> Try cities like "London", "Sydney", or your next destination!
      </div>
    </div>
  );
}

const thStyle = {
  padding: "4px 8px", textAlign: "left", fontWeight: 500
};
const tdStyle = {
  padding: "4px 8px"
};

export default WeatherPage;
