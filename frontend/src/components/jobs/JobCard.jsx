import { Link } from "react-router-dom";
import { MapPin, Clock3, DollarSign, Bookmark, Building2 } from "lucide-react";

export default function JobCard({ job, saved = false, onSave }) {
  const company = job.company_details || job.company || {};
  const companyName = typeof company === "string" ? company : company.name;
  const salary = job.salary_min || job.salary_max
    ? `${job.salary_currency || "$"}${job.salary_min || "0"} – ${job.salary_currency || "$"}${job.salary_max || "0"}`
    : "Salary not disclosed";

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-logo">{companyName?.[0] || "H"}</div>
        <span className="tag">{job.job_type || "Full-time"}</span>
      </div>
      <Link to={`/jobs/${job.id}`}><h3>{job.title}</h3></Link>
      <p className="muted company-name"><Building2 size={15}/>{companyName || "Company"}</p>
      <div className="job-meta">
        <span><MapPin size={15}/>{job.location || "Remote"}</span>
        <span><DollarSign size={15}/>{salary}</span>
      </div>
      <div className="job-tags">
        {(job.tags || []).slice(0, 3).map((tag, i) => <span key={i}>{typeof tag === "string" ? tag : tag.name}</span>)}
      </div>
      <div className="job-card-footer">
        <span className="muted"><Clock3 size={14}/> {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently"}</span>
        <div className="row-actions">
          {onSave && <button className={`icon-btn ${saved ? "saved" : ""}`} onClick={() => onSave(job)} title="Save job"><Bookmark size={17}/></button>}
          <Link className="btn primary small" to={`/jobs/${job.id}`}>View Job</Link>
        </div>
      </div>
    </article>
  );
}
