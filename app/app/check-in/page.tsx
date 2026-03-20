"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SORENESS_AREAS = [
  "Neck", "Shoulders", "Upper Back", "Lower Back", "Chest",
  "Arms", "Core", "Hips", "Quads", "Hamstrings", "Calves", "Knees", "Ankles",
];

interface CheckinResult {
  mode: string;
  readiness_score: number;
  mission: string;
  explanation: string;
  ai_summary: string;
}

function SliderInput({
  label, value, onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const color = value >= 7 ? "#4a7c59" : value >= 4 ? "#e6a817" : "#c0392b";
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)" }}>
          {label}
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color, lineHeight: 1 }}>
          {value}
        </div>
      </div>
      <input
        type="range" min={1} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", height: "2px", accentColor: color, cursor: "pointer", outline: "none" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", color: "var(--ghost)", letterSpacing: ".08em", textTransform: "uppercase" }}>Low</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", color: "var(--ghost)", letterSpacing: ".08em", textTransform: "uppercase" }}>High</span>
      </div>
    </div>
  );
}

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [existingCheckin, setExistingCheckin] = useState<CheckinResult | null>(null);

  const [form, setForm] = useState({
    energy: 6,
    sleep_quality: 7,
    fatigue: 4,
    mood: 7,
    soreness: [] as string[],
    time_available: 45,
    note: "",
  });

  const [result, setResult] = useState<CheckinResult | null>(null);

  // Check if already checked in today
  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("daily_checkins")
        .select("mode, readiness_score, ai_summary")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setAlreadyCheckedIn(true);
        setExistingCheckin(data as CheckinResult);
      }
    }
    check();
  }, []);

  function toggleSoreness(area: string) {
    setForm((f) => ({
      ...f,
      soreness: f.soreness.includes(area)
        ? f.soreness.filter((a) => a !== area)
        : [...f.soreness, area],
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/claude/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("API error");
      const data: CheckinResult = await res.json();
      setResult(data);
      setStep(3);
    } catch {
      alert("Error processing check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Already checked in today
  if (alreadyCheckedIn && existingCheckin && !result) {
    return (
      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
          Daily Check-In
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
          Already Logged
        </h1>

        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>Mode</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: ".1em", color: "var(--bone)", textTransform: "uppercase" }}>
                {existingCheckin.mode}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>Readiness</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--vital)" }}>
                {existingCheckin.readiness_score}
              </div>
            </div>
          </div>
          <div style={{ background: "var(--obsidian)", borderRadius: "8px", padding: "12px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: ".875rem", color: "var(--ash)", lineHeight: 1.55, fontStyle: "italic" }}>
              "{existingCheckin.ai_summary}"
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-ghost"
            style={{ flex: 1, fontSize: ".78rem" }}
            onClick={() => setAlreadyCheckedIn(false)}
          >
            Check In Again
          </button>
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            onClick={() => router.push("/app/mission")}
          >
            View Mission →
          </button>
        </div>
      </div>
    );
  }

  // Result screen
  if (step === 3 && result) {
    return (
      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
          Alchemy · Result
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
          Today's Prescription
        </h1>

        {/* Mode + Readiness */}
        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "6px" }}>Mode</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, letterSpacing: ".1em", color: "var(--bone)", textTransform: "uppercase" }}>
                {result.mode}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "6px" }}>Readiness</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "var(--vital)" }}>
                {result.readiness_score}
              </div>
            </div>
          </div>

          {/* Mission */}
          <div style={{ background: "var(--obsidian)", borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--vital)", marginBottom: "6px" }}>
              Mission
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: ".95rem", color: "var(--bone)", lineHeight: 1.55 }}>
              {result.mission}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div style={{ background: "var(--obsidian)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
            Assessment
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: ".875rem", color: "var(--ash)", lineHeight: 1.65, fontStyle: "italic" }}>
            "{result.explanation}"
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={() => router.push("/app")}>
            Dashboard
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => router.push("/app/workouts")}>
            Start Workout →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
            Daily Check-In · Step {step}/2
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)" }}>
            {step === 1 ? "Your State" : "Body & Time"}
          </h1>
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: "6px", paddingTop: "6px" }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ width: "28px", height: "3px", borderRadius: "2px", background: step >= s ? "var(--vital)" : "var(--border)", transition: "background .3s" }} />
          ))}
        </div>
      </div>

      {/* Step 1 — Energy / Sleep / Fatigue / Mood */}
      {step === 1 && (
        <div>
          <SliderInput label="Energy Level"   value={form.energy}        onChange={(v) => setForm((f) => ({ ...f, energy: v }))} />
          <SliderInput label="Sleep Quality"  value={form.sleep_quality} onChange={(v) => setForm((f) => ({ ...f, sleep_quality: v }))} />
          <SliderInput label="Fatigue"        value={form.fatigue}       onChange={(v) => setForm((f) => ({ ...f, fatigue: v }))} />
          <SliderInput label="Mood"           value={form.mood}          onChange={(v) => setForm((f) => ({ ...f, mood: v }))} />
          <button className="btn-primary" style={{ width: "100%", marginTop: "8px" }} onClick={() => setStep(2)}>
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 — Soreness / Time / Note */}
      {step === 2 && (
        <div>
          {/* Soreness */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
              Soreness / Pain Areas
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SORENESS_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleSoreness(area)}
                  style={{
                    background: form.soreness.includes(area) ? "var(--vital-dim)" : "var(--graphite)",
                    border: `1px solid ${form.soreness.includes(area) ? "var(--vital)" : "var(--border)"}`,
                    color: form.soreness.includes(area) ? "var(--bone)" : "var(--ghost)",
                    fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".1em",
                    textTransform: "uppercase", padding: "6px 12px", borderRadius: "6px",
                    cursor: "pointer", transition: "all .15s",
                  }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Time available */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
              Time Available
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[20, 30, 45, 60, 90].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, time_available: t }))}
                  style={{
                    background: form.time_available === t ? "var(--vital-dim)" : "var(--graphite)",
                    border: `1px solid ${form.time_available === t ? "var(--vital)" : "var(--border)"}`,
                    color: form.time_available === t ? "var(--bone)" : "var(--ghost)",
                    fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600,
                    padding: "10px 16px", borderRadius: "8px", cursor: "pointer", transition: "all .15s",
                    minWidth: "56px",
                  }}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>

          {/* Optional note */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
              Optional Note
            </div>
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="input-field"
              placeholder="Anything the system should know today..."
              rows={3}
              style={{ resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn-primary"
              style={{ flex: 2, opacity: loading ? .6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Get Mission →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
