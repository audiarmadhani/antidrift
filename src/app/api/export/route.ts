import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/helpers";
import { exportAllData, isSupabaseConfigured } from "@/lib/db/repositories";
import { snapshotToJson, snapshotToMarkdown } from "@/lib/export/json";

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const format = request.nextUrl.searchParams.get("format") ?? "json";
    const snapshot = await exportAllData();

    if (format === "markdown") {
      return new NextResponse(snapshotToMarkdown(snapshot), {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="antidrift-export-${snapshot.exportedAt.slice(0, 10)}.md"`,
        },
      });
    }

    return new NextResponse(snapshotToJson(snapshot), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="antidrift-export-${snapshot.exportedAt.slice(0, 10)}.json"`,
      },
    });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to export data");
  }
}
