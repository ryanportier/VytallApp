// ============================================================
// VYTALL — Claude Prompt Templates
// ============================================================

export const VYTALL_SYSTEM_PROMPT = `You are the VYTALL intelligence — a precise, observant vitality AI.
Your voice is calm, controlled, intelligent. Never motivational-poster cheesy. Never generic.
You speak in short, precise sentences. You observe. You analyze. You prescribe.
Always respond in the exact JSON structure requested. No preamble, no markdown, just the JSON.`;

// ─── Check-in interpretation ──────────────────────────────────
export function buildCheckinPrompt(data: {
  energy: number;
  sleep_quality: number;
  fatigue: number;
  mood: number;
  soreness: string[];
  time_available: number;
  note?: string;
  user_goal: string;
  user_level: string;
}): string {
  return `Analyze this athlete's daily check-in and return a JSON object.

CHECK-IN DATA:
- Energy (1-10): ${data.energy}
- Sleep Quality (1-10): ${data.sleep_quality}
- Fatigue (1-10): ${data.fatigue}
- Mood (1-10): ${data.mood}
- Soreness areas: ${data.soreness.length ? data.soreness.join(", ") : "none"}
- Time available: ${data.time_available} minutes
- User note: ${data.note || "none"}
- User goal: ${data.user_goal}
- Training level: ${data.user_level}

Return ONLY this JSON structure:
{
  "readiness_score": <0-100 integer>,
  "mode": <one of: "FORGE"|"RESTORE"|"MAINTAIN"|"PUSH"|"RECOVER">,
  "mission": <one sentence mission for today, specific and actionable>,
  "explanation": <2-3 sentences in VYTALL voice explaining today's prescription>,
  "ai_summary": <one sharp sentence summarizing today's state>
}

Mode guidelines:
- PUSH: High energy, good sleep, ready to exceed limits
- FORGE: Good energy, build fundamental strength
- MAINTAIN: Average energy, sustain without regression
- RESTORE: Low energy/sleep, active recovery focus
- RECOVER: Poor state, rest or minimal movement only`;
}

// ─── Post-workout reflection ──────────────────────────────────
export function buildReflectionPrompt(data: {
  workout_title: string;
  exercises: Array<{ name: string; sets: number; reps: number; effort: number }>;
  duration_minutes: number;
  user_note?: string;
  checkin_mode: string;
  checkin_readiness: number;
}): string {
  return `Analyze this completed workout and generate a reflection.

WORKOUT: ${data.workout_title}
MODE: ${data.checkin_mode} | READINESS: ${data.checkin_readiness}/100
DURATION: ${data.duration_minutes} minutes
EXERCISES: ${JSON.stringify(data.exercises)}
USER NOTE: ${data.user_note || "none"}

Return ONLY this JSON:
{
  "improved": <one sharp sentence about what got stronger or better>,
  "weakened": <one honest sentence about what showed weakness or limitation>,
  "noticed": <one observational sentence about a pattern the system detected>,
  "tomorrow": <one sentence prescription for tomorrow based on today>
}`;
}

// ─── Archive entry generation ─────────────────────────────────
export function buildArchivePrompt(data: {
  recent_checkins: Array<{ date: string; mode: string; readiness: number; summary: string }>;
  recent_workouts: Array<{ date: string; title: string; status: string; reflection?: string }>;
  entry_type: "chapter" | "breakthrough" | "setback" | "recovery" | "era";
}): string {
  return `Generate an archive entry for this athlete's training narrative.

RECENT CHECK-INS: ${JSON.stringify(data.recent_checkins)}
RECENT WORKOUTS: ${JSON.stringify(data.recent_workouts)}
ENTRY TYPE: ${data.entry_type}

Return ONLY this JSON:
{
  "title": <evocative title for this period, e.g. "The Unstable Stretch", "Return to Form">,
  "body": <2-4 sentences of vivid, precise narrative about this training period. Use VYTALL voice — observant, honest, controlled.>
}`;
}

// ─── Ghost comparison ─────────────────────────────────────────
export function buildGhostPrompt(data: {
  current: {
    consistency: number;
    readiness: number;
    technique: number;
    strength: number;
    recovery: number;
  };
  ghost: {
    consistency: number;
    readiness: number;
    technique: number;
    strength: number;
    recovery: number;
    summary: string;
  };
  days_since_peak: number;
}): string {
  return `Compare current self against Ghost (peak historical self).

CURRENT SCORES:
- Consistency: ${data.current.consistency}/100
- Readiness: ${data.current.readiness}/100
- Technique: ${data.current.technique}/100
- Strength: ${data.current.strength}/100
- Recovery: ${data.current.recovery}/100

GHOST SCORES (peak self, ${data.days_since_peak} days ago):
- Consistency: ${data.ghost.consistency}/100
- Readiness: ${data.ghost.readiness}/100
- Technique: ${data.ghost.technique}/100
- Strength: ${data.ghost.strength}/100
- Recovery: ${data.ghost.recovery}/100
- Peak summary: ${data.ghost.summary}

Return ONLY this JSON:
{
  "current_vs_ghost": <2-3 sentences comparing present self to Ghost, precise and honest>,
  "delta": {
    "consistency": <current minus ghost, integer>,
    "readiness": <current minus ghost, integer>,
    "technique": <current minus ghost, integer>,
    "strength": <current minus ghost, integer>,
    "recovery": <current minus ghost, integer>
  },
  "verdict": <one sharp, precise sentence verdict on the gap or alignment>
}`;
}
