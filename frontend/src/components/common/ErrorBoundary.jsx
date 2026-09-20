
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("HireFlow frontend runtime error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="runtime-error">
        <div className="runtime-error-card">
          <div className="brand-mark">H</div>
          <h1>HireFlow couldn't load this page</h1>
          <p>
            A frontend runtime error occurred. Open the browser console for the
            full error and stack trace.
          </p>
          <pre>{this.state.error?.message || "Unknown runtime error"}</pre>
          <div className="row-actions">
            <button
              className="btn primary"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                localStorage.removeItem("hireflow_access");
                localStorage.removeItem("hireflow_refresh");
                localStorage.removeItem("hireflow_user");
                localStorage.removeItem("hireflow_role");
                window.location.href = "/login";
              }}
            >
              Clear session & sign in again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
