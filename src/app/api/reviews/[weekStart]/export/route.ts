import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/helpers";
import { getReview, isSupabaseConfigured } from "@/lib/db/repositories";
import { ceoReviewFilename, reviewToMarkdown, reviewToPrintHtml } from "@/lib/export/markdown";

type Params = { params: Promise<{ weekStart: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    if (!isSupabaseConfigured()) return apiError("Database not configured", 503);
    const { weekStart } = await params;
    const format = request.nextUrl.searchParams.get("format") ?? "markdown";
    const review = await getReview(weekStart);
    if (!review) return apiError("Review not found", 404);

    if (format === "pdf") {
      const html = reviewToPrintHtml(review);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `inline; filename="${ceoReviewFilename(weekStart, "pdf")}"`,
        },
      });
    }

    const markdown = reviewToMarkdown(review);
    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${ceoReviewFilename(weekStart, "md")}"`,
      },
    });
  } catch (e) {
    return apiError(e instanceof Error ? e.message : "Failed to export review");
  }
}
