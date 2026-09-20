import { Search } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", text = "There are no records to display.", action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Search size={24} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
