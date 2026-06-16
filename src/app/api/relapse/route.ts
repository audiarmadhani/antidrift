import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { relapseCreateSchema } from "@/lib/db/schemas";
import { createRelapse, isSupabaseConfigured, listRelapses } from "@/lib/db/repositories";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    return apiSuccess(await listRelapses());
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch relapses");
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const body = await parseJson(request);
    const parsed = relapseCreateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await createRelapse(parsed.data), 201);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to create relapse log");
  }
}
