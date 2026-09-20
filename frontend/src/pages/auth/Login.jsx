import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {toast, show} = useToast();
  const [form, setForm] = useState({username:"",password:""});
  const [showPass, setShowPass] = useState(false);
  const [loading,setLoading]=useState(false);

  async function submit(e) {
    e.preventDefault(); setLoading(true);
    try {
      const data = await login(form);
      navigate(location.state?.from || "/dashboard", {replace:true});
    } catch (error) { show(getErrorMessage(error),"error"); }
    finally { setLoading(false); }
  }

  return <div className="auth-page">
    <div className="auth-brand"><Link to="/"><span className="brand-mark"><BriefcaseBusiness size={20}/></span> HireFlow</Link></div>
    <div className="auth-split">
      <div className="auth-promo"><div className="eyebrow">Welcome back</div><h1>Move your career<br/><span>forward.</span></h1><p>Sign in to discover opportunities or manage your hiring workflow.</p></div>
      <div className="auth-card">
        <Link className="back-link" to="/"><ArrowLeft size={15}/> Back to home</Link>
        <h2>Sign in</h2><p className="muted">Enter your HireFlow credentials.</p>
        <form onSubmit={submit} className="form">
          <label>Username<input required value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Your username"/></label>
          <label>Password<div className="password-field"><input required type={showPass?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Your password"/><button type="button" onClick={()=>setShowPass(!showPass)}>{showPass?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
          <button className="btn primary full-btn" disabled={loading}>{loading?"Signing in…":"Sign In"}</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div><Toast toast={toast}/>
  </div>;
}
