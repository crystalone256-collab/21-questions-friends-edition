import {getSupabaseAdmin} from "../../../../lib/supabaseAdmin";
export async function GET(request,{params}){
 try{
  const {challengeId}=await params;const token=new URL(request.url).searchParams.get("token");
  if(!token)return Response.json({error:"Private dashboard link required."},{status:401});
  const db=getSupabaseAdmin();const {data:challenge,error:ce}=await db.from("challenges").select("creator_name,creator_token").eq("id",challengeId).single();
  if(ce||!challenge||challenge.creator_token!==token)return Response.json({error:"This dashboard link is invalid."},{status:403});
  const {data:attempts,error}=await db.from("attempts").select("id,player_name,score,created_at").eq("challenge_id",challengeId).order("score",{ascending:false}).order("created_at",{ascending:true});
  if(error)throw error;
  const leaderboard=(attempts||[]).map((a,i)=>({...a,rank:i+1}));
  return Response.json({creator_name:challenge.creator_name,total_attempts:leaderboard.length,highest_score:leaderboard[0]?.score||0,leaderboard});
 }catch(e){console.error("Leaderboard error:",e);return Response.json({error:"Could not load leaderboard."},{status:500})}
}