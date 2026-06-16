"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  calculateDriftScore,
  driftScoreColor,
  interpretDriftScore,
} from "@/lib/drift/score";
import { useManifesto, useTodayCheckin } from "@/lib/hooks";

export function HeroDriftScore() {
  const { data: manifesto } = useManifesto();
  const { data: checkin } = useTodayCheckin();

  const score = calculateDriftScore(checkin ?? {});
  const interpretation = interpretDriftScore(score);
  const color = driftScoreColor(interpretation);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Who am I becoming?
        </p>
        <h2 className="mt-2 text-xl font-medium leading-relaxed md:text-2xl">
          {manifesto?.identity_statement ?? "I am a builder who refuses to drift."}
        </h2>
      </div>
      <Card className="rounded-2xl border-border bg-surface overflow-hidden">
        <CardContent className="flex flex-col items-center py-10 md:flex-row md:justify-between md:px-10">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">Today&apos;s Drift Score</p>
            <p
              className="mt-1 text-6xl font-semibold tabular-nums"
              style={{ color }}
            >
              {score}
              <span className="text-2xl text-muted-foreground">/6</span>
            </p>
          </div>
          <div
            className="mt-6 rounded-xl px-6 py-3 text-lg font-medium md:mt-0"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {interpretation}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
