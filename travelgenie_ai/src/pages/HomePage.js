import React from "react";

/**
 * Navigation logic uses window.location for minimal demo purposes.
 * In a real app, use React Router or a similar client-side router.
 */

// PUBLIC_INTERFACE
function HomePage() {
  /**
   * Home page for TravelGenie AI.
   */
  return (
    <div className="container" style={{paddingTop: 100, textAlign: "center"}}>
      <div className="subtitle" style={{color: "var(--base-light)"}}>Welcome to</div>
      <h1 className="title" style={{fontSize:"3rem"}}>TravelGenie AI</h1>
      <p className="description" style={{maxWidth: 400, margin: "20px auto"}}>
        Plan your perfect trip with AI-powered itineraries, ask travel questions, and check real-time weather in one place.
      </p>
      <div style={{margin: "32px 0", display:"flex", justifyContent:"center", gap:"18px", flexWrap:"wrap"}}>
        <button className="btn btn-large" onClick={() => window.location.pathname='/itinerary'}>
          AI Itinerary Planner
        </button>
        <button className="btn btn-large" onClick={() => window.location.pathname='/weather'}>
          Weather Checker
        </button>
        <button className="btn btn-large" onClick={() => window.location.pathname='/chat'}>
          AI Travel Chat
        </button>
      </div>
      <div style={{color:"var(--text-secondary)", fontSize:".95rem"}}>
        Explore, dream, and let AI handle your travel details!
      </div>
    </div>
  );
}

export default HomePage;
