import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { authApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function RecruiterProfile() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    company_website: "",
    company_description: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const { toast, show } = useToast();

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userResponse, profileResponse] = await Promise.all([
          authApi.me(),
          authApi.recruiterProfile(),
        ]);

        const user = userResponse.data;
        const profile = profileResponse.data;

        setForm({
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          email: user?.email || "",
          company_name: profile?.company_name || "",
          company_website: profile?.company_website || "",
          company_description: profile?.company_description || "",
        });
      } catch (err) {
        console.error("Failed to load recruiter profile:", err);
        show(getErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  async function submit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      await authApi.updateMe({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      });

      await authApi.updateRecruiterProfile({
        company_name: form.company_name,
        company_website: form.company_website,
        company_description: form.company_description,
      });

      show("Recruiter profile updated successfully.");
    } catch (err) {
      console.error("Failed to update recruiter profile:", err);
      show(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Recruiter profile"
        subtitle="Manage your recruiter and company information."
      />

      <form
        className="panel form profile-form"
        onSubmit={submit}
      >
        {/* Personal information */}
        <div className="form-section">
          <h2>Personal information</h2>

          <div className="two-col">
            <label>
              First name
              <input
                type="text"
                value={form.first_name}
                onChange={(e) =>
                  updateField("first_name", e.target.value)
                }
                disabled={loading}
              />
            </label>

            <label>
              Last name
              <input
                type="text"
                value={form.last_name}
                onChange={(e) =>
                  updateField("last_name", e.target.value)
                }
                disabled={loading}
              />
            </label>
          </div>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              disabled={loading}
            />
          </label>
        </div>

        {/* Company information */}
        <div className="form-section">
          <h2>Company profile</h2>

          <label>
            Company name
            <input
              type="text"
              value={form.company_name}
              onChange={(e) =>
                updateField("company_name", e.target.value)
              }
              placeholder="Enter your company name"
              required
              disabled={loading}
            />
          </label>

          <label>
            Company website
            <input
              type="url"
              value={form.company_website}
              onChange={(e) =>
                updateField(
                  "company_website",
                  e.target.value
                )
              }
              placeholder="https://example.com"
              disabled={loading}
            />
          </label>

          <label>
            Company description
            <textarea
              rows="7"
              value={form.company_description}
              onChange={(e) =>
                updateField(
                  "company_description",
                  e.target.value
                )
              }
              placeholder="Tell candidates about your company..."
              disabled={loading}
            />
          </label>
        </div>

        {/* Save */}
        <button
          type="submit"
          className="btn primary"
          disabled={saving || loading}
        >
          <Save size={16} />

          {loading
            ? "Loading..."
            : saving
            ? "Saving..."
            : "Save profile"}
        </button>
      </form>

      <Toast toast={toast} />
    </div>
  );
}