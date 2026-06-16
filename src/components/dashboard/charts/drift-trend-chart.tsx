"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckins } from "@/lib/hooks";
import { driftTrendData } from "@/lib/drift/stats";

export function DriftTrendChart() {
  const { data: checkins = [] } = useCheckins();
  const data = driftTrendData(checkins);

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-medium">30-day Drift Score</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#232428" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis domain={[0, 6]} tick={{ fill: "#71717a", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#111214", border: "1px solid #232428" }}
            />
            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
