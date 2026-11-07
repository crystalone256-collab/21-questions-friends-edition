import {getSupabaseAdmin} from "../../../../lib/supabaseAdmin";
export async function GET(_request,{params}){
 try{const {challengeId}=await params;const {data,error}=await getSupabaseAdmin().from("challenges").select("id,creator_name,created_at").eq("id",challengeId).single();if(error||!data)return Response.json({error:"Challenge not found."},{status:404});return Response.json(data)}
 catch(e){console.error(e);return Response.json({error:"Could not load challenge."},{status:500})}
}