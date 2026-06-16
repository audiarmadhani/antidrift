"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useUpsertReview } from "@/lib/hooks";
import type { WeeklyReview } from "@/lib/db/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const sections = [
  {
    key: "wins" as const,
    title: "Wins",
    prompt: "What did I build this week?",
    examples: "shipped feature, interview passed, business progress, golf improvement",
  },
  {
    key: "leaks" as const,
    title: "Leaks",
    prompt: "What leaked time, money, or attention?",
    examples: "social media, secret chats, procrastination, impulsive spending",
  },
  {
    key: "risks" as const,
    title: "Risks",
    prompt: "What could destroy my future if ignored?",
    examples: "finances, marriage, health, career stagnation",
  },
  {
    key: "root_cause" as const,
    title: "Root Cause Analysis",
    prompt: "Why did these problems happen?",
    examples: "Focus on environment and process, not self-shaming",
  },
  {
    key: "next_system" as const,
    title: "Next Week's Systems",
    prompt: "What system will I build next week?",
    examples: "delete accounts, schedule golf, apply to jobs, block apps, weekly date night",
  },
] as const;

const emptyForm = {
  wins: "",
  leaks: "",
  risks: "",
  root_cause: "",
  next_system: "",
};

interface Props {
  weekStart: string;
  review: WeeklyReview | null;
  isLoading?: boolean;
  onSubmitted?: () => void;
}

export function CeoReviewForm({
  weekStart,
  review,
  isLoading,
  onSubmitted,
}: Props) {
  const upsert = useUpsertReview(weekStart);
  const [form, setForm] = useState(emptyForm);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (review) {
      setForm({
        wins: review.wins ?? "",
        leaks: review.leaks ?? "",
        risks: review.risks ?? "",
        root_cause: review.root_cause ?? "",
        next_system: review.next_system ?? "",
      });
      setDirty(false);
    }
  }, [review, weekStart]);

  const update = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync(form);
      setDirty(false);
      toast.success("CEO review submitted");
      onSubmitted?.();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      <article className="rounded-2xl border border-border bg-surface">
        <header className="border-b border-border px-6 py-5 md:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            CEO Review
          </p>
          <h2 className="mt-2 text-xl font-medium tracking-tight">
            Weekly reflection
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Answer honestly. Submit when complete.
          </p>
        </header>

        <div className="px-6 py-6 md:px-8 md:py-8">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading review…</p>
          ) : (
            <div className="space-y-8">
              {sections.map((s, i) => (
                <div key={s.key}>
                  {i > 0 && <Separator className="mb-8 bg-border/60" />}
                  <div className="space-y-2">
                    <Label htmlFor={s.key} className="text-sm font-medium">
                      {s.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">{s.prompt}</p>
                    <p className="text-xs text-muted-foreground/70">
                      e.g. {s.examples}
                    </p>
                    <Textarea
                      id={s.key}
                      value={form[s.key]}
                      onChange={(e) => update(s.key, e.target.value)}
                      rows={4}
                      placeholder="Write here…"
                      className={cn(
                        "mt-2 rounded-lg border-0 border-b border-border bg-transparent px-0 shadow-none",
                        "focus-visible:border-primary focus-visible:ring-0",
                        "placeholder:text-muted-foreground/40"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-border px-6 py-4 md:px-8">
          <p className="text-xs text-muted-foreground">
            {dirty ? "Unsaved changes" : "Ready to submit"}
          </p>
          <Button
            type="submit"
            disabled={upsert.isPending || isLoading}
            className="min-w-[140px] rounded-xl"
          >
            {upsert.isPending ? "Submitting…" : "Submit review"}
          </Button>
        </footer>
      </article>
    </form>
  );
}

export function hasReviewContent(review: WeeklyReview): boolean {
  return Boolean(
    review.wins?.trim() ||
      review.leaks?.trim() ||
      review.risks?.trim() ||
      review.root_cause?.trim() ||
      review.next_system?.trim() ||
      review.ceo_summary?.trim()
  );
}
