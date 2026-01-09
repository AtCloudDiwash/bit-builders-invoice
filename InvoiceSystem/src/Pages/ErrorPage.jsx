import React from "react";
import { useNavigate } from "react-router-dom"; // optional, if you want "Go Home" button

export default function ErrorPage() {
  const navigate = useNavigate(); // only if using react-router

  return (
    <main className="container" style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <h1 style={{ fontSize: "6rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ marginBottom: "1rem" }}>Oops! Page not found</h2>
      <p style={{ marginBottom: "2rem", color: "#555" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")} // navigate home
        style={{
          padding: "0.5rem 1.5rem",
          borderRadius: "5px",
          background: "#0366d6",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        Go Home
      </button>
    </main>
  );
}
