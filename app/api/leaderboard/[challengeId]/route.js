import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(request, { params }) {
  try {
    const { challengeId } = await params;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(challengeId)) {
      return NextResponse.json(
        { error: "Invalid challenge ID." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("attempts")
      .select("id, player_name, score, created_at")
      .eq("challenge_id", challengeId)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) throw error;

    const leaderboard = data.map((attempt, index) => ({
      ...attempt,
      rank: index + 1
    }));

    return NextResponse.json({
      total_attempts: leaderboard.length,
      highest_score: leaderboard[0]?.score ?? null,
      leaderboard
    });

  } catch (error) {
    console.error("Leaderboard error:", error);

    return NextResponse.json(
      { error: "Could not load leaderboard." },
      { status: 500 }
    );
  }
}
