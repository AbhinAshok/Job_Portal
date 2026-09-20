import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { ArrowLeft, Building2, Globe2, MapPin } from "lucide-react";
import { companiesApi,jobsApi } from "../../api/services";
import JobCard from "../../components/jobs/JobCard";
import Loader from "../../components/common/Loader";

export default function CompanyDetails(){
 const {id}=useParams();const [company,setCompany]=useState(null),[jobs,setJobs]=useState([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([companiesApi.detail(id),jobsApi.list()]).then(([c,j])=>{const all=Array.isArray(j.data)?j.data:j.data.results||[];setCompany(c.data);setJobs(all.filter(x=>String(x.company?.id||x.company_id||x.company_details?.id||x.company)==String(id)))}).catch(()=>{}).finally(()=>setLoading(false))},[id]);
 if(loading)return <Loader full/>; if(!company)return <div className="empty-state">Company not found.</div>;
 return <div><Link className="back-link" to="/companies"><ArrowLeft size={16}/> Back to companies</Link><section className="company-hero"><div className="company-logo xxl">{company.name?.[0]||"C"}</div><div><h1>{company.name}</h1><div className="company-facts"><span><Building2 size={15}/>{company.industry||"Industry"}</span><span><MapPin size={15}/>{company.location||"Location"}</span>{company.website&&<a href={company.website} target="_blank" rel="noreferrer"><Globe2 size={15}/>Website</a>}</div></div></section><section className="rich-section company-description"><h2>About {company.name}</h2><p>{company.description||"No company description has been added yet."}</p></section><div className="section-title"><h2>Open positions</h2><span>{jobs.length} jobs</span></div><div className="job-grid">{jobs.map(j=><JobCard key={j.id} job={j}/>)}</div></div>
}
