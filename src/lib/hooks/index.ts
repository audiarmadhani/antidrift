"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { queryClient } from "@/lib/providers/query-provider";
import * as db from "@/lib/db/local-store";
import { computeEmergencyAnalytics } from "@/lib/emergency/analytics";
import type {
  DailyCheckin,
  EmergencySession,
  Goal,
  IdentityManifesto,
  JournalEntry,
  RelapseLog,
  WeeklyReview,
} from "@/lib/db/types";

export function useManifesto() {
  return useQuery({
    queryKey: ["manifesto"],
    queryFn: () => db.getManifesto(),
  });
}

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => db.listGoals(),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Goal>) => db.createGoal(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Goal> & { id: string }) =>
      db.updateGoal(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => db.deleteGoal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useCheckins(from?: string, to?: string) {
  return useQuery({
    queryKey: ["checkins", from, to],
    queryFn: () => db.listCheckins(from, to),
  });
}

export function useTodayCheckin() {
  const today = format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["checkin", today],
    queryFn: async () => {
      const checkin = await db.getCheckin(today);
      return (
        checkin ?? {
          date: today,
          built_something: false,
          career_progress: false,
          quality_time_with_wife: false,
          exercise_or_golf: false,
          no_secret_behavior: false,
          sleep_hours: null,
          notes: null,
        }
      );
    },
  });
}

export function useUpsertCheckin() {
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  return useMutation({
    mutationFn: (data: Partial<DailyCheckin>) => db.upsertCheckin(today, data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: ["checkin", today] });
      const prev = qc.getQueryData<DailyCheckin>(["checkin", today]);
      qc.setQueryData(["checkin", today], { ...prev, ...data, date: today });
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["checkin", today], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["checkin", today] });
      qc.invalidateQueries({ queryKey: ["checkins"] });
    },
  });
}

export function useJournal(date: string) {
  return useQuery({
    queryKey: ["journal", date],
    queryFn: async () => {
      const entry = await db.getJournal(date);
      return (
        entry ?? {
          date,
          wins: null,
          errors: null,
          trigger: null,
          root_cause: null,
          system_fix: null,
          gratitude: null,
          future_self_note: null,
        }
      );
    },
    enabled: Boolean(date),
  });
}

export function useJournals() {
  return useQuery({
    queryKey: ["journals"],
    queryFn: () => db.listJournalEntries(),
  });
}

export function useUpsertJournal(date: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<JournalEntry>) => db.upsertJournal(date, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["journal", date] });
      qc.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

export function useRelapses() {
  return useQuery({
    queryKey: ["relapses"],
    queryFn: () => db.listRelapses(),
  });
}

export function useCreateRelapse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RelapseLog>) => db.createRelapse(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["relapses"] }),
  });
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => db.listReviews(),
  });
}

export function useReview(weekStart: string) {
  return useQuery({
    queryKey: ["review", weekStart],
    queryFn: () => db.getReview(weekStart),
    enabled: Boolean(weekStart),
  });
}

export function useEnsureReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => db.ensureCurrentReview(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useUpsertReview(weekStart: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WeeklyReview>) => db.upsertReview(weekStart, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["review", weekStart] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useEmergencySessions() {
  return useQuery({
    queryKey: ["emergency"],
    queryFn: () => db.listEmergencySessions(),
  });
}

export function useEmergencyAnalytics() {
  return useQuery({
    queryKey: ["emergency-analytics"],
    queryFn: async () => {
      const sessions = await db.listEmergencySessions();
      return computeEmergencyAnalytics(sessions);
    },
  });
}

export function useCreateEmergencySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EmergencySession>) => db.createEmergencySession(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency"] });
      qc.invalidateQueries({ queryKey: ["emergency-analytics"] });
    },
  });
}

export { queryClient };
