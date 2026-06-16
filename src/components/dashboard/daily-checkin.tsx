"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AutosaveIndicator } from "@/components/shared/autosave-indicator";
import { useTodayCheckin, useUpsertCheckin } from "@/lib/hooks";
import { useDailyChecklistStore } from "@/lib/stores";
import type { DailyCheckin } from "@/lib/db/types";
import { format } from "date-fns";

const fields: { key: keyof DailyCheckin; label: string }[] = [
  { key: "built_something", label: "Built something" },
  { key: "career_progress", label: "Career progress" },
  { key: "quality_time_with_wife", label: "Quality time with wife" },
  { key: "exercise_or_golf", label: "Exercise or golf" },
  { key: "no_secret_behavior", label: "No secret behavior" },
];

export function DailyCheckinForm() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data } = useTodayCheckin();
  const upsert = useUpsertCheckin();
  const checklistItems = useDailyChecklistStore((s) => s.items);
  const addChecklistItem = useDailyChecklistStore((s) => s.addItem);
  const removeChecklistItem = useDailyChecklistStore((s) => s.removeItem);
  const toggleChecklistItem = useDailyChecklistStore((s) => s.toggleItem);
  const isChecklistItemChecked = useDailyChecklistStore((s) => s.isChecked);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [local, setLocal] = useState<Partial<DailyCheckin>>({});
  const [newItemLabel, setNewItemLabel] = useState("");

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const save = useMemo(
    () =>
      debounce(async (payload: Partial<DailyCheckin>) => {
        setStatus("saving");
        try {
          await upsert.mutateAsync(payload);
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 2000);
        } catch {
          setStatus("error");
        }
      }, 500),
    [upsert]
  );

  const update = (patch: Partial<DailyCheckin>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    save(next);
  };

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Daily Check-in</CardTitle>
        <AutosaveIndicator status={status} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <Checkbox
                id={key}
                checked={Boolean(local[key])}
                onCheckedChange={(v) => update({ [key]: v === true })}
              />
              <Label htmlFor={key} className="cursor-pointer font-normal">
                {label}
              </Label>
            </div>
          ))}
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Checkbox
                id={`custom-${item.id}`}
                checked={isChecklistItemChecked(item.id, today)}
                onCheckedChange={() => toggleChecklistItem(item.id, today)}
              />
              <Label
                htmlFor={`custom-${item.id}`}
                className="flex-1 cursor-pointer font-normal"
              >
                {item.label}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={() => removeChecklistItem(item.id)}
                aria-label={`Remove ${item.label}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <Input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Add custom checklist item"
              className="h-9 rounded-xl"
            />
            <Button
              type="button"
              size="sm"
              className="rounded-xl"
              onClick={() => {
                const trimmed = newItemLabel.trim();
                if (!trimmed) return;
                addChecklistItem(trimmed);
                setNewItemLabel("");
              }}
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Sleep hours</Label>
            <span className="text-sm text-muted-foreground">
              {local.sleep_hours ?? 0}h
            </span>
          </div>
          <Slider
            min={0}
            max={12}
            step={0.5}
            value={[local.sleep_hours ?? 0]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              update({ sleep_hours: val });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
