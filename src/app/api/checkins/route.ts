import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/helpers";
import { isSupabaseConfigured, listCheckins } from "@/lib/db/repositories";

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const from = request.nextUrl.searchParams.get("from") ?? undefined;
    const to = request.nextUrl.searchParams.get("to") ?? undefined;
    return apiSuccess(await listCheckins(from, to));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch checkins");
  }
}
