import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Search, MapPin } from "lucide-react";
import { companiesApi } from "../../api/services";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function Companies(){
 const [items,setItems]=useState([]),[search,setSearch]=useState(""),[loading,setLoading]=useState(true);
 async function load(){setLoading(true);try{const {data}=await companiesApi.list({search});setItems(Array.isArray(data)?data:data.results||[])}catch(e){}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 return <div><PageHeader title="Explore companies" subtitle="Discover teams, industries and opportunities."/>
 <form className="search-panel single" onSubmit={e=>{e.preventDefault();load()}}><div className="search-input"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company, industry or location"/></div><button className="btn primary">Search</button></form>
 {loading?<Loader/>:items.length?<div className="company-grid">{items.map(c=><Link to={`/companies/${c.id}`} className="company-card" key={c.id}><div className="company-logo xl">{c.name?.[0]||"C"}</div><h3>{c.name}</h3><p>{c.industry||"Technology"}</p><span><MapPin size={14}/>{c.location||"Location not specified"}</span></Link>)}</div>:<EmptyState title="No companies found"/>}</div>
}
