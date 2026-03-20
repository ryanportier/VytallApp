"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserLevel } from "@/types";

const EQUIPMENT_OPTIONS = [
  "Barbell", "Dumbbells", "Kettlebells", "Pull-up bar",
  "Resistance bands", "Bodyweight only", "Cable machine",
  "Bench", "Squat rack", "Treadmill", "Bike",
];
const GOALS = [
  "Build strength", "Lose body fat", "Improve endurance",
  "Athletic performance", "General fitness",
  "Muscle hypertrophy", "Injury recovery",
];
const LEVELS: { val: UserLevel; label: string; desc: string }[] = [
  { val: "beginner",     label: "Beginner",     desc: "Under 1 year training" },
  { val: "intermediate", label: "Intermediate", desc: "1–3 years consistent" },
  { val: "advanced",     label: "Advanced",     desc: "3+ years, periodized" },
  { val: "elite",        label: "Elite",        desc: "Competitive / professional" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", goal: "", level: "intermediate" as UserLevel,
    equipment: [] as string[], session_preference: 45,
    days_per_week: 4, restrictions: "",
  });

  function toggleEquipment(item: string) {
    setForm((f) => ({
      ...f,
      equipment: f.equipment.includes(item)
        ? f.equipment.filter((e) => e !== item)
        : [...f.equipment, item],
    }));
  }

  async function handleFinish() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: form.name.trim(),
      goal: form.goal,
      level: form.level,
      equipment: form.equipment,
      session_preference: form.session_preference,
      days_per_week: form.days_per_week,
      restrictions: form.restrictions.trim() || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  const totalSteps = 3;

  // Shared styles
  const chip = (active: boolean) => ({
    background: active ? "var(--vital-dim)" : "var(--graphite)",
    border: `1px solid ${active ? "var(--vital)" : "var(--border)"}`,
    color: active ? "var(--bone)" : "var(--ghost)",
    transition: "all .15s",
    cursor: "pointer" as const,
  });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflowX: "hidden" }}>
      {/* bg grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, letterSpacing: ".22em", color: "var(--bone)", textTransform: "uppercase", marginBottom: "24px" }}>
            VYTALL
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
            Onboarding · Step {step}/{totalSteps}
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: "2px", borderRadius: "1px", background: step > i ? "var(--vital)" : "var(--border)", transition: "background .3s" }} />
            ))}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--bone)" }}>
            {step === 1 && "Identity"}
            {step === 2 && "Equipment"}
            {step === 3 && "Schedule"}
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: ".8rem", color: "var(--ghost)", marginTop: "4px" }}>
            {step === 1 && "Tell the system who you are and what you're training for."}
            {step === 2 && "What tools do you have available?"}
            {step === 3 && "How much time can you commit?"}
          </p>
        </div>

        {/* Step 1 — Identity */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
                Your Name
              </label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="How should VYTALL address you?"
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
                Primary Goal
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {GOALS.map((g) => (
                  <button key={g} onClick={() => setForm((f) => ({ ...f, goal: g }))}
                    style={{ ...chip(form.goal === g), fontFamily: "var(--font-body)", fontSize: ".875rem", padding: "11px 14px", borderRadius: "8px", textAlign: "left" }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
                Training Level
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {LEVELS.map((l) => (
                  <button key={l.val} onClick={() => setForm((f) => ({ ...f, level: l.val }))}
                    style={{ ...chip(form.level === l.val), fontFamily: "var(--font-body)", fontSize: ".875rem", padding: "11px 14px", borderRadius: "8px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 500 }}>{l.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".08em", opacity: .7 }}>{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ width: "100%", marginTop: "4px" }}
              onClick={() => setStep(2)} disabled={!form.name.trim() || !form.goal}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Equipment */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
                Available Equipment
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <button key={eq} onClick={() => toggleEquipment(eq)}
                    style={{ ...chip(form.equipment.includes(eq)), fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", padding: "7px 12px", borderRadius: "6px" }}>
                    {eq}
                  </button>
                ))}
              </div>
              {form.equipment.length === 0 && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", color: "var(--ghost)", marginTop: "8px", letterSpacing: ".06em" }}>
                  Select at least one, or choose "Bodyweight only"
                </p>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
                Restrictions / Injuries (optional)
              </label>
              <textarea
                value={form.restrictions}
                onChange={(e) => setForm((f) => ({ ...f, restrictions: e.target.value }))}
                className="input-field" rows={2} style={{ resize: "none" }}
                placeholder="e.g. Lower back pain, no jumping..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}
                disabled={form.equipment.length === 0}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Schedule */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
                Preferred Session Length
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[20, 30, 45, 60, 90].map((t) => (
                  <button key={t}
                    onClick={() => setForm((f) => ({ ...f, session_preference: t }))}
                    style={{ ...chip(form.session_preference === t), fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, padding: "10px 16px", borderRadius: "8px", minWidth: "56px" }}>
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
                Training Days Per Week
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[2, 3, 4, 5, 6, 7].map((d) => (
                  <button key={d}
                    onClick={() => setForm((f) => ({ ...f, days_per_week: d }))}
                    style={{ ...chip(form.days_per_week === d), fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, width: "44px", height: "44px", borderRadius: "8px" }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "12px" }}>
                Profile Summary
              </div>
              {[
                { l: "Name",     v: form.name },
                { l: "Goal",     v: form.goal },
                { l: "Level",    v: form.level },
                { l: "Sessions", v: `${form.session_preference}min × ${form.days_per_week}x/week` },
                { l: "Gear",     v: form.equipment.slice(0, 3).join(", ") + (form.equipment.length > 3 ? ` +${form.equipment.length - 3}` : "") },
              ].map((row) => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", color: "var(--ghost)", textTransform: "uppercase", letterSpacing: ".08em" }}>{row.l}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: ".82rem", color: "var(--ash)" }}>{row.v}</span>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ background: "rgba(192,57,43,.1)", border: "1px solid rgba(192,57,43,.3)", borderRadius: "8px", padding: "12px", fontFamily: "var(--font-body)", fontSize: ".825rem", color: "#e74c3c" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleFinish} disabled={loading}>
                {loading ? "Building Profile..." : "Enter VYTALL →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
