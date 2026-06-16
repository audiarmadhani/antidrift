import type { Goal, GoalCategory } from "@/lib/db/types";

export type GoalMetricKind = "currency" | "count" | "handicap" | "hours" | "value";

export interface GoalMetricPreset {
  label: string;
  unit: string;
  kind: GoalMetricKind;
  targetLabel: string;
  targetPlaceholder: string;
  currentLabel: string;
}

export interface CategoryGoalConfig {
  label: string;
  subtitle: string;
  metrics: GoalMetricPreset[];
  titlePlaceholder: string;
  examples: string[];
}

export const CATEGORY_GOAL_CONFIG: Record<GoalCategory, CategoryGoalConfig> = {
  wealth: {
    label: "Wealth",
    subtitle: "Financial targets and runway.",
    metrics: [
      {
        label: "Monthly income",
        unit: "IDR/month",
        kind: "currency",
        targetLabel: "Target monthly income (IDR)",
        targetPlaceholder: "25000000",
        currentLabel: "Current monthly income (IDR)",
      },
      {
        label: "Net worth",
        unit: "IDR",
        kind: "currency",
        targetLabel: "Target net worth (IDR)",
        targetPlaceholder: "1000000000",
        currentLabel: "Current net worth (IDR)",
      },
      {
        label: "Months of runway",
        unit: "months",
        kind: "count",
        targetLabel: "Target months of runway",
        targetPlaceholder: "12",
        currentLabel: "Current months saved",
      },
    ],
    titlePlaceholder: "e.g. Hit Rp25M/month income",
    examples: ["Monthly income", "Emergency fund", "Investment target"],
  },
  business: {
    label: "Business",
    subtitle: "What you're building and shipping.",
    metrics: [
      {
        label: "Projects shipped",
        unit: "projects",
        kind: "count",
        targetLabel: "Projects to ship",
        targetPlaceholder: "4",
        currentLabel: "Projects shipped",
      },
      {
        label: "Monthly business revenue",
        unit: "IDR/month",
        kind: "currency",
        targetLabel: "Target revenue (IDR/month)",
        targetPlaceholder: "50000000",
        currentLabel: "Current revenue (IDR/month)",
      },
      {
        label: "Job applications",
        unit: "applications",
        kind: "count",
        targetLabel: "Applications to send",
        targetPlaceholder: "20",
        currentLabel: "Applications sent",
      },
      {
        label: "Interviews completed",
        unit: "interviews",
        kind: "count",
        targetLabel: "Interviews target",
        targetPlaceholder: "5",
        currentLabel: "Interviews done",
      },
    ],
    titlePlaceholder: "e.g. Launch side project MVP",
    examples: ["Ship product", "Land 3 clients", "Close funding round"],
  },
  marriage: {
    label: "Marriage",
    subtitle: "Presence, honesty, and intentional time.",
    metrics: [
      {
        label: "Date nights per month",
        unit: "dates/month",
        kind: "count",
        targetLabel: "Date nights per month",
        targetPlaceholder: "4",
        currentLabel: "Date nights this month",
      },
      {
        label: "Quality hours per week",
        unit: "hrs/week",
        kind: "hours",
        targetLabel: "Quality hours per week",
        targetPlaceholder: "10",
        currentLabel: "Quality hours this week",
      },
      {
        label: "Hard conversations",
        unit: "conversations",
        kind: "count",
        targetLabel: "Honest conversations to have",
        targetPlaceholder: "2",
        currentLabel: "Conversations completed",
      },
    ],
    titlePlaceholder: "e.g. Weekly date night every Friday",
    examples: ["4 date nights/month", "Phone-free evenings", "Weekly check-in"],
  },
  health: {
    label: "Health",
    subtitle: "Body, sleep, and energy.",
    metrics: [
      {
        label: "Workouts per week",
        unit: "sessions/week",
        kind: "count",
        targetLabel: "Workouts per week",
        targetPlaceholder: "4",
        currentLabel: "Workouts this week",
      },
      {
        label: "Average sleep",
        unit: "hrs/night",
        kind: "hours",
        targetLabel: "Target sleep (hours/night)",
        targetPlaceholder: "7.5",
        currentLabel: "Current avg sleep",
      },
      {
        label: "Weight target",
        unit: "kg",
        kind: "value",
        targetLabel: "Target weight (kg)",
        targetPlaceholder: "75",
        currentLabel: "Current weight (kg)",
      },
    ],
    titlePlaceholder: "e.g. Train 4x per week",
    examples: ["7+ hours sleep", "Gym 4x/week", "Reach target weight"],
  },
  golf: {
    label: "Golf",
    subtitle: "Handicap and practice consistency.",
    metrics: [
      {
        label: "Handicap",
        unit: "handicap",
        kind: "handicap",
        targetLabel: "Target handicap",
        targetPlaceholder: "0",
        currentLabel: "Current handicap",
      },
      {
        label: "Practice sessions per week",
        unit: "sessions/week",
        kind: "count",
        targetLabel: "Practice sessions per week",
        targetPlaceholder: "3",
        currentLabel: "Sessions this week",
      },
    ],
    titlePlaceholder: "e.g. Reach scratch handicap",
    examples: ["Scratch handicap", "Break 80", "Practice 3x/week"],
  },
  character: {
    label: "Character",
    subtitle: "Systems, discipline, and who you're becoming.",
    metrics: [
      {
        label: "Systems installed",
        unit: "systems",
        kind: "count",
        targetLabel: "Systems to install",
        targetPlaceholder: "3",
        currentLabel: "Systems active",
      },
      {
        label: "Habits maintained",
        unit: "habits",
        kind: "count",
        targetLabel: "Habits to maintain",
        targetPlaceholder: "5",
        currentLabel: "Habits on track",
      },
      {
        label: "Days without secret behavior",
        unit: "days",
        kind: "count",
        targetLabel: "Day streak target",
        targetPlaceholder: "30",
        currentLabel: "Current streak",
      },
    ],
    titlePlaceholder: "e.g. No secret behavior for 30 days",
    examples: ["Delete trigger apps", "Morning routine", "30-day honesty streak"],
  },
};

