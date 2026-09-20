const labels = {
  applied: "Applied",
  in_review: "In Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  rejected: "Rejected",
  hired: "Hired",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled"
};

export default function StatusBadge({ value }) {
  const key = String(value || "unknown").toLowerCase();
  return <span className={`status status-${key}`}>{labels[key] || value || "Unknown"}</span>;
}
