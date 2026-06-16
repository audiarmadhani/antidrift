"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateDriftScore,
  driftScoreColor,
  interpretDriftScore,
} from "@/lib/drift/score";
import { useManifesto, useTodayCheckin } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function HeroDriftScore() {
  const { data: manifesto } = useManifesto();
  const { data: checkin } = useTodayCheckin();

  const score = calculateDriftScore(checkin ?? {});
  const interpretation = interpretDriftScore(score);
  const color = driftScoreColor(interpretation);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Who am I becoming?
        </p>
        <h2 className="mt-1.5 text-lg font-medium leading-snug md:text-xl">
          {manifesto?.identity_statement ?? "I am a builder who refuses to drift."}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Card className="rounded-2xl border-border bg-surface">
          <CardContent className="flex h-full flex-col justify-center px-4 py-4 md:px-5 md:py-5">
            <p className="text-xs text-muted-foreground">Today&apos;s Drift Score</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span
                className="text-4xl font-semibold tabular-nums md:text-5xl"
                style={{ color }}
              >
                {score}
              </span>
              <span className="text-lg text-muted-foreground">/6</span>
            </div>
            <span
              className="mt-2 inline-flex w-fit rounded-lg px-2.5 py-1 text-xs font-medium md:text-sm"
              style={{ color, backgroundColor: `${color}15` }}
            >
              {interpretation}
            </span>
          </CardContent>
        </Card>

        <Link href="/emergency" className="h-full">
          <Card
            className={cn(
              "h-full rounded-2xl border-accent-amber/30 bg-accent-amber/10",
              "transition-colors hover:bg-accent-amber/15"
            )}
          >
            <CardContent className="flex h-full min-h-[7.5rem] flex-col items-center justify-center px-3 py-4 text-center md:min-h-[8.5rem] md:px-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 md:text-xs">
                Emergency
              </p>
              <p className="mt-2 text-sm font-semibold leading-tight text-amber-400 md:text-base">
                I am having an urge
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
