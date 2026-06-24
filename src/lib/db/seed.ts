import type { Goal, IdentityManifesto } from "@/lib/db/types";

export const DEFAULT_MANIFESTO: IdentityManifesto = {
  id: 1,
  identity_statement: "I am a builder who refuses to drift.",
  fear_of_drift: "At 38: no wife, no kids, money gone, nothing built.",
  age_35_vision: `Multiple businesses
Hundreds of millions per month
Safe and sound marriage
One child
Scratch golfer
Healthy body
Builder of meaningful things`,
  life_principles: `Drift destroys lives.
Systems beat motivation.
Builders debug systems.
Identity drives behavior.
Small actions compound.`,
  updated_at: new Date().toISOString(),
};

export function defaultGoals(now: string): Goal[] {
  return [
    {
      id: crypto.randomUUID(),
      category: "wealth",
      title: "Monthly Income",
      description: "Rp25M/month target",
      target_value: 25000000,
      current_value: 0,
      unit: "IDR/month",
      deadline: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: crypto.randomUUID(),
      category: "business",
      title: "Ship MVP",
      description: "Launch first product version",
      target_value: 1,
      current_value: 0,
      unit: "projects",
      deadline: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: crypto.randomUUID(),
      category: "marriage",
      title: "Weekly Date Night",
      description: "Four intentional dates per month",
      target_value: 4,
      current_value: 0,
      unit: "dates/month",
      deadline: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: crypto.randomUUID(),
      category: "health",
      title: "Train Consistently",
      description: "Four workouts per week",
      target_value: 4,
      current_value: 0,
      unit: "sessions/week",
      deadline: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: crypto.randomUUID(),
      category: "golf",
      title: "Scratch Handicap",
      description: "Work from 18 to scratch",
      target_value: 0,
      current_value: 18,
      unit: "handicap",
      deadline: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: crypto.randomUUID(),
      category: "character",
      title: "30-Day Honesty Streak",
      description: "No secret behavior for 30 days",
      target_value: 30,
      current_value: 0,
      unit: "days",
      deadline: null,
      created_at: now,
      updated_at: now,
    },
  ];
}
