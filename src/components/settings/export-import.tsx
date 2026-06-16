"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEmergencyAnalytics } from "@/lib/hooks";
import { toast } from "sonner";

export function ExportImport() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const { data: emergencyAnalytics } = useEmergencyAnalytics();

  const download = (format: "json" | "markdown") => {
    window.open(`/api/export?format=${format}`, "_blank");
  };

  const importFile = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error("Import failed");
      return;
    }
    toast.success("Import complete");
    window.location.reload();
  };

  const reset = async () => {
    const res = await fetch("/api/reset", { method: "POST" });
    if (!res.ok) {
      toast.error("Reset failed");
      return;
    }
    toast.success("Database reset");
    setResetOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base font-medium">Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-xl" onClick={() => download("json")}>
            Export JSON
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => download("markdown")}>
            Export Markdown
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base font-medium">Import</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importFile(f);
            }}
          />
          <Button variant="outline" className="rounded-xl" onClick={() => fileRef.current?.click()}>
            Import backup
          </Button>
        </CardContent>
      </Card>

      {emergencyAnalytics && (
        <Card className="rounded-2xl border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-medium">Emergency diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Success rate: {Math.round(emergencyAnalytics.successRate * 100)}%</p>
            <p>Avg duration: {Math.round(emergencyAnalytics.averageDurationSeconds / 60)} min</p>
            <p>30d effectiveness: {Math.round(emergencyAnalytics.effectiveness30Day * 100)}%</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogTrigger render={<Button variant="destructive" className="rounded-xl">Reset database</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all data?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes all entries and restores the default manifesto. Export first if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={reset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
