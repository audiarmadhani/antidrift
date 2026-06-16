"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PREDICTED_FEELINGS } from "@/lib/emergency/constants";
import { useEmergencyStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function StepPrediction() {
  const {
    predictedFeeling,
    estimatedCost,
    setPredictedFeeling,
    setEstimatedCost,
    setStep,
  } = useEmergencyStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Prediction</h1>
        <p className="mt-2 text-muted-foreground">
          If you act on this urge, how will you feel in 1 hour?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PREDICTED_FEELINGS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setPredictedFeeling(f)}
            className={cn(
              "rounded-xl border border-border px-4 py-3 text-sm transition-colors",
              predictedFeeling === f
                ? "border-primary bg-primary/10 text-primary"
                : "hover:bg-surface-elevated"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Label>How much money could this cost?</Label>
        <Input
          type="number"
          min={0}
          value={estimatedCost || ""}
          onChange={(e) => setEstimatedCost(Number(e.target.value) || 0)}
          placeholder="0"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          className="flex-1 rounded-xl"
          disabled={!predictedFeeling}
          onClick={() => setStep(3)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
