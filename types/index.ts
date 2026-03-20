// ============================================================
// VYTALL — Core Types
// ============================================================

export type UserLevel = "beginner" | "intermediate" | "advanced" | "elite";
export type TrainingMode = "FORGE" | "RESTORE" | "MAINTAIN" | "PUSH" | "RECOVER";
export type SubscriptionPlan = "free" | "premium" | "elite";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

// ─── Database row types ───────────────────────────────────────

export interface VUser {
  id: string;
  email: string;
  name: string;
  goal: string;
  level: UserLevel;
  equipment: string[];
  session_preference: number; // minutes
  days_per_week: number;
  restrictions: string | null;
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  energy: number;        // 1–10
  sleep_quality: number; // 1–10
  fatigue: number;       // 1–10
  mood: number;          // 1–10
  soreness: string[];    // body areas
  time_available: number; // minutes
  note: string | null;
  readiness_score: number; // 0–100 computed
  mode: TrainingMode;
  ai_summary: string;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  session_type: string;
  duration_minutes: number;
  completion_status: "planned" | "in_progress" | "completed" | "skipped";
  user_note: string | null;
  ai_reflection: string | null;
  created_at: string;
}

export interface ExerciseResult {
  id: string;
  workout_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  duration_seconds: number | null;
  effort_score: number; // 1–10
  created_at: string;
}

export interface VideoAnalysis {
  id: string;
  user_id: string;
  workout_id: string;
  exercise_name: string;
  video_url: string;
  technique_score: number;
  tempo_score: number;
  rom_score: number;
  stability_score: number;
  corrections: string[];
  created_at: string;
}

export interface ArchiveEntry {
  id: string;
  user_id: string;
  title: string;
  body: string;
  entry_type: "chapter" | "breakthrough" | "setback" | "recovery" | "era";
  created_at: string;
}

export interface GhostSnapshot {
  id: string;
  user_id: string;
  consistency_score: number;
  readiness_score: number;
  technique_score: number;
  strength_score: number;
  recovery_score: number;
  summary: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  created_at: string;
}

export interface X402Payment {
  id: string;
  user_id: string;
  feature_key: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

// ─── Claude API response types ────────────────────────────────

export interface CheckinResponse {
  readiness_score: number;
  mode: TrainingMode;
  mission: string;
  explanation: string;
  ai_summary: string;
}

export interface ReflectionResponse {
  improved: string;
  weakened: string;
  noticed: string;
  tomorrow: string;
}

export interface GhostComparisonResponse {
  current_vs_ghost: string;
  delta: {
    consistency: number;
    readiness: number;
    technique: number;
    strength: number;
    recovery: number;
  };
  verdict: string;
}

// ─── UI / Client types ────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface CheckinFormData {
  energy: number;
  sleep_quality: number;
  fatigue: number;
  mood: number;
  soreness: string[];
  time_available: number;
  note?: string;
}

export interface OnboardingFormData {
  name: string;
  goal: string;
  level: UserLevel;
  equipment: string[];
  session_preference: number;
  days_per_week: number;
  restrictions?: string;
}
