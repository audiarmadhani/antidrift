"use client";

import { format } from "date-fns";
import { Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Goal } from "@/lib/db/types";
import {
  computeGoalProgress,
  formatGoalProgressLabel,
  getMetricPreset,
} from "@/lib/goals/category-config";
import { useUpdateGoal, useDeleteGoal } from "@/lib/hooks";

export function GoalCard({ goal }: { goal: Goal }) {
  const update = useUpdateGoal();
  const del = useDeleteGoal();
  const metric = getMetricPreset(goal.category, goal.unit);
  const progress = computeGoalProgress(goal);

  const adjust = (delta: number) => {
    const next = Math.max(0, (goal.current_value ?? 0) + delta);
    update.mutate({ id: goal.id, current_value: next });
  };

  const setCurrent = (value: number) => {
    update.mutate({ id: goal.id, current_value: Math.max(0, value) });
  };

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-medium">{goal.title}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
          </div>
          <span className="text-sm font-medium tabular-nums text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {formatGoalProgressLabel(goal)}
        </p>
        {goal.deadline && (
          <p className="text-xs text-muted-foreground">
            Due {format(new Date(goal.deadline), "MMM d, yyyy")}
          </p>
        )}

        <div className="flex items-end gap-3">
          {metric.kind === "count" || metric.kind === "hours" ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => adjust(metric.kind === "hours" ? -0.5 : -1)}
                aria-label="Decrease"
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="min-w-[3rem] text-center text-sm font-medium tabular-nums">
                {goal.current_value ?? 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => adjust(metric.kind === "hours" ? 0.5 : 1)}
                aria-label="Increase"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">
                {metric.currentLabel}
              </Label>
              <Input
                type="number"
                step={metric.kind === "handicap" ? "0.1" : "1"}
                className="rounded-xl"
                defaultValue={goal.current_value ?? 0}
                onBlur={(e) => setCurrent(Number(e.target.value))}
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => del.mutate(goal.id)}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
