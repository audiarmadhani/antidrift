import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { goalCreateSchema } from "@/lib/db/schemas";
import { createGoal, isSupabaseConfigured, listGoals } from "@/lib/db/repositories";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    return apiSuccess(await listGoals());
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch goals");
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const body = await parseJson(request);
    const parsed = goalCreateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await createGoal(parsed.data), 201);
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to create goal");
  }
}
