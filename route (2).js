import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request){
 try{
  const body=await request.json();
  const {challengeId,participantName,answers}=body;
  const name=String(participantName||"").trim();
  if(!challengeId||name.length<1||name.length>40||!Array.isArray(answers)||answers.length!==21||answers.some(a=>!Number.isInteger(a)||a<0||a>3))
   return NextResponse.json({error:"Please provide your name and 21 valid answers."},{status:400});
  const db=supabaseAdmin();
  const {data:challenge,error:challengeError}=await db.from("challenges").select("answers").eq("id",challengeId).single();
  if(challengeError||!challenge)return NextResponse.json({error:"Challenge not found."},{status:404});
  const score=answers.reduce((sum,answer,index)=>sum+(answer===challenge.answers[index]?1:0),0);
  const {error}=await db.from("attempts").insert({challenge_id:challengeId,participant_name:name,answers,score});
  if(error)throw error;
  return NextResponse.json({score,correctAnswers:answers,creatorAnswers:challenge.answers});
 }catch(error){console.error("Submit attempt error:",error);return NextResponse.json({error:error.message||"Could not submit your answers."},{status:500});}
}
