import { apiError, apiSuccess } from "@/lib/api/helpers";
import { isSupabaseConfigured, listJournalEntries } from "@/lib/db/repositories";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    return apiSuccess(await listJournalEntries());
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch journals");
  }
}
