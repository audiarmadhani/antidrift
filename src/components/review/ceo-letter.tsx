"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyReview } from "@/lib/db/types";

export function CeoLetter({ review }: { review: WeeklyReview | null }) {
  if (!review?.ceo_summary) return null;

  return (
    <Card className="rounded-2xl border-border bg-surface border-primary/20">
      <CardHeader>
        <CardTitle className="text-base font-medium">CEO Letter</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
          {review.ceo_summary}
        </pre>
      </CardContent>
    </Card>
  );
}
