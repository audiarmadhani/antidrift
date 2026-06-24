import { get, set } from "idb-keyval";
import type {
  DailyCheckin,
  EmergencySession,
  ExportSnapshot,
  Goal,
  IdentityManifesto,
  JournalEntry,
  RelapseLog,
  WeeklyReview,
} from "@/lib/db/types";
import { computeCeoScores } from "@/lib/drift/ceo-scores";
import { getWeekStart } from "@/lib/export/markdown";
import { generateCeoLetter } from "@/lib/review/ceo-letter";
import { DEFAULT_MANIFESTO, defaultGoals } from "@/lib/db/seed";

const KEYS = {
  initialized: "antidrift-db-initialized",
  goals: "antidrift-goals",
  checkins: "antidrift-checkins",
  journal: "antidrift-journal",
  relapses: "antidrift-relapses",
  reviews: "antidrift-reviews",
  manifesto: "antidrift-manifesto",
  emergency: "antidrift-emergency",
} as const;

function now(): string {
  return new Date().toISOString();
}

async function getList<T>(key: string): Promise<T[]> {
  return (await get<T[]>(key)) ?? [];
}

async function setList<T>(key: string, items: T[]): Promise<void> {
  await set(key, items);
}

export async function ensureDbInitialized(): Promise<void> {
  const initialized = await get<boolean>(KEYS.initialized);
  if (initialized) return;

  const ts = now();
  await set(KEYS.manifesto, DEFAULT_MANIFESTO);
  await set(KEYS.goals, defaultGoals(ts));
  await set(KEYS.checkins, []);
  await set(KEYS.journal, []);
  await set(KEYS.relapses, []);
  await set(KEYS.reviews, []);
  await set(KEYS.emergency, []);
  await set(KEYS.initialized, true);
}

// --- Goals ---

export async function listGoals(): Promise<Goal[]> {
  await ensureDbInitialized();
  const goals = await getList<Goal>(KEYS.goals);
  return goals.sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    if (cat !== 0) return cat;
    return a.created_at.localeCompare(b.created_at);
  });
}

export async function createGoal(input: Partial<Goal>): Promise<Goal> {
  await ensureDbInitialized();
  const ts = now();
  const goal: Goal = {
    id: crypto.randomUUID(),
    category: input.category!,
    title: input.title!,
    description: input.description ?? null,
    target_value: input.target_value ?? null,
    current_value: input.current_value ?? 0,
    unit: input.unit ?? null,
    deadline: input.deadline ?? null,
    created_at: ts,
    updated_at: ts,
  };
  const goals = await getList<Goal>(KEYS.goals);
  goals.push(goal);
  await setList(KEYS.goals, goals);
  return goal;
}

export async function updateGoal(id: string, input: Partial<Goal>): Promise<Goal> {
  await ensureDbInitialized();
  const goals = await getList<Goal>(KEYS.goals);
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error("Goal not found");
  const updated: Goal = {
    ...goals[idx],
    ...input,
    id,
    updated_at: now(),
  };
  goals[idx] = updated;
  await setList(KEYS.goals, goals);
  return updated;
}

export async function deleteGoal(id: string): Promise<void> {
  await ensureDbInitialized();
  const goals = await getList<Goal>(KEYS.goals);
  await setList(
    KEYS.goals,
    goals.filter((g) => g.id !== id)
  );
}

// --- Check-ins ---

