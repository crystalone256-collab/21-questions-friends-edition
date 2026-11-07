import {getSupabaseAdmin} from "../../../lib/supabaseAdmin";
export async function POST(request){
 try{
  const body=await request.json();const challenge_id=String(body.challenge_id||"");const player_name=String(body.player_name||"").trim();const answers=body.answers;
  if(!challenge_id||player_name.length<1||player_name.length>40||!Array.isArray(answers)||answers.length!==21||answers.some(a=>!Number.isInteger(a)||a<0||a>3))return Response.json({error:"Enter your name and answer all 21 questions."},{status:400});
  const db=getSupabaseAdmin();const {data:challenge,error:lookupError}=await db.from("challenges").select("answers").eq("id",challenge_id).single();
  if(lookupError||!challenge)return Response.json({error:"Challenge not found."},{status:404});
  const creator_answers=challenge.answers;const correct_answers=answers.map((a,i)=>a===creator_answers[i]);const score=correct_answers.filter(Boolean).length;
  const {data:attempt,error}=await db.from("attempts").insert({challenge_id,player_name,answers,score}).select("id").single();
  if(error)throw error;
  return Response.json({attempt_id:attempt.id,score,total:21,correct_answers,creator_answers});
 }catch(e){console.error("Attempt error:",e);return Response.json({error:"Could not save your attempt. Please try again."},{status:500})}
}