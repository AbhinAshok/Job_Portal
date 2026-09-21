import { useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, ArrowLeft } from "lucide-react";
import { authApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function ForgotPassword() {
  const { toast, show } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (error) {
      show(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/">
          <span className="brand-mark"><BriefcaseBusiness size={20} /></span> HireFlow
        </Link>
      </div>
      <div className="auth-split">
        <div className="auth-promo">
          <div className="eyebrow">Password reset</div>
          <h1>Forgot your<br /><span>password?</span></h1>
          <p>No worries — we'll email you a link to reset it.</p>
        </div>
        <div className="auth-card">
          <Link className="back-link" to="/login"><ArrowLeft size={15} /> Back to sign in</Link>
          <h2>Reset password</h2>

          {sent ? (
            <p className="muted">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
              Check your inbox
            </p>
          ) : (
            <>
              <p className="muted">Enter the email associated with your account.</p>
              <form onSubmit={submit} className="form">
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <button className="btn primary full-btn" disabled={loading}>
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}