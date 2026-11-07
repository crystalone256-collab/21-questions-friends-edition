import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(_request,{params}){
 try{
  const {challengeId}=await params;
  const {data,error}=await supabaseAdmin().from("challenges").select("id,creator_name").eq("id",challengeId).single();
  if(error)throw error;
  return NextResponse.json(data);
 }catch(error){return NextResponse.json({error:"This challenge could not be found."},{status:404});}
}
