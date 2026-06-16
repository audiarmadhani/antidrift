"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmergencyStore } from "@/lib/stores";
import { StepNameState } from "./step-name-state";
import { StepPrediction } from "./step-prediction";
import { StepIdentity } from "./step-identity";
import { StepFutureCost } from "./step-future-cost";
import { StepFriction } from "./step-friction";

export function EmergencyWizard() {
  const router = useRouter();
  const step = useEmergencyStore((s) => s.step);

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-accent-amber" : "bg-border"
              }`}
            />
          ))}
        </div>

        {step === 1 && <StepNameState />}
        {step === 2 && <StepPrediction />}
        {step === 3 && <StepIdentity />}
        {step === 4 && <StepFutureCost />}
        {step === 5 && <StepFriction />}
      </div>
    </div>
  );
}
