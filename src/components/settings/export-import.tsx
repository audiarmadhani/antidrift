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
import { useEmergencyAnalytics, queryClient } from "@/lib/hooks";
import { exportAllData, importAllData, resetDatabase } from "@/lib/db/local-store";
import { parseImportJson, snapshotToJson, snapshotToMarkdown } from "@/lib/export/json";
import { downloadTextFile } from "@/lib/export/download";
import { toast } from "sonner";

export function ExportImport() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const { data: emergencyAnalytics } = useEmergencyAnalytics();

  const download = async (format: "json" | "markdown") => {
    const snapshot = await exportAllData();
    const date = new Date().toISOString().slice(0, 10);
    if (format === "json") {
      downloadTextFile(
        snapshotToJson(snapshot),
        `antidrift-export-${date}.json`,
        "application/json"
      );
    } else {
      downloadTextFile(
        snapshotToMarkdown(snapshot),
        `antidrift-export-${date}.md`,
        "text/markdown"
      );
    }
  };

  const importFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = parseImportJson(text);
      await importAllData(data);
      await queryClient.invalidateQueries();
      toast.success("Import complete");
    } catch {
      toast.error("Import failed");
    }
  };

  const reset = async () => {
    try {
      await resetDatabase();
      await queryClient.invalidateQueries();
      toast.success("Database reset");
      setResetOpen(false);
    } catch {
      toast.error("Reset failed");
    }
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
              if (f) void importFile(f);
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
