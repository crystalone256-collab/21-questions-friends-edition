 "use client";
import { useEffect,useState } from "react";
import { questions } from "../../../lib/questions";

export default function PlayPage({params}) {
  const [id,setId]=useState("");const [challenge,setChallenge]=useState(null);
  const [name,setName]=useState("");const [answers,setAnswers]=useState(Array(21).fill(null));
  const [result,setResult]=useState(null);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  useEffect(()=>{Promise.resolve(params).then(p=>setId(p.id))},[params]);
  useEffect(()=>{if(!id)return;fetch(`/api/challenges/${id}`).then(r=>r.json()).then(d=>{if(d.error)throw new Error(d.error);setChallenge(d)}).catch(e=>setError(e.message))},[id]);
  async function submit(){setBusy(true);setError("");try{const r=await fetch("/api/attempts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challenge_id:id,player_name:name,answers})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not submit answers.");setResult(d)}catch(e){setError(e.message)}finally{setBusy(false)}}
  if(error&&!challenge)return <main><div className="panel">{error}</div></main>;
  if(!challenge)return <main><div className="panel">Loading challenge…</div></main>;
  return <main><header className="hero"><div className="eyebrow">Friends Edition</div><h1>21 QUESTIONS</h1><p>How well do you know {challenge.creator_name}? 👀</p></header><section className="panel">
    {!result?<><div className="field"><label>Your name</label><input className="input" value={name} maxLength="40" onChange={e=>setName(e.target.value)} placeholder="Enter your name"/></div><div className="progress"><span style={{width:`${answers.filter(x=>x!==null).length/21*100}%`}}/></div>
    {questions.map((q,i)=><div className="question" key={i}><p><strong>{i+1}. {q.question}</strong></p><div className="options">{q.options.map((o,j)=><button type="button" key={j} className={`option ${answers[i]===j?"selected":""}`} onClick={()=>setAnswers(a=>a.map((v,k)=>k===i?j:v))}>{o}</button>)}</div></div>)}
    {error&&<div className="notice">{error}</div>}<button className="primary" disabled={busy||!name.trim()||answers.some(x=>x===null)} onClick={submit}>{busy?"Checking your answers…":"Submit my answers →"}</button></>
    :<div className="result"><div className="eyebrow">Your result</div><div className="score">{result.score}/21</div><h2>{result.score>=17?"You really know them! 🔥":result.score>=10?"Not bad, good friend! 💜":"Looks like you have more to discover 😅"}</h2><p className="muted">You got {result.score} out of 21 correct.</p>{questions.map((q,i)=><div className="answer-row" key={i}><b>{i+1}. {q.question}</b><span className={result.correct_answers[i]?"correct":"wrong"}>{result.correct_answers[i]?"✓ Correct":"✗ Not quite"}</span><div className="small muted">Your answer: {q.options[answers[i]]}</div><div className="small">Their answer: <b>{q.options[result.creator_answers[i]]}</b></div></div>)}<a className="primary" style={{display:"block",textDecoration:"none"}} href="/">Create your own challenge</a></div>}
  </section></main>;
}