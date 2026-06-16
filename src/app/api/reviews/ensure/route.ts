import { apiError, apiSuccess } from "@/lib/api/helpers";
import { ensureCurrentReview, isSupabaseConfigured } from "@/lib/db/repositories";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    return apiSuccess(await ensureCurrentReview());
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to ensure review");
  }
}
