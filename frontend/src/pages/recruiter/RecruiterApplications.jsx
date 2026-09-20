import { useEffect,useState } from "react";
import { applicationsApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

const statuses=["applied","in_review","shortlisted","interview","rejected","hired"];

export default function RecruiterApplications(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true);const {toast,show}=useToast();
 async function load(){const {data}=await applicationsApi.list();setItems(Array.isArray(data)?data:data.results||[])}
 useEffect(()=>{load().finally(()=>setLoading(false))},[]);
 async function status(id,value){try{await applicationsApi.updateStatus(id,value);await load();show("Application status updated")}catch(e){show(getErrorMessage(e),"error")}}
 return <div><PageHeader title="Applications" subtitle="Review candidates and move them through your hiring pipeline."/><div className="pipeline">{statuses.map(s=><div key={s} className="pipeline-col"><div className="pipeline-head"><StatusBadge value={s}/><span>{items.filter(a=>a.status===s).length}</span></div>{items.filter(a=>a.status===s).map(a=><div className="candidate-card" key={a.id}><div className="row-avatar">{(a.candidate_name||"C")[0]}</div><strong>{a.candidate_name||a.user?.username||"Candidate"}</strong><span>{a.job_title||a.job?.title||"Job"}</span><small>{a.created_at?new Date(a.created_at).toLocaleDateString():"Recently"}</small><select value={a.status} onChange={e=>status(a.id,e.target.value)}>{statuses.map(x=><option key={x} value={x}>{x.replace("_"," ")}</option>)}</select></div>)}</div>)}</div><Toast toast={toast}/></div>
}
