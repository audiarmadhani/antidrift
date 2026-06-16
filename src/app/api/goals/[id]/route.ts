import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { goalUpdateSchema } from "@/lib/db/schemas";
import { deleteGoal, isSupabaseConfigured, updateGoal } from "@/lib/db/repositories";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { id } = await params;
    const body = await parseJson(request);
    const parsed = goalUpdateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await updateGoal(id, parsed.data));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to update goal");
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { id } = await params;
    await deleteGoal(id);
    return apiSuccess({ ok: true });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to delete goal");
  }
}
