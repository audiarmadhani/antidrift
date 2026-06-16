import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
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
import { generateCeoLetter } from "@/lib/review/ceo-letter";
import { getWeekStart } from "@/lib/export/markdown";

export async function listGoals(): Promise<Goal[]> {
  const { data, error } = await getSupabase()
    .from("goals")
    .select("*")
    .order("category")
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function createGoal(input: Partial<Goal>): Promise<Goal> {
  const { data, error } = await getSupabase()
    .from("goals")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGoal(id: string, input: Partial<Goal>): Promise<Goal> {
  const { data, error } = await getSupabase()
    .from("goals")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await getSupabase().from("goals").delete().eq("id", id);
  if (error) throw error;
}

export async function listCheckins(from?: string, to?: string): Promise<DailyCheckin[]> {
  let query = getSupabase().from("daily_checkins").select("*").order("date");
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getCheckin(date: string): Promise<DailyCheckin | null> {
  const { data, error } = await getSupabase()
    .from("daily_checkins")
    .select("*")
    .eq("date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertCheckin(
  date: string,
  input: Partial<DailyCheckin>
): Promise<DailyCheckin> {
  const { data, error } = await getSupabase()
    .from("daily_checkins")
    .upsert({ ...input, date }, { onConflict: "date" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getJournal(date: string): Promise<JournalEntry | null> {
  const { data, error } = await getSupabase()
    .from("journal_entries")
    .select("*")
    .eq("date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertJournal(
  date: string,
  input: Partial<JournalEntry>
): Promise<JournalEntry> {
  const { data, error } = await getSupabase()
    .from("journal_entries")
    .upsert({ ...input, date }, { onConflict: "date" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listRelapses(): Promise<RelapseLog[]> {
  const { data, error } = await getSupabase()
    .from("relapse_logs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createRelapse(input: Partial<RelapseLog>): Promise<RelapseLog> {
  const { data, error } = await getSupabase()
    .from("relapse_logs")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listReviews(): Promise<WeeklyReview[]> {
  const { data, error } = await getSupabase()
    .from("weekly_reviews")
    .select("*")
    .order("week_start", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getReview(weekStart: string): Promise<WeeklyReview | null> {
  const { data, error } = await getSupabase()
    .from("weekly_reviews")
    .select("*")
    .eq("week_start", weekStart)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getWeekData(weekStart: string) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const endStr = weekEnd.toISOString().slice(0, 10);

  const [checkins, goals, sessions] = await Promise.all([
    listCheckins(weekStart, endStr),
    listGoals(),
    listEmergencySessions(),
  ]);

  return { checkins, goals, sessions };
}

export async function upsertReview(
  weekStart: string,
  input: Partial<WeeklyReview>
): Promise<WeeklyReview> {
  const { checkins, goals, sessions } = await getWeekData(weekStart);
  const scores = computeCeoScores(checkins, goals, sessions.filter((s) => {
    const d = s.created_at.slice(0, 10);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return d >= weekStart && d <= weekEnd.toISOString().slice(0, 10);
  }));

  const ceo_summary = generateCeoLetter({ ...input, week_start: weekStart }, scores, checkins);

  const { data, error } = await getSupabase()
    .from("weekly_reviews")
    .upsert(
      {
        ...input,
        week_start: weekStart,
        business_score: scores.business,
        health_score: scores.health,
        marriage_score: scores.marriage,
        discipline_score: scores.discipline,
        overall_drift_score: scores.overall,
        ceo_summary,
      },
      { onConflict: "week_start" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function ensureCurrentReview(): Promise<WeeklyReview> {
  const weekStart = getWeekStart();
  const existing = await getReview(weekStart);
  if (existing) return existing;

  const { checkins, goals, sessions } = await getWeekData(weekStart);
  const weekSessions = sessions.filter((s) => {
    const d = s.created_at.slice(0, 10);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return d >= weekStart && d <= weekEnd.toISOString().slice(0, 10);
  });
  const scores = computeCeoScores(checkins, goals, weekSessions);
  const ceo_summary = generateCeoLetter({ week_start: weekStart }, scores, checkins);

  const { data, error } = await getSupabase()
    .from("weekly_reviews")
    .insert({
      week_start: weekStart,
      business_score: scores.business,
      health_score: scores.health,
      marriage_score: scores.marriage,
      discipline_score: scores.discipline,
      overall_drift_score: scores.overall,
      ceo_summary,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getManifesto(): Promise<IdentityManifesto | null> {
  const { data, error } = await getSupabase()
    .from("identity_manifesto")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateManifesto(
  input: Partial<IdentityManifesto>
): Promise<IdentityManifesto> {
  const { data, error } = await getSupabase()
    .from("identity_manifesto")
    .upsert({ id: 1, ...input }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listEmergencySessions(): Promise<EmergencySession[]> {
  const { data, error } = await getSupabase()
    .from("emergency_sessions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEmergencySession(
  input: Partial<EmergencySession>
): Promise<EmergencySession> {
  const { data, error } = await getSupabase()
    .from("emergency_sessions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function exportAllData(): Promise<ExportSnapshot> {
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
    exportedAt: new Date().toISOString(),
    identity_manifesto,
    goals,
    daily_checkins,
    journal_entries,
    relapse_logs,
    weekly_reviews,
    emergency_sessions,
  };
}

async function listJournalEntries(): Promise<JournalEntry[]> {
  const { data, error } = await getSupabase()
    .from("journal_entries")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function importAllData(snapshot: ExportSnapshot): Promise<void> {
  const db = getSupabase();

  if (snapshot.identity_manifesto) {
    const { id: _id, ...manifesto } = snapshot.identity_manifesto;
    await db.from("identity_manifesto").upsert(
      { id: 1, ...manifesto },
      { onConflict: "id" }
    );
  }

  if (snapshot.goals?.length) {
    await db.from("goals").upsert(snapshot.goals, { onConflict: "id" });
  }
  if (snapshot.daily_checkins?.length) {
    await db.from("daily_checkins").upsert(snapshot.daily_checkins, {
      onConflict: "date",
    });
  }
  if (snapshot.journal_entries?.length) {
    await db.from("journal_entries").upsert(snapshot.journal_entries, {
      onConflict: "date",
    });
  }
  if (snapshot.relapse_logs?.length) {
    await db.from("relapse_logs").upsert(snapshot.relapse_logs, {
      onConflict: "id",
    });
  }
  if (snapshot.weekly_reviews?.length) {
    await db.from("weekly_reviews").upsert(snapshot.weekly_reviews, {
      onConflict: "week_start",
    });
  }
  if (snapshot.emergency_sessions?.length) {
    await db.from("emergency_sessions").upsert(snapshot.emergency_sessions, {
      onConflict: "id",
    });
  }
}

export async function resetDatabase(): Promise<void> {
  const db = getSupabase();
  await db.from("emergency_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("weekly_reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("relapse_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("journal_entries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("daily_checkins").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("goals").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  await db.from("identity_manifesto").upsert({
    id: 1,
    identity_statement: "I am a builder who refuses to drift.",
    fear_of_drift: "At 38: no wife, no kids, money gone, nothing built.",
    age_35_vision:
      "Multiple businesses\nHundreds of millions per month\nSafe and sound marriage\nOne child\nScratch golfer\nHealthy body\nBuilder of meaningful things",
    life_principles:
      "Drift destroys lives.\nSystems beat motivation.\nBuilders debug systems.\nIdentity drives behavior.\nSmall actions compound.",
  }, { onConflict: "id" });
}

export { isSupabaseConfigured };
