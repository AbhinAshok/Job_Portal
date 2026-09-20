import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Users, Target, CalendarDays, ArrowRight, Plus } from "lucide-react";
import { jobsApi,applicationsApi,interviewsApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

export default function RecruiterDashboard(){
 const {user}=useAuth();const [jobs,setJobs]=useState([]),[apps,setApps]=useState([]),[interviews,setInterviews]=useState([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([jobsApi.mine(),applicationsApi.list(),interviewsApi.upcoming()]).then(([j,a,i])=>{setJobs(Array.isArray(j.data)?j.data:j.data.results||[]);setApps(Array.isArray(a.data)?a.data:a.data.results||[]);setInterviews(Array.isArray(i.data)?i.data:i.data.results||[])}).finally(()=>setLoading(false))},[]);
 const active=jobs.filter(j=>j.is_active!==false).length,shortlisted=apps.filter(a=>a.status==="shortlisted").length;
 return <div><PageHeader title={`Welcome back, ${user?.first_name||user?.username}! 👋`} subtitle="Manage recruitment and move candidates through your pipeline." action={<Link className="btn primary" to="/recruiter/jobs/new"><Plus size={17}/> Post New Job</Link>}/>{loading?<Loader/>:<><div className="stats-grid four"><Stat icon={BriefcaseBusiness} value={active} label="Active job postings"/><Stat icon={Users} value={apps.length} label="Total applicants"/><Stat icon={Target} value={shortlisted} label="Shortlisted candidates"/><Stat icon={CalendarDays} value={interviews.length} label="Upcoming interviews"/></div><div className="dashboard-grid"><section className="panel"><div className="panel-head"><h2>Recent applicants</h2><Link to="/recruiter/applications">Manage <ArrowRight size={14}/></Link></div>{apps.slice(0,6).map(a=><div className="list-row" key={a.id}><div className="row-avatar">{(a.candidate_name||"C")[0]}</div><div className="row-main"><strong>{a.candidate_name||a.user?.username||"Candidate"}</strong><span>{a.job_title||a.job?.title||"Job"}</span></div><StatusBadge value={a.status}/></div>)}</section><section className="panel"><div className="panel-head"><h2>My job postings</h2><Link to="/recruiter/jobs">View all</Link></div>{jobs.slice(0,5).map(j=><div className="list-row" key={j.id}><div className="row-avatar">{j.title?.[0]||"J"}</div><div className="row-main"><strong>{j.title}</strong><span>{j.location||"Remote"} · {j.applicant_count||0} applicants</span></div><span className={`active-dot ${j.is_active?"on":""}`}>{j.is_active?"Active":"Inactive"}</span></div>)}</section></div></>}</div>
}
function Stat({icon:Icon,value,label}){return <div className="stat-card"><div className="stat-icon"><Icon size={20}/></div><strong>{value}</strong><span>{label}</span></div>}
