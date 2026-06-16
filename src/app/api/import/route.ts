import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { importSnapshotSchema } from "@/lib/db/schemas";
import { importAllData, isSupabaseConfigured } from "@/lib/db/repositories";

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const body = await parseJson(request);
    const parsed = importSnapshotSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    await importAllData(parsed.data as Parameters<typeof importAllData>[0]);
    return apiSuccess({ ok: true });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to import data");
  }
}
