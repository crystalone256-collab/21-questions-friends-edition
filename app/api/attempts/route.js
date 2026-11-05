import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  try {
    const { challenge_id, player_name, answers } =
      await request.json();

    if (
      typeof challenge_id !== "string" ||
      typeof player_name !== "string" ||
      player_name.trim().length < 1 ||
      player_name.trim().length > 40 ||
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
        { error: "Invalid attempt details." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: challenge, error: challengeError } =
      await supabase
        .from("challenges")
        .select("answers")
        .eq("id", challenge_id)
        .single();

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: "Challenge not found." },
        { status: 404 }
      );
    }

    const correctAnswers = challenge.answers;

    const score = answers.reduce(
      (total, answer, index) =>
        total + (answer === correctAnswers[index] ? 1 : 0),
      0
    );

    const { data, error } = await supabase
      .from("attempts")
      .insert({
        challenge_id,
        player_name: player_name.trim(),
        answers,
        score
      })
      .select("id, score")
      .single();

    if (error) throw error;

    return NextResponse.json({
      attempt_id: data.id,
      score,
      total: 21,
      correct_answers: correctAnswers
    });

  } catch (error) {
    console.error("Attempt error:", error);

    return NextResponse.json(
      { error: "Could not submit attempt." },
      { status: 500 }
    );
  }
}
