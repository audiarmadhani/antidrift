import { NextRequest } from "next/server";
import { apiError, apiSuccess, parseJson } from "@/lib/api/helpers";
import { journalUpsertSchema } from "@/lib/db/schemas";
import { getJournal, isSupabaseConfigured, upsertJournal } from "@/lib/db/repositories";

type Params = { params: Promise<{ date: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { date } = await params;
    const entry = await getJournal(date);
    return apiSuccess(entry ?? { date });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to fetch journal");
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { date } = await params;
    const body = await parseJson(request);
    const parsed = journalUpsertSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    return apiSuccess(await upsertJournal(date, parsed.data));
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to save journal");
  }
}
