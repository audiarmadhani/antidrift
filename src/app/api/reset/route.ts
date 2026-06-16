import { apiError, apiSuccess } from "@/lib/api/helpers";
import { isSupabaseConfigured, resetDatabase } from "@/lib/db/repositories";

export async function POST() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    await resetDatabase();
    return apiSuccess({ ok: true });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to reset database");
  }
}
