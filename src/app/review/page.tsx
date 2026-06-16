"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CeoScoreboard } from "@/components/review/ceo-scoreboard";
import {
  CeoReviewForm,
  hasReviewContent,
} from "@/components/review/ceo-review-form";
import { CeoLetter } from "@/components/review/ceo-letter";
import { ReviewHistory } from "@/components/review/review-history";
import { SkeletonPage } from "@/components/shared/skeleton-page";
import { getWeekStart, formatWeekLabel } from "@/lib/export/markdown";
import { useEnsureReview, useReview, useReviews } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import type { CeoScores } from "@/lib/db/types";

export default function ReviewPage() {
  const currentWeekStart = getWeekStart();
  const [selectedWeekStart, setSelectedWeekStart] = useState(currentWeekStart);

  const ensure = useEnsureReview();
  const { data: reviews = [] } = useReviews();
  const { data: review, isLoading, refetch } = useReview(selectedWeekStart);

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

  const showLetter = review && hasReviewContent(review);

  if (isLoading && !review) return <SkeletonPage />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Weekly CEO Review"
          description={`Week of ${formatWeekLabel(selectedWeekStart)}`}
        />
        {selectedWeekStart !== currentWeekStart && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl shrink-0"
            onClick={() => setSelectedWeekStart(currentWeekStart)}
          >
            Back to this week
          </Button>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Scoreboard</h2>
        <CeoScoreboard scores={scores} />
      </section>

      <CeoReviewForm
        weekStart={selectedWeekStart}
        review={review ?? null}
        isLoading={isLoading}
        onSubmitted={() => refetch()}
      />

      {showLetter && <CeoLetter review={review} />}

      <ReviewHistory
        reviews={reviews}
        selectedWeekStart={selectedWeekStart}
        currentWeekStart={currentWeekStart}
        onSelect={setSelectedWeekStart}
      />
    </div>
  );
}
