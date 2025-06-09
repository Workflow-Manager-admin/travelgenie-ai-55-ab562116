import React from 'react';
import './App.css';

function Navbar() {
  // Minimal routing (window.location.pathname), fallback to "/" as home
  const LINKS = [
    { label: "Home", path: "/" },
    { label: "Itinerary", path: "/itinerary" },
    { label: "Weather", path: "/weather" },
    { label: "AI Chat", path: "/chat" }
  ];
  const curPath = window.location.pathname;

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between', minHeight: "var(--navbar-height)" }}>
        {/* Logo section */}
        <div className="logo">
          <span className="logo-symbol" aria-label="logo">*</span> <span style={{ letterSpacing: "0.03em" }}>TravelGenie</span>
        </div>
        {/* Navigation links */}
        <div className="navbar-links">
          {LINKS.map(link => {
            const isActive = (link.path === "/" && (curPath === "/" || curPath === "")) ||
              (link.path !== "/" && curPath.startsWith(link.path));
            return (
              <a
                key={link.path}
                className={`navbar-link${isActive ? " active" : ""}`}
                href={link.path}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
                style={{}}
              >
                {link.label}
                {isActive &&
                  <span className="navbar-active-indicator" aria-hidden="true"></span>
                }
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>
            <h1 className="title">travelgenie_ai</h1>
            <div className="description">
              Start building your application.
            </div>
            <button className="btn btn-large">Button</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;