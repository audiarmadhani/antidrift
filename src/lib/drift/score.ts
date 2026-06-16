import type { DailyCheckin, DriftInterpretation } from "@/lib/db/types";

export function calculateDriftScore(checkin: Partial<DailyCheckin>): number {
  let score = 0;
  if (checkin.built_something) score++;
  if (checkin.career_progress) score++;
  if (checkin.quality_time_with_wife) score++;
  if (checkin.exercise_or_golf) score++;
  if (checkin.no_secret_behavior) score++;
  if (checkin.sleep_hours != null && checkin.sleep_hours >= 7) score++;
  return score;
}

export function interpretDriftScore(score: number): DriftInterpretation {
  if (score <= 2) return "Drifting";
  if (score <= 4) return "Stable";
  return "Building";
}

export function driftScoreColor(interpretation: DriftInterpretation): string {
  switch (interpretation) {
    case "Drifting":
      return "#ef4444";
    case "Stable":
      return "#d97706";
    case "Building":
      return "#10b981";
  }
}
