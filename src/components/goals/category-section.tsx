"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GoalCard } from "./goal-card";
import type { Goal, GoalCategory } from "@/lib/db/types";
import { CATEGORY_GOAL_CONFIG } from "@/lib/goals/category-config";
import { useCreateGoal } from "@/lib/hooks";

export function CategorySection({
  category,
  goals,
}: {
  category: GoalCategory;
  goals: Goal[];
}) {
  const config = CATEGORY_GOAL_CONFIG[category];
  const create = useCreateGoal();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [metricIndex, setMetricIndex] = useState(0);
  const [deadline, setDeadline] = useState("");

  const metric = config.metrics[metricIndex];
  const categoryGoals = goals.filter((g) => g.category === category);

  const handleCreate = async () => {
    if (!title.trim() || !target) return;
    const targetNum = Number(target);
    const currentNum =
      metric.kind === "handicap"
        ? current
          ? Number(current)
          : targetNum
        : 0;

    await create.mutateAsync({
      category,
      title: title.trim(),
      target_value: targetNum,
      current_value: currentNum,
      unit: metric.unit,
      deadline: deadline || null,
    });
    setTitle("");
    setTarget("");
    setCurrent("");
    setDeadline("");
    setMetricIndex(0);
    setOpen(false);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{config.label}</h2>
          <p className="text-sm text-muted-foreground">{config.subtitle}</p>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button variant="outline" size="sm" className="shrink-0 rounded-xl">
                <Plus className="size-4" />
                Add
              </Button>
            }
          />
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Add {config.label} goal</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>What are you working toward?</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={config.titlePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label>Track by</Label>
                <Select
                  value={String(metricIndex)}
                  onValueChange={(v) => setMetricIndex(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.metrics.map((m, i) => (
                      <SelectItem key={m.unit} value={String(i)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{metric.targetLabel}</Label>
                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  type="number"
                  step={metric.kind === "hours" ? "0.5" : "1"}
                  placeholder={metric.targetPlaceholder}
                />
              </div>

              {metric.kind === "handicap" && (
                <div className="space-y-2">
                  <Label>{metric.currentLabel}</Label>
                  <Input
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    type="number"
                    step="0.1"
                    placeholder="18"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Deadline (optional)</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                e.g. {config.examples.join(" · ")}
              </p>

              <Button onClick={handleCreate} className="w-full rounded-xl">
                Create goal
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {categoryGoals.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No {config.label.toLowerCase()} goals yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {categoryGoals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}
    </section>
  );
}
