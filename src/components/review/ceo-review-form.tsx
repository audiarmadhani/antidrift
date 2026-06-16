"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AutosaveIndicator } from "@/components/shared/autosave-indicator";
import { useUpsertReview } from "@/lib/hooks";
import type { WeeklyReview } from "@/lib/db/types";

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
];

interface Props {
  weekStart: string;
  review: WeeklyReview | null;
}

export function CeoReviewForm({ weekStart, review }: Props) {
  const upsert = useUpsertReview(weekStart);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [form, setForm] = useState<Partial<WeeklyReview>>({});

  useEffect(() => {
    if (review) setForm(review);
  }, [review]);

  const save = debounce(async (data: Partial<WeeklyReview>) => {
    setStatus("saving");
    try {
      await upsert.mutateAsync(data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }, 500);

  const update = (key: keyof WeeklyReview, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    save(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AutosaveIndicator status={status} />
      </div>
      {sections.map((s) => (
        <Card key={s.key} className="rounded-2xl border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-medium">{s.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{s.prompt}</p>
            <p className="text-xs text-muted-foreground/70">e.g. {s.examples}</p>
          </CardHeader>
          <CardContent>
            <Label htmlFor={s.key} className="sr-only">
              {s.prompt}
            </Label>
            <Textarea
              id={s.key}
              value={(form[s.key] as string) ?? ""}
              onChange={(e) => update(s.key, e.target.value)}
              rows={4}
              className="rounded-xl"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
