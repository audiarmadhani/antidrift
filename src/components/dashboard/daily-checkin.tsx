"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AutosaveIndicator } from "@/components/shared/autosave-indicator";
import { useTodayCheckin, useUpsertCheckin } from "@/lib/hooks";
import type { DailyCheckin } from "@/lib/db/types";

const fields: { key: keyof DailyCheckin; label: string }[] = [
  { key: "built_something", label: "Built something" },
  { key: "career_progress", label: "Career progress" },
  { key: "quality_time_with_wife", label: "Quality time with wife" },
  { key: "exercise_or_golf", label: "Exercise or golf" },
  { key: "no_secret_behavior", label: "No secret behavior" },
];

export function DailyCheckinForm() {
  const { data } = useTodayCheckin();
  const upsert = useUpsertCheckin();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [local, setLocal] = useState<Partial<DailyCheckin>>({});

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
