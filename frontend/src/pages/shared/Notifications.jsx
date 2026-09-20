import { useEffect,useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { notificationsApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function Notifications(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[unread,setUnread]=useState(false);const {toast,show}=useToast();
 async function load(){const {data}=await notificationsApi.list(unread?{unread:1}:{});setItems(Array.isArray(data)?data:data.results||[])}
 useEffect(()=>{load().finally(()=>setLoading(false))},[unread]);
 async function read(id){try{await notificationsApi.markRead(id);await load()}catch(e){show(getErrorMessage(e),"error")}}
 async function all(){try{await notificationsApi.markAllRead();await load();show("All notifications marked as read")}catch(e){show(getErrorMessage(e),"error")}}
 async function remove(id){try{await notificationsApi.remove(id);await load()}catch(e){show(getErrorMessage(e),"error")}}
 return <div><PageHeader title="Notifications" subtitle="System updates, interview events and application activity." action={<div className="row-actions"><button className={`btn ${unread?"primary":"ghost"} small`} onClick={()=>setUnread(!unread)}>{unread?"Unread only":"All notifications"}</button><button className="btn ghost small" onClick={all}><CheckCheck size={15}/> Mark all read</button></div>}/>{loading?<Loader/>:items.length?<div className="notification-list">{items.map(n=><div className={`notification-item ${n.is_read?"read":""}`} key={n.id}><div className="notification-icon"><Bell size={18}/></div><div className="row-main"><strong>{n.title||n.notification_type||"Notification"}</strong><p>{n.message||n.content||"You have a new update."}</p><small>{n.created_at?new Date(n.created_at).toLocaleString():"Recently"}</small></div><div className="row-actions">{!n.is_read&&<button className="icon-btn" title="Mark read" onClick={()=>read(n.id)}><CheckCheck size={16}/></button>}<button className="icon-btn danger" onClick={()=>remove(n.id)}><Trash2 size={16}/></button></div></div>)}</div>:<EmptyState title="You're all caught up" text="New activity will appear here."/>}<Toast toast={toast}/></div>
}
