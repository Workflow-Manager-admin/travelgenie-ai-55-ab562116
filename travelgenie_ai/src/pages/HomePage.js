import React from "react";

// PUBLIC_INTERFACE
function HomePage() {
  /**
   * Home page for TravelGenie AI.
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
        style={{ maxWidth: 460, margin: "20px auto", fontSize: "1.23rem" }}
      >
        Welcome to WanderWise – your AI-powered travel planning companion!
        <br />
        Plan your dream trips with smart itineraries, weather updates and instant travel chat support.
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
        <a href="/itinerary">
          <button className="btn btn-large">AI Itinerary Planner</button>
        </a>
        <a href="/weather">
          <button className="btn btn-large">Weather Checker</button>
        </a>
        <a href="/chat">
          <button className="btn btn-large">AI Travel Chat</button>
        </a>
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: ".98rem" }}>
        Explore, dream, and let AI handle your travel details!
      </div>
    </div>
  );
}

export default HomePage;
