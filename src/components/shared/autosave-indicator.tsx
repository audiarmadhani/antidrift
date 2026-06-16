"use client";

import { cn } from "@/lib/utils";

interface AutosaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === "idle") return null;
  return (
    <span
      className={cn(
        "text-xs",
        status === "saving" && "text-muted-foreground",
        status === "saved" && "text-primary",
        status === "error" && "text-destructive"
      )}
    >
      {status === "saving" && "Saving…"}
      {status === "saved" && "Saved"}
      {status === "error" && "Save failed"}
    </span>
  );
}
