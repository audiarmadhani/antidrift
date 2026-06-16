"use client";

import { PageHeader } from "@/components/layout/page-header";
import { CategorySection } from "@/components/goals/category-section";
import { GOAL_CATEGORIES } from "@/lib/db/types";
import { useGoals } from "@/lib/hooks";
import { SkeletonPage } from "@/components/shared/skeleton-page";

export default function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals();

  if (isLoading) return <SkeletonPage />;

  return (
    <div className="space-y-10">
      <PageHeader title="Goals" description="Six domains. One direction." />
      {GOAL_CATEGORIES.map((cat) => (
        <CategorySection key={cat} category={cat} goals={goals} />
      ))}
    </div>
  );
}
