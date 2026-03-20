import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai/claude";
import { VYTALL_SYSTEM_PROMPT, buildArchivePrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Fetch recent data from DB
    const [checkinsRes, workoutsRes] = await Promise.all([
      supabase.from("daily_checkins").select("created_at, mode, readiness_score, ai_summary").eq("user_id", user.id).order("created_at", { ascending: false }).limit(14),
      supabase.from("workouts").select("created_at, title, completion_status, ai_reflection").eq("user_id", user.id).order("created_at", { ascending: false }).limit(14),
    ]);

    const prompt = buildArchivePrompt({
      recent_checkins: (checkinsRes.data ?? []).map((c) => ({
        date: c.created_at,
        mode: c.mode,
        readiness: c.readiness_score,
        summary: c.ai_summary,
      })),
      recent_workouts: (workoutsRes.data ?? []).map((w) => ({
        date: w.created_at,
        title: w.title,
        status: w.completion_status,
        reflection: w.ai_reflection ?? undefined,
      })),
      entry_type: body.entry_type ?? "chapter",
    });

    const raw = await callClaude(VYTALL_SYSTEM_PROMPT, prompt, 512);
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Save archive entry
    const { data: entry } = await supabase
      .from("archive_entries")
      .insert({
        user_id: user.id,
        title: result.title,
        body: result.body,
        entry_type: body.entry_type ?? "chapter",
      })
      .select()
      .single();

    return NextResponse.json({ ...result, id: entry?.id });
  } catch (err) {
    console.error("[Claude Archive]", err);
    return NextResponse.json({ error: "Failed to generate archive entry" }, { status: 500 });
  }
}
