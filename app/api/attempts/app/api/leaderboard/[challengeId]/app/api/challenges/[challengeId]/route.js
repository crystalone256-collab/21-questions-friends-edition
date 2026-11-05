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
      .from("challenges")
      .select("id, creator_name, created_at")
      .eq("id", challengeId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Challenge not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ challenge: data });

  } catch (error) {
    console.error("Fetch challenge error:", error);

    return NextResponse.json(
      { error: "Could not load challenge." },
      { status: 500 }
    );
  }
}
