import type {
  CeoScores,
  DailyCheckin,
  EmergencySession,
  Goal,
  WeeklyReview,
} from "@/lib/db/types";

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function avgGoalProgress(goals: Goal[], categories: string[]): number {
  const filtered = goals.filter((g) => categories.includes(g.category));
  if (filtered.length === 0) return 0;
  const progresses = filtered.map((g) => {
    if (!g.target_value || g.target_value === 0) return 0;
    return Math.min(100, ((g.current_value ?? 0) / g.target_value) * 100);
  });
  return progresses.reduce((a, b) => a + b, 0) / progresses.length;
}

function countTrue(checkins: DailyCheckin[], field: keyof DailyCheckin): number {
  return checkins.filter((c) => c[field] === true).length;
}

function avgSleep(checkins: DailyCheckin[]): number {
  const withSleep = checkins.filter((c) => c.sleep_hours != null);
  if (withSleep.length === 0) return 0;
  return withSleep.reduce((a, c) => a + (c.sleep_hours ?? 0), 0) / withSleep.length;
}

function urgeSuccessRate(sessions: EmergencySession[]): number {
  if (sessions.length === 0) return 0;
  const passed = sessions.filter((s) => s.urge_passed === true).length;
  return passed / sessions.length;
}

export function computeCeoScores(
  checkins: DailyCheckin[],
  goals: Goal[],
  emergencySessions: EmergencySession[]
): CeoScores {
  const days = Math.max(checkins.length, 1);
  const careerDays = countTrue(checkins, "career_progress");
  const builtDays = countTrue(checkins, "built_something");
  const exerciseDays = countTrue(checkins, "exercise_or_golf");
  const qualityDays = countTrue(checkins, "quality_time_with_wife");
  const honestyDays = countTrue(checkins, "no_secret_behavior");
  const goalProgress = avgGoalProgress(goals, ["wealth", "business"]);
  const sleepAvg = avgSleep(checkins);
  const urgeRate = urgeSuccessRate(emergencySessions);

  const business = clamp(
    (careerDays / 7) * 40 + (builtDays / 7) * 30 + (goalProgress / 100) * 30
  );
  const health = clamp((exerciseDays / 7) * 50 + (sleepAvg / 8) * 50);
  const marriage = clamp((qualityDays / 7) * 60 + (honestyDays / 7) * 40);
  const discipline = clamp((honestyDays / 7) * 50 + urgeRate * 50);
  const overall = clamp((business + health + marriage + discipline) / 4);

  return { business, health, marriage, discipline, overall };
}

export function applyScoresToReview(
  review: WeeklyReview,
  scores: CeoScores
): WeeklyReview {
  return {
    ...review,
    business_score: scores.business,
    health_score: scores.health,
    marriage_score: scores.marriage,
    discipline_score: scores.discipline,
    overall_drift_score: scores.overall,
  };
}

export function getDomainLabel(domain: keyof CeoScores): string {
  const labels: Record<keyof CeoScores, string> = {
    business: "Business",
    health: "Health",
    marriage: "Marriage",
    discipline: "Discipline",
    overall: "Overall Drift",
  };
  return labels[domain];
}
