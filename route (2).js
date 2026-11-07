import {randomBytes} from "crypto";
import {getSupabaseAdmin} from "../../../lib/supabaseAdmin";

export async function POST(request){
 try{
  const body=await request.json();const name=String(body.creator_name||"").trim();const answers=body.answers;
  if(name.length<1||name.length>40||!Array.isArray(answers)||answers.length!==21||answers.some(a=>!Number.isInteger(a)||a<0||a>3))return Response.json({error:"Enter your name and answer all 21 questions."},{status:400});
  const token=randomBytes(32).toString("hex");const db=getSupabaseAdmin();
  const {data,error}=await db.from("challenges").insert({creator_name:name,answers,creator_token:token}).select("id").single();
  if(error)throw error;
  const origin=process.env.NEXT_PUBLIC_SITE_URL||new URL(request.url).origin;
  return Response.json({id:data.id,play_url:`${origin}/play/${data.id}`,dashboard_url:`${origin}/dashboard/${data.id}?token=${token}`});
 }catch(e){console.error("Create challenge error:",e);return Response.json({error:"Could not create the challenge. Check your database setup and try again."},{status:500})}
}