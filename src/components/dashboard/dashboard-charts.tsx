"use client";

import dynamic from "next/dynamic";

function ChartSkeleton() {
  return <div className="h-64 rounded-2xl bg-surface animate-pulse" />;
}

const DriftTrendChart = dynamic(
  () => import("./charts/drift-trend-chart").then((m) => m.DriftTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const UrgeTrendChart = dynamic(
  () => import("./charts/urge-trend-chart").then((m) => m.UrgeTrendChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const MoneyLeakageChart = dynamic(
  () => import("./charts/money-leakage-chart").then((m) => m.MoneyLeakageChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <DriftTrendChart />
      <UrgeTrendChart />
      <MoneyLeakageChart />
    </div>
  );
}
