import { useEffect,useState } from "react";
import { Save } from "lucide-react";
import { authApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function RecruiterProfile(){
 const [form,setForm]=useState({first_name:"",last_name:"",email:"",company_name:"",company_website:"",company_description:""}),[saving,setSaving]=useState(false);const {toast,show}=useToast();
 useEffect(()=>{Promise.all([authApi.me(),authApi.recruiterProfile()]).then(([m,p])=>setForm(f=>({...f,...m.data,...p.data}))).catch(()=>{})},[]);
 async function submit(e){e.preventDefault();setSaving(true);try{await authApi.updateMe({first_name:form.first_name,last_name:form.last_name,email:form.email});await authApi.updateRecruiterProfile({company_name:form.company_name,company_website:form.company_website,company_description:form.company_description});show("Recruiter profile updated")}catch(e){show(getErrorMessage(e),"error")}finally{setSaving(false)}}
 return <div><PageHeader title="Recruiter profile" subtitle="Manage the public company information associated with your recruiter account."/><form className="panel form profile-form" onSubmit={submit}><div className="two-col"><label>First name<input value={form.first_name||""} onChange={e=>setForm({...form,first_name:e.target.value})}/></label><label>Last name<input value={form.last_name||""} onChange={e=>setForm({...form,last_name:e.target.value})}/></label></div><label>Email<input type="email" value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></label><hr/><h2>Company profile</h2><label>Company name<input value={form.company_name||""} onChange={e=>setForm({...form,company_name:e.target.value})}/></label><label>Company website<input type="url" value={form.company_website||""} onChange={e=>setForm({...form,company_website:e.target.value})}/></label><label>Company description<textarea rows="7" value={form.company_description||""} onChange={e=>setForm({...form,company_description:e.target.value})}/></label><button className="btn primary" disabled={saving}><Save size={16}/>{saving?"Saving…":"Save profile"}</button></form><Toast toast={toast}/></div>
}
