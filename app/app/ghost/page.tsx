import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GhostClient from "./GhostClient";
import type { GhostSnapshot } from "@/types";

export default async function GhostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get peak ghost snapshot
  const { data: peakGhost } = await supabase
    .rpc("get_peak_ghost", { p_user_id: user.id }) as { data: GhostSnapshot | null };

  // Get latest snapshot (current)
  const { data: latestSnapshot } = await supabase
    .from("ghost_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single() as { data: GhostSnapshot | null };

  // Get last 7 checkins for current scores
  const { data: recentCheckins } = await supabase
    .from("daily_checkins")
    .select("readiness_score, energy, fatigue, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(7);

  // Get recent workouts for consistency
  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("completion_status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(14);

  // Compute current snapshot scores
  const avgReadiness = recentCheckins?.length
    ? Math.round(recentCheckins.reduce((s, c) => s + c.readiness_score, 0) / recentCheckins.length)
    : 0;

  const completedCount = recentWorkouts?.filter((w) => w.completion_status === "completed").length ?? 0;
  const consistencyScore = recentWorkouts?.length
    ? Math.round((completedCount / recentWorkouts.length) * 100)
    : 0;

  const avgFatigue = recentCheckins?.length
    ? recentCheckins.reduce((s, c) => s + c.fatigue, 0) / recentCheckins.length
    : 5;
  const recoveryScore = recentCheckins?.length
    ? Math.round((avgReadiness + (100 - avgFatigue * 10)) / 2)
    : 0;

  const currentScores = {
    consistency: consistencyScore,
    readiness: avgReadiness,
    technique: latestSnapshot?.technique_score ?? 0,
    strength: latestSnapshot?.strength_score ?? 0,
    recovery: recoveryScore,
  };

  const hasData = avgReadiness > 0 || consistencyScore > 0;

  return (
    <GhostClient
      currentScores={currentScores}
      peakGhost={peakGhost}
      hasData={hasData}
      userId={user.id}
    />
  );
}
