import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function BootError({ error }) {
  return (
    <div className="runtime-error">
      <div className="runtime-error-card">
        <div className="brand-mark">H</div>
        <h1>HireFlow failed to start</h1>
        <p>
          The frontend JavaScript bundle could not be loaded. Open the browser
          console to see the exact module error.
        </p>
        <pre>{error?.stack || error?.message || String(error)}</pre>
        <button className="btn primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    </div>
  );
}

import("./App.jsx")
  .then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("HireFlow boot error:", error);
    root.render(<BootError error={error} />);
  });