export async function listCheckins(from?: string, to?: string): Promise<DailyCheckin[]> {
  await ensureDbInitialized();
  let checkins = await getList<DailyCheckin>(KEYS.checkins);
  if (from) checkins = checkins.filter((c) => c.date >= from);
  if (to) checkins = checkins.filter((c) => c.date <= to);
  return checkins.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getCheckin(date: string): Promise<DailyCheckin | null> {
  await ensureDbInitialized();
  const checkins = await getList<DailyCheckin>(KEYS.checkins);
  return checkins.find((c) => c.date === date) ?? null;
}

export async function upsertCheckin(
  date: string,
  input: Partial<DailyCheckin>
): Promise<DailyCheckin> {
  await ensureDbInitialized();
  const checkins = await getList<DailyCheckin>(KEYS.checkins);
  const idx = checkins.findIndex((c) => c.date === date);
  const ts = now();

  if (idx >= 0) {
    const updated: DailyCheckin = {
      ...checkins[idx],
      ...input,
      date,
    };
    checkins[idx] = updated;
    await setList(KEYS.checkins, checkins);
    return updated;
  }

  const created: DailyCheckin = {
    id: crypto.randomUUID(),
    date,
    built_something: input.built_something ?? false,
    career_progress: input.career_progress ?? false,
    quality_time_with_wife: input.quality_time_with_wife ?? false,
    exercise_or_golf: input.exercise_or_golf ?? false,
    no_secret_behavior: input.no_secret_behavior ?? false,
    sleep_hours: input.sleep_hours ?? null,
    notes: input.notes ?? null,
    created_at: ts,
  };
  checkins.push(created);
  await setList(KEYS.checkins, checkins);
  return created;
}

// --- Journal ---

export async function getJournal(date: string): Promise<JournalEntry | null> {
  await ensureDbInitialized();
  const entries = await getList<JournalEntry>(KEYS.journal);
  return entries.find((e) => e.date === date) ?? null;
}

export async function listJournalEntries(): Promise<JournalEntry[]> {
  await ensureDbInitialized();
  const entries = await getList<JournalEntry>(KEYS.journal);
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function upsertJournal(
  date: string,
  input: Partial<JournalEntry>
): Promise<JournalEntry> {
  await ensureDbInitialized();
  const entries = await getList<JournalEntry>(KEYS.journal);
  const idx = entries.findIndex((e) => e.date === date);
  const ts = now();

  if (idx >= 0) {
    const updated: JournalEntry = { ...entries[idx], ...input, date };
    entries[idx] = updated;
    await setList(KEYS.journal, entries);
    return updated;
  }

  const created: JournalEntry = {
    id: crypto.randomUUID(),
    date,
    wins: input.wins ?? null,
    errors: input.errors ?? null,
    trigger: input.trigger ?? null,
    root_cause: input.root_cause ?? null,
    system_fix: input.system_fix ?? null,
    gratitude: input.gratitude ?? null,
    future_self_note: input.future_self_note ?? null,
    created_at: ts,
  };
  entries.push(created);
  await setList(KEYS.journal, entries);
  return created;
}

// --- Relapses ---

export async function listRelapses(): Promise<RelapseLog[]> {
  await ensureDbInitialized();
  const logs = await getList<RelapseLog>(KEYS.relapses);
  return logs.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createRelapse(input: Partial<RelapseLog>): Promise<RelapseLog> {
  await ensureDbInitialized();
  const ts = now();
  const log: RelapseLog = {
    id: crypto.randomUUID(),
    urge_level: input.urge_level ?? null,
    emotion: input.emotion ?? null,
    location: input.location ?? null,
    time_of_day: input.time_of_day ?? null,
    behavior: input.behavior ?? null,
    money_spent: input.money_spent ?? 0,
    notes: input.notes ?? null,
    created_at: ts,
  };
  const logs = await getList<RelapseLog>(KEYS.relapses);
  logs.push(log);
  await setList(KEYS.relapses, logs);
  return log;
}

// --- Reviews ---

function weekEndStr(weekStart: string): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd.toISOString().slice(0, 10);
}

function sessionsInWeek(sessions: EmergencySession[], weekStart: string): EmergencySession[] {
  const endStr = weekEndStr(weekStart);
  return sessions.filter((s) => {
    const d = s.created_at.slice(0, 10);
    return d >= weekStart && d <= endStr;
  });
}

async function getWeekData(weekStart: string) {
  const endStr = weekEndStr(weekStart);
  const [checkins, goals, sessions] = await Promise.all([
    listCheckins(weekStart, endStr),
    listGoals(),
    listEmergencySessions(),
  ]);
  return { checkins, goals, sessions };
}

export async function listReviews(): Promise<WeeklyReview[]> {
  await ensureDbInitialized();
  const reviews = await getList<WeeklyReview>(KEYS.reviews);
  return reviews.sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export async function getReview(weekStart: string): Promise<WeeklyReview | null> {
  await ensureDbInitialized();
  const reviews = await getList<WeeklyReview>(KEYS.reviews);
  return reviews.find((r) => r.week_start === weekStart) ?? null;
}

export async function upsertReview(
  weekStart: string,
  input: Partial<WeeklyReview>
): Promise<WeeklyReview> {
  await ensureDbInitialized();
  const { checkins, goals, sessions } = await getWeekData(weekStart);
  const weekSessions = sessionsInWeek(sessions, weekStart);
  const scores = computeCeoScores(checkins, goals, weekSessions);
  const ceo_summary = generateCeoLetter({ ...input, week_start: weekStart }, scores, checkins);

  const reviews = await getList<WeeklyReview>(KEYS.reviews);
  const idx = reviews.findIndex((r) => r.week_start === weekStart);
  const ts = now();

  if (idx >= 0) {
    const updated: WeeklyReview = {
      ...reviews[idx],
      ...input,
      week_start: weekStart,
      business_score: scores.business,
      health_score: scores.health,
      marriage_score: scores.marriage,
      discipline_score: scores.discipline,
      overall_drift_score: scores.overall,
      ceo_summary,
      updated_at: ts,
    };
    reviews[idx] = updated;
    await setList(KEYS.reviews, reviews);
    return updated;
  }

  const created: WeeklyReview = {
    id: crypto.randomUUID(),
    week_start: weekStart,
    wins: input.wins ?? null,
    leaks: input.leaks ?? null,
    risks: input.risks ?? null,
    root_cause: input.root_cause ?? null,
    next_system: input.next_system ?? null,
    business_score: scores.business,
    health_score: scores.health,
    marriage_score: scores.marriage,
    discipline_score: scores.discipline,
    overall_drift_score: scores.overall,
    ceo_summary,
    created_at: ts,
    updated_at: ts,
  };
  reviews.push(created);
  await setList(KEYS.reviews, reviews);
  return created;
}

export async function ensureCurrentReview(): Promise<WeeklyReview> {
  const weekStart = getWeekStart();
  const existing = await getReview(weekStart);
  if (existing) return existing;

  const { checkins, goals, sessions } = await getWeekData(weekStart);
  const weekSessions = sessionsInWeek(sessions, weekStart);
  const scores = computeCeoScores(checkins, goals, weekSessions);
  const ceo_summary = generateCeoLetter({ week_start: weekStart }, scores, checkins);
  const ts = now();

  const review: WeeklyReview = {
    id: crypto.randomUUID(),
    week_start: weekStart,
    wins: null,
    leaks: null,
    risks: null,
    root_cause: null,
    next_system: null,
    business_score: scores.business,
    health_score: scores.health,
    marriage_score: scores.marriage,
    discipline_score: scores.discipline,
    overall_drift_score: scores.overall,
    ceo_summary,
    created_at: ts,
    updated_at: ts,
  };

  const reviews = await getList<WeeklyReview>(KEYS.reviews);
  reviews.push(review);
  await setList(KEYS.reviews, reviews);
  return review;
}

// --- Manifesto ---

export async function getManifesto(): Promise<IdentityManifesto | null> {
  await ensureDbInitialized();
  return (await get<IdentityManifesto>(KEYS.manifesto)) ?? null;
}

export async function updateManifesto(
  input: Partial<IdentityManifesto>
): Promise<IdentityManifesto> {
  await ensureDbInitialized();
  const current = (await get<IdentityManifesto>(KEYS.manifesto)) ?? DEFAULT_MANIFESTO;
  const updated: IdentityManifesto = {
    ...current,
    ...input,
    id: 1,
    updated_at: now(),
  };
  await set(KEYS.manifesto, updated);
  return updated;
}

// --- Emergency ---

export async function listEmergencySessions(): Promise<EmergencySession[]> {
  await ensureDbInitialized();
  const sessions = await getList<EmergencySession>(KEYS.emergency);
  return sessions.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createEmergencySession(
  input: Partial<EmergencySession>
): Promise<EmergencySession> {
  await ensureDbInitialized();
  const ts = now();
  const session: EmergencySession = {
    id: crypto.randomUUID(),
    emotions: input.emotions ?? [],
    urgency: input.urgency ?? null,
    predicted_feeling: input.predicted_feeling ?? null,
    estimated_cost: input.estimated_cost ?? 0,
    moved_towards_identity: input.moved_towards_identity ?? null,
    urge_passed: input.urge_passed ?? null,
    duration_seconds: input.duration_seconds ?? null,
    created_at: ts,
  };
  const sessions = await getList<EmergencySession>(KEYS.emergency);
  sessions.push(session);
  await setList(KEYS.emergency, sessions);
  return session;
}

// --- Export / Import / Reset ---

export async function exportAllData(): Promise<ExportSnapshot> {
  await ensureDbInitialized();
  const [
    identity_manifesto,
    goals,
    daily_checkins,
    journal_entries,
    relapse_logs,
    weekly_reviews,
    emergency_sessions,
  ] = await Promise.all([
    getManifesto(),
    listGoals(),
    listCheckins(),
    listJournalEntries(),
    listRelapses(),
    listReviews(),
    listEmergencySessions(),
  ]);

  return {
    exportedAt: now(),
    identity_manifesto,
    goals,
    daily_checkins,
    journal_entries,
    relapse_logs,
    weekly_reviews,
    emergency_sessions,
  };
}

export async function importAllData(snapshot: ExportSnapshot): Promise<void> {
  await ensureDbInitialized();

  if (snapshot.identity_manifesto) {
    await set(KEYS.manifesto, { ...snapshot.identity_manifesto, id: 1 });
  }
  if (snapshot.goals?.length) {
    await setList(KEYS.goals, snapshot.goals);
  }
  if (snapshot.daily_checkins?.length) {
    await setList(KEYS.checkins, snapshot.daily_checkins);
  }
  if (snapshot.journal_entries?.length) {
    await setList(KEYS.journal, snapshot.journal_entries);
  }
  if (snapshot.relapse_logs?.length) {
    await setList(KEYS.relapses, snapshot.relapse_logs);
  }
  if (snapshot.weekly_reviews?.length) {
    await setList(KEYS.reviews, snapshot.weekly_reviews);
  }
  if (snapshot.emergency_sessions?.length) {
    await setList(KEYS.emergency, snapshot.emergency_sessions);
  }
}

export async function resetDatabase(): Promise<void> {
  const ts = now();
  await set(KEYS.manifesto, { ...DEFAULT_MANIFESTO, updated_at: ts });
  await set(KEYS.goals, defaultGoals(ts));
  await setList(KEYS.checkins, []);
  await setList(KEYS.journal, []);
  await setList(KEYS.relapses, []);
  await setList(KEYS.reviews, []);
  await setList(KEYS.emergency, []);
  await set(KEYS.initialized, true);
}
