"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRelapses } from "@/lib/hooks";
import { moneyLeakageData } from "@/lib/drift/stats";

export function MoneyLeakageChart() {
  const { data: relapses = [] } = useRelapses();
  const data = moneyLeakageData(relapses);

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-medium">Money Leakage</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#232428" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#111214", border: "1px solid #232428" }} />
            <Bar dataKey="amount" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