export function getMetricPreset(
  category: GoalCategory,
  unit: string | null
): GoalMetricPreset {
  const config = CATEGORY_GOAL_CONFIG[category];
  return (
    config.metrics.find((m) => m.unit === unit) ?? config.metrics[0]
  );
}

export function computeGoalProgress(goal: Goal): number {
  const metric = getMetricPreset(goal.category, goal.unit);
  const current = goal.current_value ?? 0;
  const target = goal.target_value;

  if (target == null || target === 0) {
    if (metric.kind === "handicap") {
      return current <= 0 ? 100 : Math.max(0, Math.min(100, ((18 - current) / 18) * 100));
    }
    return 0;
  }

  if (metric.kind === "handicap") {
    if (current <= target) return 100;
    const ceiling = Math.max(current, 18);
    return Math.max(0, Math.min(100, ((ceiling - current) / (ceiling - target)) * 100));
  }

  return Math.min(100, (current / target) * 100);
}

export function formatGoalValue(
  value: number | null,
  kind: GoalMetricKind,
  unit: string | null
): string {
  if (value == null) return "—";

  if (kind === "currency") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (kind === "handicap") {
    return value === 0 ? "Scratch (0)" : String(value);
  }

  if (kind === "hours") {
    return `${value} ${unit ?? "hrs"}`;
  }

  return `${value.toLocaleString()} ${unit ?? ""}`.trim();
}

export function formatGoalProgressLabel(goal: Goal): string {
  const metric = getMetricPreset(goal.category, goal.unit);
  const current = formatGoalValue(goal.current_value, metric.kind, goal.unit);
  const target = formatGoalValue(goal.target_value, metric.kind, goal.unit);
  return `${current} → ${target}`;
}
