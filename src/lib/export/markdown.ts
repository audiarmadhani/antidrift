import { format, startOfWeek, parseISO } from "date-fns";
import type { ExportSnapshot, WeeklyReview } from "@/lib/db/types";

export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getWeekStart(date: Date = new Date()): string {
  return formatDateISO(startOfWeek(date, { weekStartsOn: 1 }));
}

export function formatWeekLabel(weekStart: string): string {
  return format(parseISO(weekStart), "MMM d, yyyy");
}

export function ceoReviewFilename(weekStart: string, ext: "md" | "pdf"): string {
  return `CEO-Review-${weekStart}.${ext}`;
}

export function buildExportSnapshot(data: Omit<ExportSnapshot, "exportedAt">): ExportSnapshot {
  return {
    ...data,
    exportedAt: new Date().toISOString(),
  };
}

export function reviewToMarkdown(review: WeeklyReview): string {
  const lines = [
    `# Weekly CEO Review`,
    ``,
    `**Week of:** ${formatWeekLabel(review.week_start)}`,
    ``,
    `## Scoreboard`,
    ``,
    `- Business: ${review.business_score ?? "—"}/100`,
    `- Health: ${review.health_score ?? "—"}/100`,
    `- Marriage: ${review.marriage_score ?? "—"}/100`,
    `- Discipline: ${review.discipline_score ?? "—"}/100`,
    `- Overall Drift: ${review.overall_drift_score ?? "—"}/100`,
    ``,
    `## Wins`,
    ``,
    review.wins || "_No entry_",
    ``,
    `## Leaks`,
    ``,
    review.leaks || "_No entry_",
    ``,
    `## Risks`,
    ``,
    review.risks || "_No entry_",
    ``,
    `## Root Cause`,
    ``,
    review.root_cause || "_No entry_",
    ``,
    `## Next Week's Systems`,
    ``,
    review.next_system || "_No entry_",
    ``,
    `## CEO Letter`,
    ``,
    review.ceo_summary || "_Not generated_",
    ``,
  ];
  return lines.join("\n");
}

export function snapshotToMarkdown(snapshot: ExportSnapshot): string {
  const sections: string[] = [
    `# Anti-Drift OS Export`,
    ``,
    `Exported: ${snapshot.exportedAt}`,
    ``,
  ];

  if (snapshot.identity_manifesto) {
    sections.push(
      `## Identity Manifesto`,
      ``,
      `**Statement:** ${snapshot.identity_manifesto.identity_statement}`,
      ``,
      `**Fear of Drift:** ${snapshot.identity_manifesto.fear_of_drift}`,
      ``,
      `**Age 35 Vision:**`,
      snapshot.identity_manifesto.age_35_vision ?? "",
      ``
    );
  }

  sections.push(`## Goals (${snapshot.goals.length})`);
  for (const g of snapshot.goals) {
    sections.push(
      `- [${g.category}] ${g.title}: ${g.current_value ?? 0}/${g.target_value ?? "?"} ${g.unit ?? ""}`
    );
  }
  sections.push(``);

  sections.push(`## Daily Check-ins (${snapshot.daily_checkins.length})`);
  for (const c of snapshot.daily_checkins.slice(-30)) {
    sections.push(`- ${c.date}: built=${c.built_something}, sleep=${c.sleep_hours ?? "—"}`);
  }
  sections.push(``);

  sections.push(`## Weekly Reviews (${snapshot.weekly_reviews.length})`);
  for (const r of snapshot.weekly_reviews) {
    sections.push(reviewToMarkdown(r), `---`, ``);
  }

  return sections.join("\n");
}

export function reviewToPrintHtml(review: WeeklyReview): string {
  const md = reviewToMarkdown(review);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${ceoReviewFilename(review.week_start, "pdf")}</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.6;color:#111}h1{font-size:24px}h2{font-size:18px;margin-top:24px}pre{white-space:pre-wrap;font-family:inherit}</style></head>
<body><pre>${md.replace(/</g, "&lt;")}</pre></body></html>`;
}
