"use client";
import { useParams,useSearchParams } from "next/navigation";
import { useEffect,useState } from "react";

export default function Dashboard(){
 const {id}=useParams(),search=useSearchParams(),token=search.get("token");
 const [data,setData]=useState(null),[error,setError]=useState(""),[copied,setCopied]=useState(false);
 useEffect(()=>{if(!id||!token)return;fetch(`/api/leaderboard/${id}?token=${encodeURIComponent(token)}`).then(r=>r.json()).then(d=>{if(d.error)throw new Error(d.error);setData(d);}).catch(e=>setError(e.message));},[id,token]);
 const share=typeof window!=="undefined"?`${window.location.origin}/play/${id}`:"";
 async function copy(){await navigator.clipboard.writeText(share);setCopied(true);}
 if(!token)return <main className="narrow"><div className="panel"><h1>Private dashboard</h1><p>This dashboard link needs its private access token.</p></div></main>;
 if(error)return <main className="narrow"><div className="panel"><h1>Could not load dashboard</h1><p>{error}</p></div></main>;
 if(!data)return <main className="narrow"><div className="panel">Loading your dashboard…</div></main>;
 return <main className="narrow"><div className="brand">✦ YOUR CHALLENGE DASHBOARD</div><header className="hero"><h1>Friends who took the <span className="gradient">challenge</span></h1><p className="sub">Share your challenge and see who knows you best.</p></header><section className="panel"><h2>Share your challenge</h2><p className="muted">Send this link to your friends. Anyone with the link can attempt it.</p><div className="field"><input readOnly value={share}/></div><div className="actions"><button className="btn" onClick={copy}>{copied?"Copied ✓":"Copy challenge link"}</button><a className="btn secondary" href="/">Create another</a></div><div style={{marginTop:30}} className="topline"><strong>LEADERBOARD</strong><span>{data.attempts.length} attempt(s)</span></div>{data.attempts.length===0?<p className="muted">No one has attempted your challenge yet. Share the link to get started!</p>:data.attempts.map((a,i)=><div className="rank" key={a.id}><div className="ranknum">#{i+1}</div><div><strong>{a.participant_name}</strong><div className="small">{new Date(a.created_at).toLocaleString()}</div></div><strong>{a.score}/21</strong></div>)}{data.attempts.length>0&&<p className="small">Highest score: {Math.max(...data.attempts.map(a=>a.score))}/21</p>}</section><div className="footer">Keep the good friends close. 💜</div></main>;
}
