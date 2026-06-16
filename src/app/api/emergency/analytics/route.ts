import { apiError, apiSuccess } from "@/lib/api/helpers";
import { computeEmergencyAnalytics } from "@/lib/emergency/analytics";
import { isSupabaseConfigured, listEmergencySessions } from "@/lib/db/repositories";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const sessions = await listEmergencySessions();
    return apiSuccess(computeEmergencyAnalytics(sessions));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch analytics");
  }
}
