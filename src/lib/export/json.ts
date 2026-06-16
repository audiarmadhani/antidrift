import type { ExportSnapshot } from "@/lib/db/types";
import { snapshotToMarkdown } from "./markdown";

export function snapshotToJson(snapshot: ExportSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export function parseImportJson(raw: string): ExportSnapshot {
  const parsed = JSON.parse(raw) as ExportSnapshot;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid backup file");
  }
  return parsed;
}

export { snapshotToMarkdown };
