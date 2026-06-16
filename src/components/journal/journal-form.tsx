"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useJournal, useJournals, useUpsertJournal } from "@/lib/hooks";
import { JournalHistory } from "./journal-history";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const prompts = [
  { key: "wins" as const, label: "Wins", helper: "What did I build today?" },
  { key: "errors" as const, label: "Errors", helper: "What mistakes did I make today?" },
  { key: "trigger" as const, label: "Trigger", helper: "What triggered it? (boredom, loneliness, stress, rejection)" },
  { key: "root_cause" as const, label: "Root Cause", helper: "Why did it happen?" },
  { key: "system_fix" as const, label: "System Fix", helper: "What system prevents this tomorrow?" },
  { key: "gratitude" as const, label: "Gratitude", helper: "What already exists in my life that future me would envy?" },
  { key: "future_self_note" as const, label: "Future Self Note", helper: "What would my 35-year-old self tell me today?" },
];

const emptyForm = {
  wins: "",
  errors: "",
  trigger: "",
  root_cause: "",
  system_fix: "",
  gratitude: "",
  future_self_note: "",
};

export function JournalForm() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const { data, isLoading } = useJournal(date);
  const { data: journals = [] } = useJournals();
  const upsert = useUpsertJournal(date);
  const [form, setForm] = useState(emptyForm);
  const [dirty, setDirty] = useState(false);

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
      setDirty(false);
    }
  }, [data, date]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsert.mutateAsync(form);
      setDirty(false);
      toast.success("Journal entry saved");
    } catch {
      toast.error("Failed to save entry");
    }
  };

  const handleNewEntry = () => {
    setDate(today);
    setForm(emptyForm);
    setDirty(false);
  };

  const formattedDate = date
    ? format(parseISO(date), "EEEE, MMMM d, yyyy")
    : "";

  return (
    <div className="space-y-0">
      <form onSubmit={handleSubmit}>
        <article
          className={cn(
            "rounded-2xl border border-border bg-surface",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
          )}
        >
          {/* Journal header */}
          <header className="border-b border-border px-6 py-5 md:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Daily Postmortem
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-inter)] text-xl font-medium tracking-tight md:text-2xl">
              {formattedDate}
            </h2>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="journal-date" className="text-xs text-muted-foreground">
                  Entry date
                </Label>
                <Input
                  id="journal-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-auto rounded-lg border-border bg-background"
                />
              </div>
              {date !== today && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleNewEntry}
                  className="text-muted-foreground"
                >
                  New entry for today
                </Button>
              )}
            </div>
          </header>

          {/* Journal body */}
          <div className="px-6 py-6 md:px-8 md:py-8">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading entry…</p>
            ) : (
              <div className="space-y-8">
                {prompts.map((p, i) => (
                  <div key={p.key}>
                    {i > 0 && <Separator className="mb-8 bg-border/60" />}
                    <div className="space-y-2">
                      <Label
                        htmlFor={p.key}
                        className="text-sm font-medium text-foreground"
                      >
                        {p.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{p.helper}</p>
                      <Textarea
                        id={p.key}
                        value={form[p.key]}
                        onChange={(e) => updateField(p.key, e.target.value)}
                        rows={3}
                        placeholder="Write here…"
                        className={cn(
                          "mt-2 min-h-[4.5rem] resize-y rounded-lg border-0 border-b border-border",
                          "bg-transparent px-0 shadow-none",
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

          {/* Submit footer */}
          <footer className="flex items-center justify-between gap-4 border-t border-border px-6 py-4 md:px-8">
            <p className="text-xs text-muted-foreground">
              {dirty ? "Unsaved changes" : "Ready to submit"}
            </p>
            <Button
              type="submit"
              disabled={upsert.isPending || isLoading}
              className="min-w-[120px] rounded-xl"
            >
              {upsert.isPending ? "Saving…" : "Submit entry"}
            </Button>
          </footer>
        </article>
      </form>

      <JournalHistory
        entries={journals}
        selectedDate={date}
        onSelect={setDate}
      />
    </div>
  );
}
