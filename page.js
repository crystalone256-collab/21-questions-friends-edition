 "use client";
import { useState } from "react";
import { questions } from "../lib/questions";

export default function Home() {
  const [name,setName]=useState("");
  const [answers,setAnswers]=useState(Array(21).fill(null));
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [created,setCreated]=useState(null);
  const count=answers.filter(x=>x!==null).length;
  async function createChallenge(){
    setBusy(true);setError("");
    try{
      const res=await fetch("/api/challenges",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({creator_name:name,answers})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not create challenge.");
      setCreated(data);
    }catch(e){setError(e.message)}finally{setBusy(false)}
  }
  return <main><header className="hero"><div className="eyebrow">Friends Edition</div><h1>21 QUESTIONS</h1><p>Real friends. Real memories. 💜</p></header>
    <section className="panel">
      {!created?<><div className="topline"><h2>Create your challenge</h2><span className="pill">{count}/21 answered</span></div>
        <div className="field"><label>Your name</label><input className="input" maxLength="40" value={name} onChange={e=>setName(e.target.value)} placeholder="What should your friends call you?"/></div>
        <div className="progress"><span style={{width:`${count/21*100}%`}}/></div>
        {questions.map((q,i)=><div className="question" key={i}><p><strong>{i+1}. {q.question}</strong></p><div className="options">{q.options.map((o,j)=><button type="button" key={j} className={`option ${answers[i]===j?"selected":""}`} onClick={()=>setAnswers(a=>a.map((v,k)=>k===i?j:v))}>{o}</button>)}</div></div>)}
        {error&&<div className="notice">{error}</div>}
        <button className="primary" disabled={busy||!name.trim()||count!==21} onClick={createChallenge}>{busy?"Creating…":"Create my challenge →"}</button>
      </>:<div className="result"><div className="eyebrow">Your challenge is ready</div><h2>Now let's see who knows you! 🎉</h2><p className="muted">Share this player link with your friends.</p><div className="notice"><a className="link" href={created.play_url}>{created.play_url}</a></div><button className="primary" onClick={()=>navigator.clipboard.writeText(created.play_url)}>Copy challenge link</button><p className="muted small">Keep your private dashboard link safe — it shows everyone’s scores.</p><div className="notice"><b>Creator dashboard</b><br/><a className="link" href={created.dashboard_url}>{created.dashboard_url}</a><br/><button className="primary" onClick={()=>navigator.clipboard.writeText(created.dashboard_url)}>Copy dashboard link</button></div><button className="option" onClick={()=>location.reload()}>Create another challenge</button></div>}
    </section><div className="footer">Made for the friends who really know you. 💜</div></main>;
}