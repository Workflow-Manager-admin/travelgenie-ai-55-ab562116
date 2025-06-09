import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
function Navbar() {
  const LINKS = [
    { label: "Home", path: "/" },
    { label: "Itinerary", path: "/itinerary" },
    { label: "Weather", path: "/weather" },
    { label: "AI Chat", path: "/chat" },
  ];

  return (
    <nav className="navbar">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          justifyContent: "space-between",
          minHeight: "var(--navbar-height)",
        }}
      >
        {/* Logo section */}
        <div className="logo">
          <span className="logo-symbol" aria-label="logo">*</span>
          <span style={{ letterSpacing: "0.03em" }}>TravelGenie</span>
        </div>
        {/* Navigation links */}
        <div className="navbar-links">
          {LINKS.map((link) => (
            <NavLink
              key={link.path}
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " active" : "")
              }
              to={link.path}
              end={link.path === "/"}
              tabIndex={0}
            >
              {link.label}
              {({ isActive }) =>
                isActive && (
                  <span
                    className="navbar-active-indicator"
                    aria-hidden="true"
                  ></span>
                )
              }
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
