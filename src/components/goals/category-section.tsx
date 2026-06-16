"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GoalCard } from "./goal-card";
import type { Goal, GoalCategory } from "@/lib/db/types";
import { useCreateGoal } from "@/lib/hooks";

const labels: Record<GoalCategory, string> = {
  wealth: "Wealth",
  business: "Business",
  marriage: "Marriage",
  health: "Health",
  golf: "Golf",
  character: "Character",
};

export function CategorySection({
  category,
  goals,
}: {
  category: GoalCategory;
  goals: Goal[];
}) {
  const create = useCreateGoal();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");

  const categoryGoals = goals.filter((g) => g.category === category);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await create.mutateAsync({
      category,
      title,
      target_value: target ? Number(target) : null,
      current_value: 0,
      unit: unit || null,
    });
    setTitle("");
    setTarget("");
    setUnit("");
    setOpen(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{labels[category]}</h2>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button variant="outline" size="sm" className="rounded-xl">
                <Plus className="size-4" />
                Add
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add {labels[category]} Goal</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>Target</Label>
                <Input value={target} onChange={(e) => setTarget(e.target.value)} type="number" />
              </div>
              <div>
                <Label>Unit</Label>
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="IDR/month" />
              </div>
              <Button onClick={handleCreate} className="w-full rounded-xl">
                Create
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {categoryGoals.length === 0 ? (
        <p className="text-sm text-muted-foreground">Define one goal for {labels[category].toLowerCase()}.</p>
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
