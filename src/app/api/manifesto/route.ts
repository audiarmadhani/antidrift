import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { manifestoUpdateSchema } from "@/lib/db/schemas";
import { getManifesto, isSupabaseConfigured, updateManifesto } from "@/lib/db/repositories";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    return apiSuccess(await getManifesto());
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch manifesto");
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const body = await parseJson(request);
    const parsed = manifestoUpdateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await updateManifesto(parsed.data));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to update manifesto");
  }
}
