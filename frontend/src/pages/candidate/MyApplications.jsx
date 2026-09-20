import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applicationsApi } from "../../api/services";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    applicationsApi.list()
      .then(({ data }) => setItems(Array.isArray(data) ? data : data.results || []))
      .finally(() => setLoading(false));
  }, []);

  const shown = filter ? items.filter(a => a.status === filter) : items;

  return (
    <div>
      <PageHeader title="My applications" subtitle="Track every application from submission to outcome." />
      <div className="tabs">
        {["", "applied", "in_review", "shortlisted", "interview", "rejected", "hired"].map(x => (
          <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>
            {x ? x.replace("_", " ") : "All"}
          </button>
        ))}
      </div>
      {loading ? <Loader /> : shown.length ? (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Company</th>
                <th>Applied</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map(a => {
                // job field can be an integer ID or an object — normalise to ID
                const jobId = typeof a.job === "object" && a.job !== null ? a.job.id : a.job;
                return (
                  <tr key={a.id}>
                    <td><strong>{a.job_title || a.job?.title || "Job"}</strong></td>
                    <td>{a.company_name || a.job?.company_details?.name || "—"}</td>
                    <td>{a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td>
                      {jobId ? (
                        <Link className="btn ghost small" to={`/jobs/${jobId}`}>View job</Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No applications yet" text="Find a job and submit your first application." action={<Link className="btn primary" to="/jobs">Browse jobs</Link>} />
      )}
    </div>
  );
}
