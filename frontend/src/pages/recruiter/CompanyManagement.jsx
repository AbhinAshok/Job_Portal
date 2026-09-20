import { useEffect,useRef,useState } from "react";
import { Building2, Plus, Pencil, Trash2, X, Save, Upload } from "lucide-react";
import { companiesApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

const blank = { name: "", description: "", website: "", location: "", industry: "" };

export default function CompanyManagement() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const file = useRef();
  const { toast, show } = useToast();

  async function load() {
    const { data } = await companiesApi.mine();
    setItems(Array.isArray(data) ? data : data.results || []);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  function open(c = null) {
    setEditing(c);
    setForm(c ? { ...blank, ...c } : blank);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      if (file.current?.files?.[0]) fd.append("logo", file.current.files[0]);
      if (editing) {
        await companiesApi.update(editing.id, fd);
      } else {
        await companiesApi.create(fd);
      }
      show(editing ? "Company updated" : "Company created");
      closeModal();
      await load();
    } catch (e) {
      show(getErrorMessage(e), "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this company?")) return;
    try {
      await companiesApi.remove(id);
      await load();
      show("Company deleted");
    } catch (e) {
      show(getErrorMessage(e), "error");
    }
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Manage the companies connected to your recruiting account."
        action={
          <button className="btn primary" onClick={() => open()}>
            <Plus size={17} /> Add Company
          </button>
        }
      />
      {loading ? (
        <Loader />
      ) : items.length ? (
        <div className="company-grid manage">
          {items.map(c => (
            <div className="company-card" key={c.id}>
              <div className="row-between">
                <div className="company-logo xl">{c.name?.[0] || "C"}</div>
                <div className="row-actions">
                  <button className="icon-btn" onClick={() => open(c)}><Pencil size={15} /></button>
                  <button className="icon-btn danger" onClick={() => remove(c.id)}><Trash2 size={15} /></button>
                </div>
              </div>
              <h3>{c.name}</h3>
              <p>{c.industry || "Industry not set"}</p>
              <span>{c.location || "Location not set"}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No companies yet" text="Add a company to associate with your job postings." action={<button className="btn primary" onClick={() => open()}>Add Company</button>} />
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit company" : "Add company"} close={closeModal}>
          <form className="form" onSubmit={submit}>
            <label>Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Description<textarea rows="5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
            <div className="two-col">
              <label>Website<input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></label>
              <label>Location<input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></label>
            </div>
            <label>Industry<input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} /></label>
            <label>Logo<input ref={file} type="file" accept="image/*" /></label>
            <button className="btn primary full-btn" disabled={saving}>
              <Save size={16} />{saving ? "Saving…" : "Save company"}
            </button>
          </form>
        </Modal>
      )}
      <Toast toast={toast} />
    </div>
  );
}

function Modal({ title, close, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={close}><X /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
