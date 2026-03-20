// ============================================================
// VYTALL — MediaPipe Pose Scoring (Phase 2)
// ============================================================
// Phase 1: Scaffold only. Full implementation in Phase 2.
// Supports: squat, push-up, plank

export type SupportedExercise = "squat" | "push-up" | "plank";

export interface PoseScores {
  technique_score: number;   // 0–100
  tempo_score: number;       // 0–100
  rom_score: number;         // 0–100
  stability_score: number;   // 0–100
  corrections: string[];
}

/**
 * Analyze a video file and return pose scores.
 * Phase 2: Implement with MediaPipe Pose + landmark analysis.
 */
export async function analyzeMovement(
  videoBlob: Blob,
  exercise: SupportedExercise
): Promise<PoseScores> {
  // TODO Phase 2: 
  // 1. Load MediaPipe Pose model
  // 2. Extract frames from video
  // 3. Run pose estimation on each frame
  // 4. Calculate joint angles and movement quality
  // 5. Score technique, tempo, ROM, stability

  console.warn("[MediaPipe] Movement analysis not yet implemented (Phase 2)");

  return {
    technique_score: 0,
    tempo_score: 0,
    rom_score: 0,
    stability_score: 0,
    corrections: ["Movement analysis available in Phase 2."],
  };
}

// ─── Exercise-specific angle thresholds (Phase 2 reference) ──

export const EXERCISE_THRESHOLDS = {
  squat: {
    knee_min_angle: 70,  // degrees at bottom
    hip_min_angle: 65,
    spine_tolerance: 15, // max lean from vertical
  },
  "push-up": {
    elbow_bottom_angle: 90,
    hip_alignment_tolerance: 10,
    spine_tolerance: 8,
  },
  plank: {
    hip_alignment_tolerance: 8,
    shoulder_alignment_tolerance: 5,
    spine_tolerance: 5,
  },
};
