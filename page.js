"use client";
import { useState } from "react";
import { questions } from "../lib/questions";

export default function Home() {
  const [name,setName]=useState("");
  const [answers,setAnswers]=useState(Array(21).fill(-1));
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  async function createChallenge(e){
    e.preventDefault(); setError("");
    if(!name.trim() || answers.some(a=>a<0)){setError("Add your name and choose an answer for all 21 questions.");return;}
    setBusy(true);
    try{
      const res=await fetch("/api/challenges",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({creatorName:name.trim(),answers})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Could not create the challenge.");
      window.location.href=`/dashboard/${data.id}?token=${encodeURIComponent(data.token)}`;
    }catch(err){setError(err.message);setBusy(false);}
  }
  return <main className="shell">
    <div className="brand">✦ 21 Questions · Friends Edition</div>
    <header className="hero"><div className="brand">REAL FRIENDS. REAL MEMORIES.</div><h1>How well do your friends <span className="gradient">really know you?</span></h1><p className="sub">Create your own 21-question challenge and send it to your friends.</p></header>
    <form className="panel" onSubmit={createChallenge}>
      <div className="field"><label>Your name</label><input value={name} maxLength={40} onChange={e=>setName(e.target.value)} placeholder="Enter your name" /></div>
      <div style={{marginTop:28}}><h2 style={{fontFamily:"Space Grotesk"}}>Set your answers</h2><p className="muted">Choose the option that describes you best. Your friends will try to guess!</p></div>
      {questions.map((q,i)=><div className="question" key={i}><div className="topline"><strong>QUESTION {i+1} OF 21</strong><span>{answers[i]>=0?"Answered ✓":"Choose one"}</span></div><label>{q.q}</label><div className="options">{q.o.map((o,j)=><button type="button" key={j} className={`option ${answers[i]===j?"selected":""}`} onClick={()=>setAnswers(a=>a.map((v,k)=>k===i?j:v))}>{String.fromCharCode(65+j)}. {o}</button>)}</div></div>)}
      {error&&<div className="notice">{error}</div>}
      <div className="actions"><button className="btn" disabled={busy}>{busy?"Creating…":"Create my challenge →"}</button></div>
    </form><div className="footer">Made for the friends who pay attention. 💜</div>
  </main>;
}
