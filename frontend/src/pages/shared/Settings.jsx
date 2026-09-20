import { useState } from "react";
import { Lock, Save } from "lucide-react";
import { authApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function Settings(){
 const [form,setForm]=useState({old_password:"",new_password:"",new_password2:""}),[saving,setSaving]=useState(false);const {toast,show}=useToast();
 async function submit(e){e.preventDefault();setSaving(true);try{await authApi.changePassword(form);setForm({old_password:"",new_password:"",new_password2:""});show("Password changed successfully")}catch(e){show(getErrorMessage(e),"error")}finally{setSaving(false)}}
 return <div><PageHeader title="Settings" subtitle="Manage your account security."/><div className="settings-grid"><section className="panel form"><div className="setting-icon"><Lock size={20}/></div><h2>Change password</h2><p className="muted">Use a strong password you do not reuse elsewhere.</p><form className="form" onSubmit={submit}><label>Current password<input required type="password" value={form.old_password} onChange={e=>setForm({...form,old_password:e.target.value})}/></label><label>New password<input required type="password" value={form.new_password} onChange={e=>setForm({...form,new_password:e.target.value})}/></label><label>Confirm new password<input required type="password" value={form.new_password2} onChange={e=>setForm({...form,new_password2:e.target.value})}/></label><button className="btn primary" disabled={saving}><Save size={16}/>{saving?"Updating…":"Update password"}</button></form></section></div><Toast toast={toast}/></div>
}
