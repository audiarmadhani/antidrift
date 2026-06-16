import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { HeroDriftScore } from "@/components/dashboard/hero-drift-score";
import { DailyCheckinForm } from "@/components/dashboard/daily-checkin";
import { StatCards } from "@/components/dashboard/stat-cards";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { EmergencyEffectivenessCard } from "@/components/dashboard/emergency-effectiveness-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Operate your life with intention." />
      <HeroDriftScore />
      <DailyCheckinForm />
      <StatCards />
      <DashboardCharts />
      <EmergencyEffectivenessCard />
      <Link
        href="/relapse"
        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Log urge / behavior →
      </Link>
    </div>
  );
}
