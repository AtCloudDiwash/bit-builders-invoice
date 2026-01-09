import { useState } from "react";
import NewInvoice from "./NewInvoice";
import SalesHistory from "./SalesHistory";

export default function Main() {
  const [activePage, setActivePage] = useState("newInvoice"); // default page

  // Helper to highlight the active button
  const getButtonClass = (page) =>
    page === activePage ? "btn active" : "btn";

  return (
    <main className="container">
      <h1>Invoicer</h1>

      {/* Navigation Buttons */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          className={getButtonClass("newInvoice")}
          onClick={() => setActivePage("newInvoice")}
        >
          New Invoice
        </button>
        <button
          className={getButtonClass("salesHistory")}
          onClick={() => setActivePage("salesHistory")}
          style={{ marginLeft: "0.5rem" }}
        >
          Sales History
        </button>
      </div>

      {/* Render Page Based on Active Button */}
      <div>
        {activePage === "newInvoice" && <NewInvoice />}
        {activePage === "salesHistory" && <SalesHistory />}
      </div>

      {/* Pico CSS Styles for Active Button */}
      <style>
        {`
          .btn {
            padding: 0.5rem 1rem;
            border-radius: 5px;
            border: 1px solid #ccc;
            background: transparent;
            cursor: pointer;
            font-weight: 500;
            color: #fff
          }

          .btn.active {
            background: #0366d6;
            color: white;
            border-color: #0366d6;
          }

          .btn:hover {
            opacity: 0.85;
          }
        `}
      </style>
    </main>
  );
}
