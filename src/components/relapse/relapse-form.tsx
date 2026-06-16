"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useCreateRelapse } from "@/lib/hooks";
import { toast } from "sonner";

export function RelapseForm() {
  const create = useCreateRelapse();
  const [urgeLevel, setUrgeLevel] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [location, setLocation] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [behavior, setBehavior] = useState("");
  const [moneySpent, setMoneySpent] = useState("");
  const [notes, setNotes] = useState("");

  const submit = async () => {
    await create.mutateAsync({
      urge_level: urgeLevel,
      emotion: emotion || null,
      location: location || null,
      time_of_day: timeOfDay || null,
      behavior: behavior || null,
      money_spent: moneySpent ? Number(moneySpent) : 0,
      notes: notes || null,
    });
    toast.success("Log saved");
    setEmotion("");
    setLocation("");
    setTimeOfDay("");
    setBehavior("");
    setMoneySpent("");
    setNotes("");
  };

  return (
    <Card className="rounded-2xl border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base font-medium">Behavior Log</CardTitle>
        <p className="text-sm text-muted-foreground">Clinical record. No judgment.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Urge level: {urgeLevel}</Label>
          <Slider min={1} max={10} step={1} value={[urgeLevel]} onValueChange={(v) => setUrgeLevel(Array.isArray(v) ? v[0] : v)} className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Emotion</Label><Input value={emotion} onChange={(e) => setEmotion(e.target.value)} className="rounded-xl mt-1" /></div>
          <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl mt-1" /></div>
          <div><Label>Time</Label><Input value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} className="rounded-xl mt-1" /></div>
          <div><Label>Behavior</Label><Input value={behavior} onChange={(e) => setBehavior(e.target.value)} className="rounded-xl mt-1" /></div>
        </div>
        <div><Label>Money spent</Label><Input type="number" value={moneySpent} onChange={(e) => setMoneySpent(e.target.value)} className="rounded-xl mt-1" /></div>
        <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl mt-1" rows={3} /></div>
        <Button onClick={submit} disabled={create.isPending} className="rounded-xl">Save log</Button>
      </CardContent>
    </Card>
  );
}
