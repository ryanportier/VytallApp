import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai/claude";
import { VYTALL_SYSTEM_PROMPT, buildCheckinPrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get authenticated user (optional for MVP — falls back to defaults)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userGoal = "Build strength and improve fitness";
    let userLevel = "intermediate";

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("goal, level")
        .eq("id", user.id)
        .single();
      if (profile) {
        userGoal = profile.goal;
        userLevel = profile.level;
      }
    }

    const prompt = buildCheckinPrompt({
      energy: body.energy,
      sleep_quality: body.sleep_quality,
      fatigue: body.fatigue,
      mood: body.mood,
      soreness: body.soreness ?? [],
      time_available: body.time_available,
      note: body.note,
      user_goal: userGoal,
      user_level: userLevel,
    });

    const raw = await callClaude(VYTALL_SYSTEM_PROMPT, prompt, 512);

    // Strip potential markdown fences
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Save to DB if user is authenticated
    if (user) {
      await supabase.from("daily_checkins").insert({
        user_id: user.id,
        energy: body.energy,
        sleep_quality: body.sleep_quality,
        fatigue: body.fatigue,
        mood: body.mood,
        soreness: body.soreness ?? [],
        time_available: body.time_available,
        note: body.note ?? null,
        readiness_score: result.readiness_score,
        mode: result.mode,
        ai_summary: result.ai_summary,
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[Claude Checkin]", err);
    return NextResponse.json({ error: "Failed to process check-in" }, { status: 500 });
  }
}
