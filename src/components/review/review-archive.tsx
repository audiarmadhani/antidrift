"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWeekLabel } from "@/lib/export/markdown";
import { useReviews } from "@/lib/hooks";
import { getWeekStart } from "@/lib/export/markdown";

export function ReviewArchive() {
  const { data: reviews = [] } = useReviews();
  const currentWeek = getWeekStart();
  const past = reviews.filter((r) => r.week_start !== currentWeek);

  if (past.length === 0) return null;

  const exportReview = (weekStart: string, format: "markdown" | "pdf") => {
    window.open(`/api/reviews/${weekStart}/export?format=${format}`, "_blank");
  };

  return (
    <div className="space-y-4 mt-12">
      <h2 className="text-lg font-semibold">Archive</h2>
      {past.map((r) => (
        <Card key={r.id} className="rounded-2xl border-border bg-surface">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Week of {formatWeekLabel(r.week_start)}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReview(r.week_start, "markdown")}
              >
                MD
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReview(r.week_start, "pdf")}
              >
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {r.ceo_summary ?? "No summary"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
