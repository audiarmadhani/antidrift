"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AutosaveIndicator } from "@/components/shared/autosave-indicator";
import { useJournal, useUpsertJournal } from "@/lib/hooks";

const prompts = [
  { key: "wins" as const, label: "Wins", helper: "What did I build today?" },
  { key: "errors" as const, label: "Errors", helper: "What mistakes did I make today?" },
  { key: "trigger" as const, label: "Trigger", helper: "What triggered it? (boredom, loneliness, stress, rejection)" },
  { key: "root_cause" as const, label: "Root Cause", helper: "Why did it happen?" },
  { key: "system_fix" as const, label: "System Fix", helper: "What system prevents this tomorrow?" },
  { key: "gratitude" as const, label: "Gratitude", helper: "What already exists in my life that future me would envy?" },
  { key: "future_self_note" as const, label: "Future Self Note", helper: "What would my 35-year-old self tell me today?" },
];

export function JournalForm() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { data } = useJournal(date);
  const upsert = useUpsertJournal(date);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setForm({
        wins: data.wins ?? "",
        errors: data.errors ?? "",
        trigger: data.trigger ?? "",
        root_cause: data.root_cause ?? "",
        system_fix: data.system_fix ?? "",
        gratitude: data.gratitude ?? "",
        future_self_note: data.future_self_note ?? "",
      });
    }
  }, [data]);

  const save = debounce(async (payload: Record<string, string>) => {
    setStatus("saving");
    try {
      await upsert.mutateAsync(payload);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }, 500);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-auto rounded-xl"
          />
        </div>
        <AutosaveIndicator status={status} />
      </div>

      {prompts.map((p) => (
        <Card key={p.key} className="rounded-2xl border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-medium">{p.label}</CardTitle>
            <p className="text-sm text-muted-foreground">{p.helper}</p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form[p.key] ?? ""}
              onChange={(e) => {
                const next = { ...form, [p.key]: e.target.value };
                setForm(next);
                save(next);
              }}
              rows={3}
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
