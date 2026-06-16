import type { CeoScores, DailyCheckin, WeeklyReview } from "@/lib/db/types";
import { getDomainLabel } from "@/lib/drift/ceo-scores";

function firstLine(text: string | null | undefined): string {
  if (!text?.trim()) return "Not specified";
  return text.trim().split("\n")[0];
}

function lowestDomain(scores: CeoScores): { domain: string; score: number } {
  const domains: (keyof CeoScores)[] = [
    "business",
    "health",
    "marriage",
    "discipline",
  ];
  let lowest = domains[0];
  for (const d of domains) {
    if (scores[d] < scores[lowest]) lowest = d;
  }
  return { domain: getDomainLabel(lowest), score: scores[lowest] };
}

function highestDomain(scores: CeoScores): { domain: string; score: number } {
  const domains: (keyof CeoScores)[] = [
    "business",
    "health",
    "marriage",
    "discipline",
  ];
  let highest = domains[0];
  for (const d of domains) {
    if (scores[d] > scores[highest]) highest = d;
  }
  return { domain: getDomainLabel(highest), score: scores[highest] };
}

export function generateCeoLetter(
  review: Partial<WeeklyReview>,
  scores: CeoScores,
  checkins: DailyCheckin[]
): string {
  const builtCount = checkins.filter((c) => c.built_something).length;
  const winsSummary = review.wins?.trim()
    ? firstLine(review.wins)
    : `${builtCount} days building something tangible`;

  const lowest = lowestDomain(scores);
  const highest = highestDomain(scores);

  const biggestRisk =
    review.risks?.trim()
      ? firstLine(review.risks)
      : `${lowest.domain} score at ${lowest.score}/100 needs attention`;

  const strongestMomentum = `${highest.domain} at ${highest.score}/100 — maintain this momentum`;

  const nextFocus = review.next_system?.trim()
    ? firstLine(review.next_system)
    : "Define one system to install next week";

  return `CEO Summary

This week you built: ${winsSummary}

Your biggest risk: ${biggestRisk}

Your strongest momentum: ${strongestMomentum}

The one thing that matters most next week: ${nextFocus}`;
}
