import { z } from "zod";
import { GOAL_CATEGORIES } from "./types";

export const goalCategorySchema = z.enum(GOAL_CATEGORIES);

export const goalCreateSchema = z.object({
  category: goalCategorySchema,
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  target_value: z.number().optional().nullable(),
  current_value: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
});

export const goalUpdateSchema = goalCreateSchema.partial();

export const checkinUpsertSchema = z.object({
  built_something: z.boolean().optional(),
  career_progress: z.boolean().optional(),
  quality_time_with_wife: z.boolean().optional(),
  exercise_or_golf: z.boolean().optional(),
  no_secret_behavior: z.boolean().optional(),
  sleep_hours: z.number().min(0).max(12).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const journalUpsertSchema = z.object({
  wins: z.string().optional().nullable(),
  errors: z.string().optional().nullable(),
  trigger: z.string().optional().nullable(),
  root_cause: z.string().optional().nullable(),
  system_fix: z.string().optional().nullable(),
  gratitude: z.string().optional().nullable(),
  future_self_note: z.string().optional().nullable(),
});

export const relapseCreateSchema = z.object({
  urge_level: z.number().min(1).max(10).optional().nullable(),
  emotion: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  time_of_day: z.string().optional().nullable(),
  behavior: z.string().optional().nullable(),
  money_spent: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const weeklyReviewUpsertSchema = z.object({
  wins: z.string().optional().nullable(),
  leaks: z.string().optional().nullable(),
  risks: z.string().optional().nullable(),
  root_cause: z.string().optional().nullable(),
  next_system: z.string().optional().nullable(),
});

export const manifestoUpdateSchema = z.object({
  age_35_vision: z.string().optional().nullable(),
  life_principles: z.string().optional().nullable(),
  fear_of_drift: z.string().optional().nullable(),
  identity_statement: z.string().optional().nullable(),
});

export const emergencySessionSchema = z.object({
  emotions: z.array(z.string()).min(1),
  urgency: z.number().min(1).max(10),
  predicted_feeling: z.string().optional().nullable(),
  estimated_cost: z.number().min(0).optional().nullable(),
  moved_towards_identity: z.boolean().optional().nullable(),
  urge_passed: z.boolean(),
  duration_seconds: z.number().min(0).optional().nullable(),
});

export const importSnapshotSchema = z.object({
  exportedAt: z.string().optional(),
  identity_manifesto: z.any().optional().nullable(),
  goals: z.array(z.any()).optional(),
  daily_checkins: z.array(z.any()).optional(),
  journal_entries: z.array(z.any()).optional(),
  relapse_logs: z.array(z.any()).optional(),
  weekly_reviews: z.array(z.any()).optional(),
  emergency_sessions: z.array(z.any()).optional(),
});
