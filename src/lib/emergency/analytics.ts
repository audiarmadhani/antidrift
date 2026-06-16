import { subDays, parseISO } from "date-fns";
import type { EmergencyAnalytics, EmergencySession } from "@/lib/db/types";

function successRateInWindow(sessions: EmergencySession[], days: number): number {
  const cutoff = subDays(new Date(), days);
  const filtered = sessions.filter(
    (s) => parseISO(s.created_at) >= cutoff
  );
  if (filtered.length === 0) return 0;
  return filtered.filter((s) => s.urge_passed === true).length / filtered.length;
}

export function computeEmergencyAnalytics(
  sessions: EmergencySession[]
): EmergencyAnalytics {
  const total = sessions.length;
  const passed = sessions.filter((s) => s.urge_passed === true).length;
  const successRate = total > 0 ? passed / total : 0;

  const emotionCounts = new Map<string, number>();
  for (const s of sessions) {
    for (const e of s.emotions) {
      emotionCounts.set(e, (emotionCounts.get(e) ?? 0) + 1);
    }
  }

  const topEmotions = Array.from(emotionCounts.entries())
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const withDuration = sessions.filter((s) => s.duration_seconds != null);
  const averageDurationSeconds =
    withDuration.length > 0
      ? withDuration.reduce((a, s) => a + (s.duration_seconds ?? 0), 0) /
        withDuration.length
      : 0;

  return {
    successRate,
    topEmotions,
    averageDurationSeconds,
    effectiveness30Day: successRateInWindow(sessions, 30),
    effectiveness90Day: successRateInWindow(sessions, 90),
    totalSessions: total,
  };
}
