import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  company_name: "",
  username: "",
  email: "",
  password: "",
  password2: "",
};

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const { toast, show } = useToast();

  const [role, setRole] = useState("CANDIDATE");
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  // This MUST evaluate to true when you click Recruiter
  const isRecruiter = role === "RECRUITER";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleRoleChange = (selectedRole) => {
    if (selectedRole === role) return;

    setRole(selectedRole);

    setForm((current) => ({
      ...current,
      company_name: selectedRole === "RECRUITER" ? current.company_name : "",
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const username = form.username.trim();
    const email = form.email.trim();

    if (isRecruiter && !form.company_name.trim()) {
      show("Company name is required for recruiters.", "error");
      return;
    }

    if (form.password !== form.password2) {
      show("Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username,
        email,
        password: form.password,
        password2: form.password2,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        role,
        ...(isRecruiter ? { company_name: form.company_name.trim() } : {}),
      };

      await register(payload);
      await login({ username, password: form.password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      show(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Link to="/">
          <span className="brand-mark">
            <BriefcaseBusiness size={20} />
          </span>
          HireFlow
        </Link>
      </div>

      <div className="auth-split">
        <div className="auth-promo">
          <div className="eyebrow">Join HireFlow</div>
          <h1>
            One platform.
            <br />
            <span>Every opportunity.</span>
          </h1>
          <p>
            Build your candidate profile or create a recruiting workspace.
          </p>
          <div className="check-list">
            <span><Check size={15} /> Secure account</span>
            <span><Check size={15} /> Smart job discovery</span>
            <span><Check size={15} /> Application tracking</span>
          </div>
        </div>

        <div className="auth-card wide">
          <h2>Create account</h2>
          <p className="muted">Choose how you will use HireFlow.</p>

          <div className="role-toggle">
            <button
              type="button"
              className={role === "CANDIDATE" ? "active" : ""}
              onClick={() => handleRoleChange("CANDIDATE")}
            >
              Candidate
            </button>
            <button
              type="button"
              className={role === "RECRUITER" ? "active" : ""}
              onClick={() => handleRoleChange("RECRUITER")}
            >
              Recruiter
            </button>
          </div>



          <form onSubmit={submit} className="form">
            <div className="two-col">
              <label>
                First name
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  placeholder="Abhin"
                  disabled={loading}
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  placeholder="Ashok"
                  disabled={loading}
                />
              </label>
            </div>




            <label>
              Username
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                placeholder="Choose a username"
                autoComplete="username"
                disabled={loading}
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                required
              />
            </label>

            {isRecruiter && (
              <label className="recruiter-company-field">
                Company name{" "}

                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  placeholder="Enter your company name"
                  autoComplete="organization"
                  disabled={loading}
                  required
                />
                <small style={{ color: "#69768a", fontSize: 10, fontWeight: 500, marginTop: -2 }}>
                  Required for recruiter accounts.
                </small>
              </label>
            )}

            <div className="two-col">
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  name="password2"
                  value={form.password2}
                  onChange={(e) => updateField("password2", e.target.value)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </label>
            </div>

            <button type="submit" className="btn primary full-btn" disabled={loading}>
              {loading ? "Creating…" : "Create Account"}
            </button>

          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}