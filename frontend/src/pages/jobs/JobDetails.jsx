import { useEffect,useState } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Clock3, Building2, Send, FileText } from "lucide-react";
import { jobsApi, applicationsApi, resumesApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function JobDetails(){
  const {id}=useParams(); const {role}=useAuth(); const navigate=useNavigate();
  const [job,setJob]=useState(null); const [resumes,setResumes]=useState([]); const [resume,setResume]=useState(""); const [cover,setCover]=useState(""); const [loading,setLoading]=useState(true); const [applying,setApplying]=useState(false);
  const {toast,show}=useToast();
  useEffect(()=>{jobsApi.detail(id).then(({data})=>setJob(data)).catch(e=>show(getErrorMessage(e),"error")).finally(()=>setLoading(false)); if(role==="CANDIDATE")resumesApi.list().then(({data})=>setResumes(Array.isArray(data)?data:data.results||[])).catch(()=>{});},[id,role]);
  async function apply(e){e.preventDefault();setApplying(true);try{const form=new FormData();form.append("job",id);if(resume)form.append("resume",resume);if(cover)form.append("cover_letter",cover);await applicationsApi.create(form);show("Application submitted successfully");setTimeout(()=>navigate("/candidate/applications"),700);}catch(e){show(getErrorMessage(e),"error")}finally{setApplying(false)}}
  if(loading)return <Loader full/>; if(!job)return <div className="empty-state">Job not found.</div>;
  const company=job.company_details||job.company||{}; const companyName=typeof company==="string"?company:company.name;
  return <div className="detail-page">
    <Link className="back-link" to="/jobs"><ArrowLeft size={16}/> Back to jobs</Link>
    <div className="detail-grid">
      <article className="detail-card">
        <div className="detail-head"><div className="company-logo xl">{companyName?.[0]||"H"}</div><div><h1>{job.title}</h1><p className="muted company-name"><Building2 size={15}/>{companyName||"Company"}</p></div></div>
        <div className="detail-meta"><span><MapPin size={16}/>{job.location||"Remote"}</span><span><DollarSign size={16}/>{job.salary_min||job.salary_max?`${job.salary_currency||"$"}${job.salary_min||0} – ${job.salary_currency||"$"}${job.salary_max||0}`:"Salary not disclosed"}</span><span><Clock3 size={16}/>{job.job_type||"Full-time"}</span></div>
        <section className="rich-section"><h2>About this role</h2><p>{job.description}</p></section>
        {job.requirements&&<section className="rich-section"><h2>Requirements</h2><p>{job.requirements}</p></section>}
        {job.tags?.length>0&&<section className="rich-section"><h2>Skills &amp; tags</h2><div className="job-tags">{job.tags.map((x,i)=><span key={i}>{typeof x==="string"?x:x.name}</span>)}</div></section>}
      </article>
      <aside className="apply-card">
        <h2>Apply for this job</h2>
        {role==="CANDIDATE" ? (
          <form className="form" onSubmit={apply}>
            <label>Resume<select value={resume} onChange={e=>setResume(e.target.value)}><option value="">No resume / attach later</option>{resumes.map(r=><option key={r.id} value={r.id}>{r.title}{r.is_default?" · Default":""}</option>)}</select></label>
            <label>Cover letter<textarea rows="7" value={cover} onChange={e=>setCover(e.target.value)} placeholder="Tell the recruiter why you're a strong fit…"/></label>
            <button className="btn primary full-btn" disabled={applying}><Send size={17}/>{applying?"Submitting…":"Submit Application"}</button>
            <p className="form-hint"><FileText size={14}/> You can manage resumes from your dashboard.</p>
          </form>
        ) : role==="RECRUITER" ? (
          <><p className="muted">Recruiters can manage applicants from the Applications workspace.</p><Link className="btn primary full-btn" to="/recruiter/applications">View Applications</Link></>
        ) : (
          <><p className="muted">Sign in to apply for this role.</p><Link className="btn primary full-btn" to="/login">Sign In to Apply</Link></>
        )}
      </aside>
    </div><Toast toast={toast}/>
  </div>
}
