"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/lib/db/types";

function entryPreview(entry: JournalEntry): string {
  const text =
    entry.wins?.trim() ||
    entry.gratitude?.trim() ||
    entry.future_self_note?.trim() ||
    entry.errors?.trim();
  if (!text) return "Empty entry";
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

function hasContent(entry: JournalEntry): boolean {
  return Boolean(
    entry.wins?.trim() ||
      entry.errors?.trim() ||
      entry.trigger?.trim() ||
      entry.root_cause?.trim() ||
      entry.system_fix?.trim() ||
      entry.gratitude?.trim() ||
      entry.future_self_note?.trim()
  );
}

interface JournalHistoryProps {
  entries: JournalEntry[];
  selectedDate: string;
  onSelect: (date: string) => void;
}

export function JournalHistory({
  entries,
  selectedDate,
  onSelect,
}: JournalHistoryProps) {
  const saved = entries.filter(hasContent);

  if (saved.length === 0) {
    return (
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Past entries
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          No journal entries yet. Submit your first entry above.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Past entries
      </h2>
      <ul className="mt-4 space-y-2">
        {saved.map((entry) => {
          const isSelected = entry.date === selectedDate;
          return (
            <li key={entry.date}>
              <button
                type="button"
                onClick={() => onSelect(entry.date)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-surface hover:bg-surface-elevated"
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">
                    {format(parseISO(entry.date), "EEEE, MMMM d, yyyy")}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-primary">Editing</span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {entryPreview(entry)}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
