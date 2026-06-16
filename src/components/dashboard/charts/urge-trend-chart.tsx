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
import { useRelapses } from "@/lib/hooks";
import { urgeTrendData } from "@/lib/drift/stats";

export function UrgeTrendChart() {
  const { data: relapses = [] } = useRelapses();
  const data = urgeTrendData(relapses);

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-medium">Urge Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#232428" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#111214", border: "1px solid #232428" }} />
            <Line type="monotone" dataKey="urge" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
