"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRelapses } from "@/lib/hooks";
import { format, parseISO, startOfMonth } from "date-fns";

export function RelapseAnalytics() {
  const { data: relapses = [] } = useRelapses();

  const emotions = new Map<string, number>();
  const times = new Map<string, number>();
  let totalUrge = 0;
  let urgeCount = 0;
  let totalMoney = 0;
  let monthlyMoney = 0;
  const monthStart = startOfMonth(new Date());

  for (const r of relapses) {
    if (r.emotion) emotions.set(r.emotion, (emotions.get(r.emotion) ?? 0) + 1);
    if (r.time_of_day) times.set(r.time_of_day, (times.get(r.time_of_day) ?? 0) + 1);
    if (r.urge_level != null) { totalUrge += r.urge_level; urgeCount++; }
    totalMoney += r.money_spent ?? 0;
    if (parseISO(r.created_at) >= monthStart) monthlyMoney += r.money_spent ?? 0;
  }

  const topEmotions = [...emotions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topTimes = [...times.entries()].sort((a, b) => b[1] - a[1]).slice(0, 1);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Top triggers</CardTitle></CardHeader>
        <CardContent className="text-sm">
          {topEmotions.length ? topEmotions.map(([e, c]) => <p key={e}>{e}: {c}</p>) : "—"}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Most common time</CardTitle></CardHeader>
        <CardContent className="text-sm">{topTimes[0]?.[0] ?? "—"}</CardContent>
      </Card>
      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Average urge</CardTitle></CardHeader>
        <CardContent className="text-2xl font-semibold">{urgeCount ? (totalUrge / urgeCount).toFixed(1) : "—"}</CardContent>
      </Card>
      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Money spent</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{totalMoney.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">This month: {monthlyMoney.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
