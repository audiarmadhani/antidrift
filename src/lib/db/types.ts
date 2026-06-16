export const GOAL_CATEGORIES = [
  "wealth",
  "business",
  "marriage",
  "health",
  "golf",
  "character",
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export interface Goal {
  id: string;
  category: GoalCategory;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyCheckin {
  id: string;
  date: string;
  built_something: boolean;
  career_progress: boolean;
  quality_time_with_wife: boolean;
  exercise_or_golf: boolean;
  no_secret_behavior: boolean;
  sleep_hours: number | null;
  notes: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  wins: string | null;
  errors: string | null;
  trigger: string | null;
  root_cause: string | null;
  system_fix: string | null;
  gratitude: string | null;
  future_self_note: string | null;
  created_at: string;
}

export interface RelapseLog {
  id: string;
  urge_level: number | null;
  emotion: string | null;
  location: string | null;
  time_of_day: string | null;
  behavior: string | null;
  money_spent: number | null;
  notes: string | null;
  created_at: string;
}

export interface WeeklyReview {
  id: string;
  week_start: string;
  wins: string | null;
  leaks: string | null;
  risks: string | null;
  root_cause: string | null;
  next_system: string | null;
  business_score: number | null;
  health_score: number | null;
  marriage_score: number | null;
  discipline_score: number | null;
  overall_drift_score: number | null;
  ceo_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface IdentityManifesto {
  id: number;
  age_35_vision: string | null;
  life_principles: string | null;
  fear_of_drift: string | null;
  identity_statement: string | null;
  updated_at: string;
}

export interface EmergencySession {
  id: string;
  emotions: string[];
  urgency: number | null;
  predicted_feeling: string | null;
  estimated_cost: number | null;
  moved_towards_identity: boolean | null;
  urge_passed: boolean | null;
  duration_seconds: number | null;
  created_at: string;
}

export interface ExportSnapshot {
  exportedAt: string;
  identity_manifesto: IdentityManifesto | null;
  goals: Goal[];
  daily_checkins: DailyCheckin[];
  journal_entries: JournalEntry[];
  relapse_logs: RelapseLog[];
  weekly_reviews: WeeklyReview[];
  emergency_sessions: EmergencySession[];
}

export type DriftInterpretation = "Drifting" | "Stable" | "Building";

export interface DashboardStats {
  currentStreak: number;
  daysWithoutSecretBehavior: number;
  daysWithoutValidationSpending: number;
  careerSessionsThisMonth: number;
  golfSessionsThisMonth: number;
}

export interface CeoScores {
  business: number;
  health: number;
  marriage: number;
  discipline: number;
  overall: number;
}

export interface EmergencyAnalytics {
  successRate: number;
  topEmotions: { emotion: string; count: number }[];
  averageDurationSeconds: number;
  effectiveness30Day: number;
  effectiveness90Day: number;
  totalSessions: number;
}
