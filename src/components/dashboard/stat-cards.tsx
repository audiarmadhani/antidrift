"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckins, useRelapses } from "@/lib/hooks";
import { buildDashboardStats } from "@/lib/drift/stats";

export function StatCards() {
  const { data: checkins = [] } = useCheckins();
  const { data: relapses = [] } = useRelapses();
  const stats = buildDashboardStats(checkins, relapses);

  const items = [
    { label: "Current streak", value: `${stats.currentStreak} days` },
    { label: "Days without secret behavior", value: `${stats.daysWithoutSecretBehavior}` },
    {
      label: "Days without validation spending",
      value: `${stats.daysWithoutValidationSpending}`,
    },
    { label: "Career sessions this month", value: `${stats.careerSessionsThisMonth}` },
    { label: "Golf sessions this month", value: `${stats.golfSessionsThisMonth}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="rounded-2xl border-border bg-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
