import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Search, Briefcase, BriefcaseBusiness, FileText, CalendarDays, Bell,
  MessageSquare, UserRound, Settings, Building2, UsersRound, PlusCircle
} from "lucide-react";

const candidateLinks = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/jobs", "Find Jobs", Search],
  ["/candidate/applications", "Applications", FileText],
  ["/candidate/resumes", "My Resumes", Briefcase],
  ["/interviews", "Interviews", CalendarDays],
  ["/messages", "Messages", MessageSquare],
  ["/notifications", "Notifications", Bell],
  ["/candidate/profile", "Profile", UserRound],
  ["/settings", "Settings", Settings]
];

const recruiterLinks = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/jobs", "Find Jobs", Search],
  ["/recruiter/jobs", "My Jobs", Briefcase],
  ["/recruiter/jobs/new", "Post a Job", PlusCircle],
  ["/recruiter/applications", "Applications", UsersRound],
  ["/recruiter/companies", "Companies", Building2],
  ["/interviews", "Interviews", CalendarDays],
  ["/messages", "Messages", MessageSquare],
  ["/notifications", "Notifications", Bell],
  ["/recruiter/profile", "Company Profile", UserRound],
  ["/settings", "Settings", Settings]
];

export default function Sidebar() {
  const { role, user } = useAuth();
  const links = role === "RECRUITER" ? recruiterLinks : candidateLinks;

  return (
    <aside className="sidebar">
      <Link className="brand sidebar-brand" to="/dashboard">
        <span className="brand-mark"><BriefcaseBusiness size={19}/></span> HireFlow
      </Link>
      <div className="side-user">
        <div className="avatar">{(user?.first_name || user?.username || "H")[0].toUpperCase()}</div>
        <div><strong>{user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.username}</strong><span>{role}</span></div>
      </div>
      <div className="side-label">Workspace</div>
      <nav className="side-nav">
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({isActive}) => isActive ? "active" : ""}>
            <Icon size={18}/><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
