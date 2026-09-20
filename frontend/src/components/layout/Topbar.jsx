import { Link } from "react-router-dom";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { notificationsApi } from "../../api/services";
import { useEffect, useState } from "react";

export default function Topbar() {
  const { user, role, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationsApi.unreadCount().then(({data}) => setUnread(data.unread_count || 0)).catch(() => {});
  }, []);

  return (
    <header className="topbar">
      <button className="mobile-menu" aria-label="Menu"><Menu size={21}/></button>
      <div className="top-search"><Search size={17}/><input placeholder="Search jobs, candidates, companies..." /></div>
      <div className="top-actions">
        <Link className="icon-btn" to="/notifications" title="Notifications">
          <Bell size={19}/>{unread > 0 && <span className="notification-dot">{unread > 9 ? "9+" : unread}</span>}
        </Link>
        <div className="top-profile">
          <div className="avatar small">{(user?.first_name || user?.username || "H")[0].toUpperCase()}</div>
          <div><strong>{user?.first_name || user?.username}</strong><span>{role}</span></div>
        </div>
        <button className="icon-btn" onClick={logout} title="Sign out"><LogOut size={18}/></button>
      </div>
    </header>
  );
}
