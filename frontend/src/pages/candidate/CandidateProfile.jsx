import { useEffect,useState } from "react";
import { Save, Upload } from "lucide-react";
import { authApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function CandidateProfile(){
 const [form,setForm]=useState({first_name:"",last_name:"",email:"",skills:"",experience_years:""}),[saving,setSaving]=useState(false);const {toast,show}=useToast();
 useEffect(()=>{Promise.all([authApi.me(),authApi.candidateProfile()]).then(([m,p])=>setForm(f=>({...f,...m.data,...p.data}))).catch(()=>{})},[]);
 async function submit(e){e.preventDefault();setSaving(true);try{await authApi.updateMe({first_name:form.first_name,last_name:form.last_name,email:form.email});const fd=new FormData();if(form.skills!=null)fd.append("skills",form.skills);if(form.experience_years!=null)fd.append("experience_years",form.experience_years);const file=document.getElementById("candidate-resume")?.files?.[0];if(file)fd.append("resume",file);await authApi.updateCandidateProfile(fd);show("Profile updated")}catch(e){show(getErrorMessage(e),"error")}finally{setSaving(false)}}
 return <div><PageHeader title="Candidate profile" subtitle="Keep your professional profile ready for recruiters."/><form className="panel form profile-form" onSubmit={submit}><div className="profile-banner"><div className="avatar xxl">{(form.first_name||"A")[0]}</div><div><h2>{form.first_name} {form.last_name}</h2><span className="muted">Candidate profile</span></div></div><div className="two-col"><label>First name<input value={form.first_name||""} onChange={e=>setForm({...form,first_name:e.target.value})}/></label><label>Last name<input value={form.last_name||""} onChange={e=>setForm({...form,last_name:e.target.value})}/></label></div><label>Email<input type="email" value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Skills<input value={form.skills||""} onChange={e=>setForm({...form,skills:e.target.value})} placeholder="Python, Django, REST API, React"/></label><label>Experience years<input type="number" min="0" value={form.experience_years??""} onChange={e=>setForm({...form,experience_years:e.target.value})}/></label><label>Profile resume (optional)<div className="file-input"><Upload size={16}/><input id="candidate-resume" type="file" accept=".pdf,.doc,.docx"/></div></label><div><button className="btn primary" disabled={saving}><Save size={16}/>{saving?"Saving…":"Save profile"}</button></div></form><Toast toast={toast}/></div>
}
