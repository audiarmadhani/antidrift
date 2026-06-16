"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDENTITY_BULLETS } from "@/lib/emergency/constants";
import { useManifesto } from "@/lib/hooks";
import { useEmergencyStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function StepIdentity() {
  const { data: manifesto } = useManifesto();
  const { movedTowardsIdentity, setMovedTowardsIdentity, setStep } = useEmergencyStore();

  const bullets =
    manifesto?.age_35_vision?.split("\n").filter(Boolean) ?? [...IDENTITY_BULLETS];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Identity reminder</h1>
      </div>

      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-lg">35-Year-Old Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bullets.map((b) => (
            <div key={b} className="flex items-center gap-3 text-sm">
              <Check className="size-4 text-primary shrink-0" />
              {b.trim()}
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        Will this action move me toward or away from this man?
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className={cn(
            "h-14 rounded-xl",
            movedTowardsIdentity === true && "border-primary bg-primary/10"
          )}
          onClick={() => setMovedTowardsIdentity(true)}
        >
          Toward
        </Button>
        <Button
          variant="outline"
          className={cn(
            "h-14 rounded-xl",
            movedTowardsIdentity === false && "border-accent-amber bg-accent-amber/10"
          )}
          onClick={() => setMovedTowardsIdentity(false)}
        >
          Away
        </Button>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button
          className="flex-1 rounded-xl"
          disabled={movedTowardsIdentity === null}
          onClick={() => setStep(4)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
