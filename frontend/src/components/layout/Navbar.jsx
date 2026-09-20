import { Link, NavLink } from "react-router-dom";
import { BriefcaseBusiness, Building2, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="public-nav">
      <Link className="brand" to="/">
        <span className="brand-mark"><BriefcaseBusiness size={19}/></span>
        HireFlow
      </Link>
      <nav>
        <NavLink to="/jobs">Find Jobs</NavLink>
        <NavLink to="/companies">Companies</NavLink>
      </nav>
      <div className="nav-actions">
        {isAuthenticated ? <Link className="btn primary small" to="/dashboard">Dashboard</Link> : <>
          <Link className="btn ghost small" to="/login"><LogIn size={16}/> Sign In</Link>
          <Link className="btn primary small" to="/register"><UserPlus size={16}/> Get Started</Link>
        </>}
      </div>
    </header>
  );
}
