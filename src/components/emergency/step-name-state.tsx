"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { EMERGENCY_EMOTIONS } from "@/lib/emergency/constants";
import { useEmergencyStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function StepNameState() {
  const {
    emotions,
    otherEmotion,
    urgency,
    setEmotions,
    setOtherEmotion,
    setUrgency,
    setStep,
  } = useEmergencyStore();

  const toggle = (e: string) => {
    if (emotions.includes(e)) {
      setEmotions(emotions.filter((x) => x !== e));
    } else {
      setEmotions([...emotions, e]);
    }
  };

  const canContinue =
    emotions.length > 0 &&
    (!emotions.includes("Other") || otherEmotion.trim().length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Name the state</h1>
        <p className="mt-2 text-muted-foreground">
          What are you feeling right now?
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EMERGENCY_EMOTIONS.map((e) => (
          <Badge
            key={e}
            variant="outline"
            className={cn(
              "cursor-pointer rounded-xl px-4 py-2 text-sm",
              emotions.includes(e) && "border-accent-amber bg-accent-amber/10 text-amber-400"
            )}
            onClick={() => toggle(e)}
          >
            {e}
          </Badge>
        ))}
      </div>

      {emotions.includes("Other") && (
        <Input
          placeholder="Describe what you're feeling"
          value={otherEmotion}
          onChange={(ev) => setOtherEmotion(ev.target.value)}
        />
      )}

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Urgency</Label>
          <span className="text-sm text-muted-foreground">{urgency}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[urgency]}
          onValueChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v;
            setUrgency(val);
          }}
        />
      </div>

      <Button
        className="w-full rounded-xl"
        disabled={!canContinue}
        onClick={() => setStep(2)}
      >
        Continue
      </Button>
    </div>
  );
}
