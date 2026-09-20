import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Users, ShieldCheck, Sparkles, BriefcaseBusiness } from "lucide-react";

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-glow one" /><div className="hero-glow two" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> The modern hiring platform</div>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>Where great talent<br/><span>meets opportunity.</span></motion.h1>
          <p>Discover jobs, build your profile, manage applications, and connect with the people behind the opportunity.</p>
          <div className="hero-actions">
            <Link className="btn primary large" to="/jobs">Explore Jobs <ArrowRight size={18}/></Link>
            <Link className="btn ghost large" to="/register">Create Account</Link>
          </div>
          <div className="hero-trust"><ShieldCheck size={17}/> Role-based hiring workflows · Secure JWT authentication · Real-time notifications</div>
        </div>
        <div className="hero-panel">
          
        </div>
      </section>
      <section className="feature-grid container">
        {[
          [Search, "Find the right role", "Powerful search, filters, company pages and detailed job views."],
          [BriefcaseBusiness, "Manage your career", "Resumes, profiles, applications and interviews in one place."],
          [Users, "Hire with confidence", "Recruiter workflows for jobs, applicants, interviews and messaging."]
        ].map(([Icon,title,text]) => <div className="feature-card" key={title}><div className="feature-icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></div>)}
      </section>
      <section className="cta container"><div><span className="eyebrow">Ready when you are</span><h2>Build your next career move.</h2><p>Join HireFlow as a candidate or recruiter.</p></div><Link className="btn primary" to="/register">Get Started <ArrowRight size={17}/></Link></section>
    </div>
  );
}
