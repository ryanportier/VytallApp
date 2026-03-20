import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai/claude";
import { VYTALL_SYSTEM_PROMPT, buildReflectionPrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = buildReflectionPrompt({
      workout_title: body.workout_title,
      exercises: body.exercises ?? [],
      duration_minutes: body.duration_minutes ?? 0,
      user_note: body.user_note,
      checkin_mode: body.checkin_mode ?? "FORGE",
      checkin_readiness: body.checkin_readiness ?? 70,
    });

    const raw = await callClaude(VYTALL_SYSTEM_PROMPT, prompt, 512);
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Optionally save reflection to workout record
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && body.workout_id) {
      await supabase
        .from("workouts")
        .update({ ai_reflection: JSON.stringify(result), completion_status: "completed" })
        .eq("id", body.workout_id)
        .eq("user_id", user.id);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[Claude Reflection]", err);
    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
