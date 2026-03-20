import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/ai/claude";
import { VYTALL_SYSTEM_PROMPT, buildGhostPrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get current scores (average of last 7 checkins + workouts)
    const { data: recentCheckins } = await supabase
      .from("daily_checkins")
      .select("readiness_score, energy, fatigue")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(7);

    const { data: recentWorkouts } = await supabase
      .from("workouts")
      .select("completion_status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(14);

    // Compute current snapshot
    const avgReadiness = recentCheckins?.length
      ? Math.round(recentCheckins.reduce((s, c) => s + c.readiness_score, 0) / recentCheckins.length)
      : 60;
    const completedCount = recentWorkouts?.filter((w) => w.completion_status === "completed").length ?? 0;
    const consistencyScore = recentWorkouts?.length
      ? Math.round((completedCount / recentWorkouts.length) * 100)
      : 50;

    const currentSnapshot = {
      consistency: consistencyScore,
      readiness: avgReadiness,
      technique: 72, // Phase 2: MediaPipe
      strength: 65,  // Phase 2: progression tracking
      recovery: Math.round((avgReadiness + (100 - (recentCheckins?.[0]?.fatigue ?? 5) * 10)) / 2),
    };

    // Get peak ghost snapshot
    const { data: peakGhost } = await supabase
      .rpc("get_peak_ghost", { p_user_id: user.id });

    if (!peakGhost) {
      // No ghost yet — save current as first snapshot
      await supabase.from("ghost_snapshots").insert({
        user_id: user.id,
        ...currentSnapshot,
        summary: "Initial baseline established.",
      });
      return NextResponse.json({
        current_vs_ghost: "No Ghost data yet. This session becomes your first baseline.",
        delta: { consistency: 0, readiness: 0, technique: 0, strength: 0, recovery: 0 },
        verdict: "The Ghost has not yet formed. Train consistently to establish it.",
        is_baseline: true,
      });
    }

    const peakDate = new Date(peakGhost.created_at);
    const daysSincePeak = Math.floor((Date.now() - peakDate.getTime()) / (1000 * 60 * 60 * 24));

    const prompt = buildGhostPrompt({
      current: currentSnapshot,
      ghost: {
        consistency: peakGhost.consistency_score,
        readiness: peakGhost.readiness_score,
        technique: peakGhost.technique_score,
        strength: peakGhost.strength_score,
        recovery: peakGhost.recovery_score,
        summary: peakGhost.summary,
      },
      days_since_peak: daysSincePeak,
    });

    const raw = await callClaude(VYTALL_SYSTEM_PROMPT, prompt, 512);
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    // Update current snapshot if it's better than peak
    const currentTotal = Object.values(currentSnapshot).reduce((a, b) => a + b, 0);
    const peakTotal = peakGhost.consistency_score + peakGhost.readiness_score + peakGhost.technique_score + peakGhost.strength_score + peakGhost.recovery_score;

    if (currentTotal > peakTotal) {
      await supabase.from("ghost_snapshots").insert({
        user_id: user.id,
        ...currentSnapshot,
        summary: result.verdict,
      });
    }

    return NextResponse.json({
      ...result,
      current: currentSnapshot,
      ghost: {
        consistency: peakGhost.consistency_score,
        readiness: peakGhost.readiness_score,
        technique: peakGhost.technique_score,
        strength: peakGhost.strength_score,
        recovery: peakGhost.recovery_score,
      },
      days_since_peak: daysSincePeak,
    });
  } catch (err) {
    console.error("[Claude Ghost]", err);
    return NextResponse.json({ error: "Failed to generate Ghost comparison" }, { status: 500 });
  }
}
