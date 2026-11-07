import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request){
 try{
  const body=await request.json();
  const creatorName=String(body.creatorName||"").trim();
  const answers=body.answers;
  if(creatorName.length<1||creatorName.length>40||!Array.isArray(answers)||answers.length!==21||answers.some(a=>!Number.isInteger(a)||a<0||a>3))
   return NextResponse.json({error:"Please provide a name and 21 valid answers."},{status:400});
  const token=randomBytes(32).toString("hex");
  const {data,error}=await supabaseAdmin().from("challenges").insert({creator_name:creatorName,answers,creator_token:token}).select("id").single();
  if(error)throw error;
  return NextResponse.json({id:data.id,token});
 }catch(error){console.error("Create challenge error:",error);return NextResponse.json({error:error.message||"Could not create challenge."},{status:500});}
}
