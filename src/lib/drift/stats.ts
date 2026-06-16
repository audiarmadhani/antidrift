import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import type { DailyCheckin, RelapseLog } from "@/lib/db/types";
import { calculateDriftScore } from "./score";

function sortByDateDesc(checkins: DailyCheckin[]): DailyCheckin[] {
  return [...checkins].sort((a, b) => b.date.localeCompare(a.date));
}

export function computeCurrentStreak(checkins: DailyCheckin[]): number {
  const sorted = sortByDateDesc(checkins);
  let streak = 0;
  for (const c of sorted) {
    if (calculateDriftScore(c) >= 3) streak++;
    else break;
  }
  return streak;
}

export function computeDaysWithoutSecretBehavior(checkins: DailyCheckin[]): number {
  const sorted = sortByDateDesc(checkins);
  let days = 0;
  for (const c of sorted) {
    if (c.no_secret_behavior) days++;
    else break;
  }
  return days;
}

export function computeDaysWithoutValidationSpending(
  checkins: DailyCheckin[],
  relapses: RelapseLog[]
): number {
  const spendingDates = new Set(
    relapses
      .filter((r) => (r.money_spent ?? 0) > 0)
      .map((r) => format(parseISO(r.created_at), "yyyy-MM-dd"))
  );

  const sorted = sortByDateDesc(checkins);
  if (sorted.length === 0) {
    const today = format(new Date(), "yyyy-MM-dd");
    return spendingDates.has(today) ? 0 : 1;
  }

  let days = 0;
  for (const c of sorted) {
    if (!spendingDates.has(c.date)) days++;
    else break;
  }
  return days;
}

export function countCareerSessionsThisMonth(checkins: DailyCheckin[]): number {
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };
  return checkins.filter(
    (c) => c.career_progress && isWithinInterval(parseISO(c.date), interval)
  ).length;
}

export function countGolfSessionsThisMonth(checkins: DailyCheckin[]): number {
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };
  return checkins.filter(
    (c) => c.exercise_or_golf && isWithinInterval(parseISO(c.date), interval)
  ).length;
}

export function buildDashboardStats(
  checkins: DailyCheckin[],
  relapses: RelapseLog[]
) {
  return {
    currentStreak: computeCurrentStreak(checkins),
    daysWithoutSecretBehavior: computeDaysWithoutSecretBehavior(checkins),
    daysWithoutValidationSpending: computeDaysWithoutValidationSpending(
      checkins,
      relapses
    ),
    careerSessionsThisMonth: countCareerSessionsThisMonth(checkins),
    golfSessionsThisMonth: countGolfSessionsThisMonth(checkins),
  };
}

export function driftTrendData(checkins: DailyCheckin[], days = 30) {
  const sorted = [...checkins]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);
  return sorted.map((c) => ({
    date: c.date,
    score: calculateDriftScore(c),
  }));
}

export function urgeTrendData(relapses: RelapseLog[], days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const byDate = new Map<string, { total: number; count: number }>();

  for (const r of relapses) {
    const d = format(parseISO(r.created_at), "yyyy-MM-dd");
    const date = parseISO(d);
    if (date < cutoff || r.urge_level == null) continue;
    const existing = byDate.get(d) ?? { total: 0, count: 0 };
    existing.total += r.urge_level;
    existing.count++;
    byDate.set(d, existing);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { total, count }]) => ({
      date,
      urge: Math.round((total / count) * 10) / 10,
    }));
}

export function moneyLeakageData(relapses: RelapseLog[], days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const byDate = new Map<string, number>();

  for (const r of relapses) {
    const d = format(parseISO(r.created_at), "yyyy-MM-dd");
    const date = parseISO(d);
    if (date < cutoff) continue;
    byDate.set(d, (byDate.get(d) ?? 0) + (r.money_spent ?? 0));
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));
}
