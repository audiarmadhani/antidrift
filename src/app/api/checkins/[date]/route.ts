import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { checkinUpsertSchema } from "@/lib/db/schemas";
import { getCheckin, isSupabaseConfigured, upsertCheckin } from "@/lib/db/repositories";

type Params = { params: Promise<{ date: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { date } = await params;
    const checkin = await getCheckin(date);
    return apiSuccess(checkin ?? {
      date,
      built_something: false,
      career_progress: false,
      quality_time_with_wife: false,
      exercise_or_golf: false,
      no_secret_behavior: false,
      sleep_hours: null,
      notes: null,
    });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch checkin");
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { date } = await params;
    const body = await parseJson(request);
    const parsed = checkinUpsertSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await upsertCheckin(date, parsed.data));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to save checkin");
  }
}
