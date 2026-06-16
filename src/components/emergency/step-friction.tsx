"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EMERGENCY_ALTERNATIVES, FRICTION_DURATION_SECONDS } from "@/lib/emergency/constants";
import { useCreateEmergencySession } from "@/lib/hooks";
import { useEmergencyStore } from "@/lib/stores";

const STORAGE_KEY = "antidrift-friction-start";

export function StepFriction() {
  const router = useRouter();
  const createSession = useCreateEmergencySession();
  const store = useEmergencyStore();
  const [remaining, setRemaining] = useState(FRICTION_DURATION_SECONDS);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let start = store.frictionStartedAt;
    if (!start) {
      start = Date.now();
      store.setFrictionStartedAt(start);
      sessionStorage.setItem(STORAGE_KEY, String(start));
    } else {
      sessionStorage.setItem(STORAGE_KEY, String(start));
    }

    const tick = () => {
      const stored = Number(sessionStorage.getItem(STORAGE_KEY) || start);
      const elapsed = Math.floor((Date.now() - stored) / 1000);
      const left = Math.max(0, FRICTION_DURATION_SECONDS - elapsed);
      setRemaining(left);
      if (left === 0) setDone(true);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [store]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const submit = async (urgePassed: boolean) => {
    const stored = Number(sessionStorage.getItem(STORAGE_KEY) || Date.now());
    const duration = Math.floor((Date.now() - stored) / 1000);
    const emotions = [...store.emotions];
    if (emotions.includes("Other") && store.otherEmotion) {
      emotions.push(store.otherEmotion);
    }

    await createSession.mutateAsync({
      emotions: emotions.filter((e) => e !== "Other"),
      urgency: store.urgency,
      predicted_feeling: store.predictedFeeling,
      estimated_cost: store.estimatedCost,
      moved_towards_identity: store.movedTowardsIdentity,
      urge_passed: urgePassed,
      duration_seconds: duration,
    });

    sessionStorage.removeItem(STORAGE_KEY);
    store.reset();
    router.push("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Stay with it</h1>
        <p className="mt-2 text-muted-foreground">
          {done ? "Time is up." : "Wait before acting."}
        </p>
        {!done && (
          <p className="mt-6 text-5xl font-semibold tabular-nums text-accent-amber">
            {formatTime(remaining)}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        {EMERGENCY_ALTERNATIVES.map((alt) => (
          <Card key={alt.label} className="rounded-xl border-border bg-surface">
            <CardContent className="p-0">
              {alt.href ? (
                <Link
                  href={alt.href}
                  className="block px-4 py-3 text-sm hover:bg-surface-elevated transition-colors"
                >
                  {alt.label}
                </Link>
              ) : (
                <p className="px-4 py-3 text-sm text-muted-foreground">{alt.label}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {done && (
        <div className="grid gap-3">
          <Button
            className="w-full rounded-xl"
            onClick={() => submit(true)}
            disabled={createSession.isPending}
          >
            Urge passed
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => submit(false)}
            disabled={createSession.isPending}
          >
            I still need help
          </Button>
        </div>
      )}
    </div>
  );
}
