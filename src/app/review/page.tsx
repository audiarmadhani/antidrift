"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CeoScoreboard } from "@/components/review/ceo-scoreboard";
import { CeoReviewForm } from "@/components/review/ceo-review-form";
import { CeoLetter } from "@/components/review/ceo-letter";
import { ReviewArchive } from "@/components/review/review-archive";
import { SkeletonPage } from "@/components/shared/skeleton-page";
import { getWeekStart, formatWeekLabel } from "@/lib/export/markdown";
import { useEnsureReview, useReview } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import type { CeoScores } from "@/lib/db/types";

export default function ReviewPage() {
  const weekStart = getWeekStart();
  const ensure = useEnsureReview();
  const { data: review, isLoading } = useReview(weekStart);

  useEffect(() => {
    ensure.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scores: CeoScores = {
    business: review?.business_score ?? 0,
    health: review?.health_score ?? 0,
    marriage: review?.marriage_score ?? 0,
    discipline: review?.discipline_score ?? 0,
    overall: review?.overall_drift_score ?? 0,
  };

  if (isLoading && !review) return <SkeletonPage />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Weekly CEO Review"
          description={`Week of ${formatWeekLabel(weekStart)}`}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => window.open(`/api/reviews/${weekStart}/export?format=markdown`, "_blank")}
          >
            Export MD
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => window.open(`/api/reviews/${weekStart}/export?format=pdf`, "_blank")}
          >
            Export PDF
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Scoreboard</h2>
        <CeoScoreboard scores={scores} />
      </section>

      <CeoReviewForm weekStart={weekStart} review={review ?? null} />
      <CeoLetter review={review ?? null} />
      <ReviewArchive />
    </div>
  );
}
