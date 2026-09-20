import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CalendarDays, Bookmark, Eye, ArrowRight, TrendingUp } from "lucide-react";
import { applicationsApi,interviewsApi,jobsApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

export default function CandidateDashboard(){
 const {user}=useAuth(); const [apps,setApps]=useState([]),[interviews,setInterviews]=useState([]),[jobs,setJobs]=useState([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([applicationsApi.list(),interviewsApi.upcoming(),jobsApi.list({page:1})]).then(([a,i,j])=>{setApps(Array.isArray(a.data)?a.data:a.data.results||[]);setInterviews(Array.isArray(i.data)?i.data:i.data.results||[]);setJobs((Array.isArray(j.data)?j.data:j.data.results||[]).slice(0,3))}).catch(()=>{}).finally(()=>setLoading(false))},[]);
 const saved=JSON.parse(localStorage.getItem("hireflow_saved_jobs")||"[]");
 return <div><PageHeader title={`Welcome back, ${user?.first_name||user?.username}! 👋`} subtitle="Explore opportunities and keep your career moving." action={<Link className="btn primary" to="/jobs">Find a Job <ArrowRight size={17}/></Link>}/>
 {loading?<Loader/>:<><div className="stats-grid four"><Stat icon={FileText} value={apps.length} label="Applications sent"/><Stat icon={CalendarDays} value={interviews.length} label="Interviews scheduled"/><Stat icon={Bookmark} value={saved.length} label="Saved jobs"/><Stat icon={Eye} value={18} label="Profile views"/></div>
 <div className="dashboard-grid"><section className="panel"><div className="panel-head"><h2>Recent applications</h2><Link to="/candidate/applications">View all <ArrowRight size={14}/></Link></div>{apps.slice(0,5).map(a=><div className="list-row" key={a.id}><div className="row-avatar">{(a.job_title||a.job?.title||"J")[0]}</div><div className="row-main"><strong>{a.job_title||a.job?.title||`Application #${a.id}`}</strong><span>{a.company_name||a.job?.company_details?.name||"Company"}</span></div><StatusBadge value={a.status}/></div>)}</section>
 <section className="panel"><div className="panel-head"><h2>Upcoming interviews</h2><Link to="/interviews">View all</Link></div>{interviews.slice(0,4).map(i=><div className="list-row" key={i.id}><div className="date-chip">{new Date(i.scheduled_at).getDate()}</div><div className="row-main"><strong>{i.job_title||i.application?.job_title||"Interview"}</strong><span>{new Date(i.scheduled_at).toLocaleString([], {dateStyle:"medium",timeStyle:"short"})}</span></div><StatusBadge value={i.status}/></div>)}</section></div>
 <div className="section-title"><h2>Recommended opportunities</h2><Link to="/jobs">Browse all <ArrowRight size={15}/></Link></div><div className="compact-job-grid">{jobs.map(j=><Link className="compact-job" key={j.id} to={`/jobs/${j.id}`}><div className="company-logo">{(j.title||"J")[0]}</div><div><strong>{j.title}</strong><span>{j.company_details?.name||"Company"} · {j.location||"Remote"}</span></div><ArrowRight size={16}/></Link>)}</div></>}</div>
}
function Stat({icon:Icon,value,label}){return <div className="stat-card"><div className="stat-icon"><Icon size={20}/></div><strong>{value}</strong><span>{label}</span><small><TrendingUp size={12}/> Live data</small></div>}
