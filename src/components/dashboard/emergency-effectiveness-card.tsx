"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmergencyAnalytics } from "@/lib/hooks";

export function EmergencyEffectivenessCard() {
  const { data } = useEmergencyAnalytics();

  if (!data || data.totalSessions === 0) return null;

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-medium">Emergency Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Urge success rate (30d):{" "}
          <span className="text-foreground font-medium">
            {Math.round(data.effectiveness30Day * 100)}%
          </span>
        </p>
        <p>
          Total sessions:{" "}
          <span className="text-foreground font-medium">{data.totalSessions}</span>
        </p>
        <Link href="/emergency" className="text-primary text-xs hover:underline">
          Open Emergency Mode
        </Link>
      </CardContent>
    </Card>
  );
}
