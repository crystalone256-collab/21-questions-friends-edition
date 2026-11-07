import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(request,{params}){
 try{
  const {challengeId}=await params;
  const token=new URL(request.url).searchParams.get("token");
  if(!token)return NextResponse.json({error:"Missing dashboard token."},{status:401});
  const db=supabaseAdmin();
  const {data:challenge,error:challengeError}=await db.from("challenges").select("id").eq("id",challengeId).eq("creator_token",token).single();
  if(challengeError||!challenge)return NextResponse.json({error:"Invalid dashboard link."},{status:403});
  const {data:attempts,error}=await db.from("attempts").select("id,participant_name,score,created_at").eq("challenge_id",challengeId).order("score",{ascending:false}).order("created_at",{ascending:true});
  if(error)throw error;
  return NextResponse.json({attempts:attempts||[]});
 }catch(error){console.error("Leaderboard error:",error);return NextResponse.json({error:"Could not load leaderboard."},{status:500});}
}
