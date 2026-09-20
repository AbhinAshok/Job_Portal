import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, Users, Power } from "lucide-react";
import { jobsApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function MyJobs(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true);const {toast,show}=useToast();
 async function load(){const {data}=await jobsApi.mine();setItems(Array.isArray(data)?data:data.results||[])}
 useEffect(()=>{load().finally(()=>setLoading(false))},[]);
 async function toggle(j){try{await jobsApi.update(j.id,{is_active:!j.is_active});await load();show(`Job ${j.is_active?"deactivated":"activated"}`)}catch(e){show(getErrorMessage(e),"error")}}
 async function remove(j){if(!confirm(`Delete "${j.title}"?`))return;try{await jobsApi.remove(j.id);await load();show("Job deleted")}catch(e){show(getErrorMessage(e),"error")}}
 return <div><PageHeader title="My jobs" subtitle="Create, publish and manage your job postings." action={<Link className="btn primary" to="/recruiter/jobs/new"><Plus size={17}/> Post New Job</Link>}/>{loading?<Loader/>:items.length?<div className="panel table-wrap"><table><thead><tr><th>Job</th><th>Location</th><th>Applicants</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(j=><tr key={j.id}><td><Link className="table-title" to={`/jobs/${j.id}`}>{j.title}</Link><small>{j.category||j.job_type||"Full-time"}</small></td><td>{j.location||"Remote"}</td><td><span className="inline-icon"><Users size={15}/>{j.applicant_count||0}</span></td><td><span className={`active-dot ${j.is_active?"on":""}`}>{j.is_active?"Active":"Inactive"}</span></td><td><div className="row-actions"><Link className="icon-btn" to={`/recruiter/jobs/${j.id}/edit`} title="Edit"><Edit3 size={16}/></Link><button className="icon-btn" onClick={()=>toggle(j)} title="Toggle"><Power size={16}/></button><button className="icon-btn danger" onClick={()=>remove(j)} title="Delete"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>:<EmptyState title="No jobs yet" text="Create your first job posting." action={<Link className="btn primary" to="/recruiter/jobs/new">Post a job</Link>}/>}<Toast toast={toast}/></div>
}
