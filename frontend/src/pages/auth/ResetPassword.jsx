import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BriefcaseBusiness, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { toast, show } = useToast();
  const [form, setForm] = useState({ new_password: "", new_password2: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword({ uid, token, ...form });
      show("Password reset successfully. Please sign in.");
      setTimeout(() => navigate("/login", { replace: true }), 800);
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
          <div className="eyebrow">Almost there</div>
          <h1>Set a new<br /><span>password.</span></h1>
          <p>Choose a strong password you haven't used before.</p>
        </div>
        <div className="auth-card">
          <Link className="back-link" to="/login"><ArrowLeft size={15} /> Back to sign in</Link>
          <h2>New password</h2>
          <p className="muted">Enter and confirm your new password.</p>
          <form onSubmit={submit} className="form">
            <label>
              New password
              <div className="password-field">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  placeholder="Create a strong password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label>
              Confirm password
              <input
                required
                type={showPass ? "text" : "password"}
                value={form.new_password2}
                onChange={(e) => setForm({ ...form, new_password2: e.target.value })}
                placeholder="Repeat password"
              />
            </label>
            <button className="btn primary full-btn" disabled={loading}>
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}