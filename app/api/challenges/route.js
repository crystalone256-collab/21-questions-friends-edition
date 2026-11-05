import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  try {
    const { creator_name, answers } = await request.json();

    if (
      typeof creator_name !== "string" ||
      creator_name.trim().length < 1 ||
      creator_name.trim().length > 40 ||
      !Array.isArray(answers) ||
      answers.length !== 21 ||
      !answers.every(
        (answer) =>
          Number.isInteger(answer) &&
          answer >= 0 &&
          answer <= 3
      )
    ) {
      return NextResponse.json(
        { error: "Invalid challenge details." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("challenges")
      .insert({
        creator_name: creator_name.trim(),
        answers
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Create challenge error:", error);

    return NextResponse.json(
      { error: "Could not create challenge." },
      { status: 500 }
    );
  }
}
