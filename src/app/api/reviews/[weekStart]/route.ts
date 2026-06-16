import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { weeklyReviewUpsertSchema } from "@/lib/db/schemas";
import { getReview, isSupabaseConfigured, upsertReview } from "@/lib/db/repositories";

type Params = { params: Promise<{ weekStart: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { weekStart } = await params;
    const review = await getReview(weekStart);
    return apiSuccess(review);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch review");
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { weekStart } = await params;
    const body = await parseJson(request);
    const parsed = weeklyReviewUpsertSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await upsertReview(weekStart, parsed.data));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to save review");
  }
}
