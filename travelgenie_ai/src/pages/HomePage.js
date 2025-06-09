import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function HomePage() {
  /**
   * Home page for TravelGenie AI - navigation and overview.
   */
  return (
    <div className="container" style={{ paddingTop: 100, textAlign: "center" }}>
      <div className="subtitle" style={{ color: "var(--secondary)" }}>
        Welcome to WanderWise – your AI-powered travel planning companion!
      </div>
      <h1 className="title" style={{ fontSize: "3rem" }}>
        TravelGenie AI
      </h1>
      <p
        className="description"
        style={{ maxWidth: 460, margin: "20px auto", fontSize: "1.18rem" }}
      >
        Plan your dream trips with smart itineraries, weather updates, and instant travel chat support.<br />
        Let AI take care of your travel details, from adventure to arrival!
      </p>
      <div
        style={{
          margin: "32px 0",
          display: "flex",
          justifyContent: "center",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/itinerary">
          <button className="btn btn-large">AI Itinerary Planner</button>
        </Link>
        <Link to="/weather">
          <button className="btn btn-large">Weather Checker</button>
        </Link>
        <Link to="/chat">
          <button className="btn btn-large">AI Travel Chat</button>
        </Link>
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: ".98rem" }}>
        Explore, dream, and let AI handle your travel plans!
      </div>
    </div>
  );
}

export default HomePage;
