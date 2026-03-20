"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const EXERCISES = [
  "Squat", "Deadlift", "Bench Press", "Pull-Up", "Push-Up",
  "Plank", "Lunge", "Barbell Row", "Shoulder Press", "Hip Thrust",
  "Romanian Deadlift", "Incline Press", "Tricep Dip", "Curl",
  "Face Pull", "Leg Press", "Cable Row", "Lat Pulldown",
];

const SESSION_TYPES = [
  "Upper Push", "Upper Pull", "Lower", "Full Body",
  "Cardio", "Mobility", "HIIT", "Active Recovery",
];

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration_seconds: number | null;
  effort: number;
}

interface Reflection {
  improved: string;
  weakened: string;
  noticed: string;
  tomorrow: string;
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [todayMode, setTodayMode] = useState<string | null>(null);
  const [todayReadiness, setTodayReadiness] = useState<number>(70);

  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: 8, duration_seconds: null, effort: 7 },
  ]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);

  // Fetch today's check-in for context
  useEffect(() => {
    async function fetchCheckin() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("daily_checkins")
        .select("mode, readiness_score")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setTodayMode(data.mode);
        setTodayReadiness(data.readiness_score);
      }
    }
    fetchCheckin();
    setStartTime(new Date());
  }, []);

  function updateExercise(i: number, field: keyof Exercise, value: string | number | null) {
    setExercises((ex) =>
      ex.map((e, idx) => (idx === i ? { ...e, [field]: value } : e))
    );
  }

  function addExercise() {
    setExercises((ex) => [
      ...ex,
      { name: "", sets: 3, reps: 8, duration_seconds: null, effort: 7 },
    ]);
  }

  function removeExercise(i: number) {
    setExercises((ex) => ex.filter((_, idx) => idx !== i));
  }

  async function handleComplete() {
    if (!title.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const durationMins = startTime
      ? Math.round((Date.now() - startTime.getTime()) / 60000)
      : 0;

    try {
      // 1. Save workout to DB
      const { data: workout, error: wErr } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,
          title: title.trim(),
          session_type: sessionType || "General",
          duration_minutes: durationMins,
          completion_status: "completed",
          user_note: note.trim() || null,
        })
        .select()
        .single();

      if (wErr) throw wErr;
      setWorkoutId(workout.id);

      // 2. Save exercise results
      const validExercises = exercises.filter((e) => e.name);
      if (validExercises.length > 0) {
        await supabase.from("exercise_results").insert(
          validExercises.map((e) => ({
            workout_id: workout.id,
            exercise_name: e.name,
            sets: e.sets,
            reps: e.reps,
            duration_seconds: e.duration_seconds,
            effort_score: e.effort,
          }))
        );
      }

      // 3. Get AI reflection
      const res = await fetch("/api/claude/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workout_id: workout.id,
          workout_title: title,
          exercises: validExercises.map((e) => ({
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            effort: e.effort,
          })),
          duration_minutes: durationMins,
          user_note: note,
          checkin_mode: todayMode ?? "FORGE",
          checkin_readiness: todayReadiness,
        }),
      });

      const reflectionData = await res.json();
      setReflection(reflectionData);
    } catch (err) {
      console.error(err);
      alert("Error saving workout. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Reflection screen
  if (reflection) {
    return (
      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
          Post-Workout
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
          Reflection
        </h1>

        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>Logged</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--bone)" }}>{title}</div>
        </div>

        {[
          { label: "Improved",  value: reflection.improved,  color: "var(--vital)" },
          { label: "Weakened",  value: reflection.weakened,  color: "var(--signal)" },
          { label: "Noticed",   value: reflection.noticed,   color: "var(--ash)" },
          { label: "Tomorrow",  value: reflection.tomorrow,  color: "var(--bone)" },
        ].map((item) => (
          <div key={item.label} style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 18px", marginBottom: "10px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", color: item.color, marginBottom: "8px" }}>
              {item.label}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: ".9rem", color: "var(--ash)", lineHeight: 1.55 }}>
              {item.value}
            </p>
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button
            className="btn-ghost"
            style={{ flex: 1 }}
            onClick={() => {
              setReflection(null);
              setTitle("");
              setSessionType("");
              setExercises([{ name: "", sets: 3, reps: 8, duration_seconds: null, effort: 7 }]);
              setNote("");
              setStartTime(new Date());
            }}
          >
            Log Another
          </button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => router.push("/app")}>
            Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
        Session Log
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
        Log Workout
      </h1>

      {/* Today's mode context */}
      {todayMode && (
        <div style={{ background: "var(--obsidian)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ghost)" }}>Today's Mode</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".1em", color: "var(--bone)" }}>{todayMode}</div>
          <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: ".5rem", color: "var(--vital)", letterSpacing: ".08em" }}>
            Readiness {todayReadiness}
          </div>
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
          Session Title
        </label>
        <input
          type="text" value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="e.g. Upper Push — Week 3"
          autoFocus
        />
      </div>

      {/* Session type */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
          Session Type
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {SESSION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSessionType(t)}
              style={{
                background: sessionType === t ? "var(--vital-dim)" : "var(--graphite)",
                border: `1px solid ${sessionType === t ? "var(--vital)" : "var(--border)"}`,
                color: sessionType === t ? "var(--bone)" : "var(--ghost)",
                fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em",
                textTransform: "uppercase", padding: "6px 12px", borderRadius: "6px",
                cursor: "pointer", transition: "all .15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
          Exercises
        </label>
        {exercises.map((ex, i) => (
          <div key={i} style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)" }}>
                Exercise {i + 1}
              </div>
              {exercises.length > 1 && (
                <button
                  onClick={() => removeExercise(i)}
                  style={{ background: "none", border: "none", color: "var(--ghost)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".08em", textTransform: "uppercase" }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Exercise name */}
            <select
              value={ex.name}
              onChange={(e) => updateExercise(i, "name", e.target.value)}
              className="input-field"
              style={{ marginBottom: "10px" }}
            >
              <option value="">Select exercise...</option>
              {EXERCISES.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>

            {/* Sets / Reps / Effort */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { field: "sets" as const,   label: "Sets",     min: 1, max: 20 },
                { field: "reps" as const,   label: "Reps",     min: 1, max: 100 },
                { field: "effort" as const, label: "Effort /10", min: 1, max: 10 },
              ].map(({ field, label, min, max }) => (
                <div key={field}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "5px" }}>
                    {label}
                  </div>
                  <input
                    type="number"
                    value={ex[field] as number}
                    onChange={(e) => updateExercise(i, field, Number(e.target.value))}
                    min={min} max={max}
                    className="input-field"
                    style={{ textAlign: "center", padding: "10px 8px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          className="btn-ghost"
          style={{ width: "100%", fontSize: ".78rem" }}
          onClick={addExercise}
        >
          + Add Exercise
        </button>
      </div>

      {/* Note */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field"
          placeholder="How did it feel? Anything notable?"
          rows={2}
          style={{ resize: "none" }}
        />
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%", opacity: loading ? .6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        onClick={handleComplete}
        disabled={loading || !title.trim()}
      >
        {loading ? "Saving & Reflecting..." : "Complete Workout →"}
      </button>
    </div>
  );
}
