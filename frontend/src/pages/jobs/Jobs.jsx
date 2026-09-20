import { useEffect, useState } from "react";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { jobsApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import JobCard from "../../components/jobs/JobCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function Jobs() {
  const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });
  const [filters, setFilters] = useState({ search: "", job_type: "", location: "", ordering: "-created_at", page: 1 });
  const [loading, setLoading] = useState(true);
  const { toast, show } = useToast();

  async function load(overrideFilters) {
    setLoading(true);
    try {
      const params = overrideFilters || filters;
      const { data } = await jobsApi.list(params);
      setData(Array.isArray(data) ? { results: data, count: data.length } : data);
    } catch (e) {
      show(getErrorMessage(e), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.ordering]);

  function search(e) {
    e.preventDefault();
    const updated = { ...filters, page: 1 };
    setFilters(updated);
    load(updated);
  }

  function update(name, value) {
    setFilters(f => ({ ...f, [name]: value }));
  }

  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("hireflow_saved_jobs") || "[]"));

  function save(job) {
    const next = saved.includes(job.id) ? saved.filter(x => x !== job.id) : [...saved, job.id];
    setSaved(next);
    localStorage.setItem("hireflow_saved_jobs", JSON.stringify(next));
  }

  return (
    <div>
      <PageHeader title="Find your next opportunity" subtitle={`${data.count || 0} jobs available`} />
      <form className="search-panel" onSubmit={search}>
        <div className="search-input"><Search size={18} /><input value={filters.search} onChange={e => update("search", e.target.value)} placeholder="Search by title, skill, company or keyword" /></div>
        <input value={filters.location} onChange={e => update("location", e.target.value)} placeholder="Location" />
        <select value={filters.job_type} onChange={e => update("job_type", e.target.value)}>
          <option value="">All job types</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
        <button className="btn primary"><Search size={17} /> Search</button>
      </form>
      <div className="content-toolbar">
        <span><SlidersHorizontal size={16} /> Sort</span>
        <select value={filters.ordering} onChange={e => update("ordering", e.target.value)}>
          <option value="-created_at">Newest</option>
          <option value="created_at">Oldest</option>
          <option value="-salary_min">Highest salary</option>
          <option value="salary_min">Lowest salary</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>
      {loading ? <Loader /> : data.results?.length ? (
        <div className="job-grid">
          {data.results.map(job => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={save} />)}
        </div>
      ) : <EmptyState title="No jobs found" text="Try another keyword, location or job type." />}
      <div className="pagination">
        {data.previous ? <button className="icon-btn" onClick={() => update("page", Math.max(1, filters.page - 1))}><ChevronLeft /></button> : null}
        <span>Page {filters.page}</span>
        {data.next ? <button className="icon-btn" onClick={() => update("page", filters.page + 1)}><ChevronRight /></button> : null}
      </div>
      <Toast toast={toast} />
    </div>
  );
}
