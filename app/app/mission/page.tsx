import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { DailyCheckin } from "@/types";
import { getModeColor } from "@/lib/utils/format";

export default async function MissionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get today's check-in
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: checkin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single() as { data: DailyCheckin | null };

  if (!checkin) {
    return (
      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
          Mission
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
          No Mission Yet
        </h1>
        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--ghost)", marginBottom: "12px" }}>✦</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "8px" }}>
            Check In First
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: ".85rem", color: "var(--ghost)", lineHeight: 1.6, marginBottom: "20px" }}>
            Your daily mission is generated from your check-in. Log your state to receive today's prescription.
          </p>
          <Link href="/app/check-in" className="btn-primary" style={{ display: "inline-block" }}>
            Start Check-In →
          </Link>
        </div>
      </div>
    );
  }

  // Mode to suggested exercises mapping
  const modeExercises: Record<string, Array<{ name: string; sets: number; reps: string; note: string }>> = {
    PUSH: [
      { name: "Bench Press", sets: 5, reps: "5", note: "85% 1RM — max effort" },
      { name: "Shoulder Press", sets: 4, reps: "6", note: "Heavy, controlled" },
      { name: "Push-Up", sets: 3, reps: "Max", note: "To failure" },
    ],
    FORGE: [
      { name: "Squat", sets: 4, reps: "8", note: "75% 1RM, 3s descent" },
      { name: "Bench Press", sets: 4, reps: "8", note: "Controlled tempo" },
      { name: "Barbell Row", sets: 3, reps: "10", note: "Full ROM" },
    ],
    MAINTAIN: [
      { name: "Squat", sets: 3, reps: "10", note: "Moderate load" },
      { name: "Push-Up", sets: 3, reps: "15", note: "Consistent pace" },
      { name: "Plank", sets: 3, reps: "45s", note: "Brace hard" },
    ],
    RESTORE: [
      { name: "Romanian Deadlift", sets: 3, reps: "12", note: "Light, focus on stretch" },
      { name: "Face Pull", sets: 3, reps: "15", note: "Band or cable" },
      { name: "Plank", sets: 2, reps: "30s", note: "Breath control" },
    ],
    RECOVER: [
      { name: "Plank", sets: 2, reps: "20s", note: "Very light" },
      { name: "Lunge", sets: 2, reps: "10", note: "Bodyweight only" },
      { name: "Push-Up", sets: 2, reps: "8", note: "Easy pace" },
    ],
  };

  const suggested = modeExercises[checkin.mode] ?? modeExercises.FORGE;
  const modeColorMap: Record<string, string> = {
    PUSH: "var(--bone)", FORGE: "var(--vital)", MAINTAIN: "var(--ash)", RESTORE: "var(--ghost)", RECOVER: "var(--signal)",
  };
  const modeColor = modeColorMap[checkin.mode] ?? "var(--bone)";

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
        Alchemy · Mission
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
        Today's Prescription
      </h1>

      {/* Mode + Readiness */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "6px" }}>Mode</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: ".1em", color: modeColor, textTransform: "uppercase" }}>
            {checkin.mode}
          </div>
        </div>
        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "6px" }}>Readiness</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--vital)" }}>
            {checkin.readiness_score}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div style={{ background: "var(--obsidian)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--vital)", marginBottom: "8px" }}>
          Alchemy · Assessment
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: ".9rem", color: "var(--ash)", lineHeight: 1.6, fontStyle: "italic" }}>
          "{checkin.ai_summary}"
        </p>
      </div>

      {/* State breakdown */}
      <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
          State Inputs
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Energy",      val: checkin.energy },
            { label: "Sleep",       val: checkin.sleep_quality },
            { label: "Fatigue",     val: checkin.fatigue },
            { label: "Mood",        val: checkin.mood },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ghost)" }}>{row.label}</span>
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ width: "6px", height: "6px", borderRadius: "1px", background: i < row.val ? "var(--vital)" : "var(--border)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {checkin.soreness?.length > 0 && (
          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ghost)" }}>
              Soreness: </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: ".8rem", color: "var(--ash)" }}>
              {checkin.soreness.join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Suggested exercises */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
          Suggested Exercises
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {suggested.map((ex, i) => (
            <div key={i} style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: ".95rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--bone)" }}>
                  {ex.name}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", color: "var(--ghost)", letterSpacing: ".08em", marginTop: "2px" }}>
                  {ex.note}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", color: "var(--ash)", letterSpacing: ".06em" }}>
                {ex.sets}×{ex.reps}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="/app/workouts" className="btn-primary" style={{ display: "block", textAlign: "center", width: "100%" }}>
        Start Workout →
      </Link>
    </div>
  );
}
