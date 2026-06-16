"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Goal } from "@/lib/db/types";
import { useUpdateGoal, useDeleteGoal } from "@/lib/hooks";

export function GoalCard({ goal }: { goal: Goal }) {
  const update = useUpdateGoal();
  const del = useDeleteGoal();

  const progress =
    goal.target_value && goal.target_value > 0
      ? Math.min(100, ((goal.current_value ?? 0) / goal.target_value) * 100)
      : 0;

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{goal.title}</CardTitle>
        {goal.description && (
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {goal.current_value ?? 0} / {goal.target_value ?? "—"} {goal.unit ?? ""}
          </span>
          {goal.deadline && (
            <span>· Due {format(new Date(goal.deadline), "MMM d, yyyy")}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            className="w-24 rounded-xl"
            defaultValue={goal.current_value ?? 0}
            onBlur={(e) =>
              update.mutate({
                id: goal.id,
                current_value: Number(e.target.value),
              })
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => del.mutate(goal.id)}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
