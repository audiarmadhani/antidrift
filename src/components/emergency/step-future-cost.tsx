"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useManifesto } from "@/lib/hooks";
import { useEmergencyStore } from "@/lib/stores";

export function StepFutureCost() {
  const { data: manifesto } = useManifesto();
  const { setStep } = useEmergencyStore();

  const fear =
    manifesto?.fear_of_drift ??
    "At 38: no wife, no kids, money gone, nothing built.";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Future cost</h1>
        <p className="mt-2 text-muted-foreground">If nothing changes:</p>
      </div>

      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Age 38
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-foreground leading-relaxed">
            {fear}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(3)}>
          Back
        </Button>
        <Button className="flex-1 rounded-xl" onClick={() => setStep(5)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
