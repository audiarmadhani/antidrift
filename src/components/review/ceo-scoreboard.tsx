"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CeoScores } from "@/lib/db/types";
import { getDomainLabel } from "@/lib/drift/ceo-scores";

function ScoreRing({ label, value }: { label: string; value: number }) {
  const data = [{ name: label, value, fill: "#10b981" }];
  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-normal text-muted-foreground text-center">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={8}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "#232428" }} dataKey="value" cornerRadius={4} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#fafafa" fontSize={20} fontWeight={600}>
              {value}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CeoScoreboard({ scores }: { scores: CeoScores }) {
  const domains: (keyof CeoScores)[] = [
    "business",
    "health",
    "marriage",
    "discipline",
    "overall",
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {domains.map((d) => (
        <ScoreRing key={d} label={getDomainLabel(d)} value={scores[d]} />
      ))}
    </div>
  );
}
