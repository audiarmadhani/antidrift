"use client";

import { Button } from "@/components/ui/button";
import {
  ceoReviewFilename,
  formatWeekLabel,
  reviewToMarkdown,
  reviewToPrintHtml,
} from "@/lib/export/markdown";
import { downloadTextFile, openPrintWindow } from "@/lib/export/download";
import { getReview } from "@/lib/db/local-store";
import { hasReviewContent } from "@/components/review/ceo-review-form";
import type { WeeklyReview } from "@/lib/db/types";
import { cn } from "@/lib/utils";

function reviewPreview(review: WeeklyReview): string {
  const text =
    review.wins?.trim() ||
    review.ceo_summary?.trim() ||
    review.next_system?.trim() ||
    review.risks?.trim();
  if (!text) return "Empty review";
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

interface ReviewHistoryProps {
  reviews: WeeklyReview[];
  selectedWeekStart: string;
  currentWeekStart: string;
  onSelect: (weekStart: string) => void;
}

export function ReviewHistory({
  reviews,
  selectedWeekStart,
  currentWeekStart,
  onSelect,
}: ReviewHistoryProps) {
  const submitted = reviews
    .filter(hasReviewContent)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));

  const exportReview = async (weekStart: string, format: "markdown" | "pdf") => {
    const review = await getReview(weekStart);
    if (!review) return;
    if (format === "markdown") {
      downloadTextFile(
        reviewToMarkdown(review),
        ceoReviewFilename(weekStart, "md"),
        "text/markdown"
      );
    } else {
      openPrintWindow(reviewToPrintHtml(review));
    }
  };

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Past submissions
      </h2>

      {submitted.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No submitted reviews yet. Complete and submit your first CEO review above.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {submitted.map((review) => {
            const isSelected = review.week_start === selectedWeekStart;
            const isCurrent = review.week_start === currentWeekStart;

            return (
              <li key={review.week_start}>
                <div
                  className={cn(
                    "rounded-xl border transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-surface"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(review.week_start)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-elevated/50 rounded-xl"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium">
                        Week of {formatWeekLabel(review.week_start)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isSelected ? "Viewing" : isCurrent ? "This week" : ""}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {reviewPreview(review)}
                    </p>
                    {review.overall_drift_score != null && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Overall drift: {review.overall_drift_score}/100
                      </p>
                    )}
                  </button>

                  {isSelected && (
                    <div className="flex gap-2 border-t border-border px-4 py-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => exportReview(review.week_start, "markdown")}
                      >
                        Export MD
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => exportReview(review.week_start, "pdf")}
                      >
                        Export PDF
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
