"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiFetch, queryClient } from "@/lib/providers/query-provider";
import { enqueueMutation } from "@/lib/sync/offline-queue";
import type {
  DailyCheckin,
  EmergencySession,
  Goal,
  IdentityManifesto,
  JournalEntry,
  RelapseLog,
  WeeklyReview,
} from "@/lib/db/types";

async function mutatingFetch<T>(
  url: string,
  method: string,
  body?: unknown
): Promise<T> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    await enqueueMutation({ url, method, body });
    return body as T;
  }
  return apiFetch<T>(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function useManifesto() {
  return useQuery({
    queryKey: ["manifesto"],
    queryFn: () => apiFetch<IdentityManifesto | null>("/api/manifesto"),
  });
}

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => apiFetch<Goal[]>("/api/goals"),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Goal>) =>
      mutatingFetch<Goal>("/api/goals", "POST", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Goal> & { id: string }) =>
      mutatingFetch<Goal>(`/api/goals/${id}`, "PATCH", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      mutatingFetch<{ ok: boolean }>(`/api/goals/${id}`, "DELETE"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useCheckins(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return useQuery({
    queryKey: ["checkins", from, to],
    queryFn: () =>
      apiFetch<DailyCheckin[]>(`/api/checkins${qs ? `?${qs}` : ""}`),
  });
}

export function useTodayCheckin() {
  const today = format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["checkin", today],
    queryFn: () => apiFetch<DailyCheckin>(`/api/checkins/${today}`),
  });
}

export function useUpsertCheckin() {
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  return useMutation({
    mutationFn: (data: Partial<DailyCheckin>) =>
      mutatingFetch<DailyCheckin>(`/api/checkins/${today}`, "PUT", data),
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
    queryFn: () => apiFetch<JournalEntry>(`/api/journal/${date}`),
  });
}

export function useUpsertJournal(date: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<JournalEntry>) =>
      mutatingFetch<JournalEntry>(`/api/journal/${date}`, "PUT", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal", date] }),
  });
}

export function useRelapses() {
  return useQuery({
    queryKey: ["relapses"],
    queryFn: () => apiFetch<RelapseLog[]>("/api/relapse"),
  });
}

export function useCreateRelapse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RelapseLog>) =>
      mutatingFetch<RelapseLog>("/api/relapse", "POST", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["relapses"] }),
  });
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => apiFetch<WeeklyReview[]>("/api/reviews"),
  });
}

export function useReview(weekStart: string) {
  return useQuery({
    queryKey: ["review", weekStart],
    queryFn: () => apiFetch<WeeklyReview | null>(`/api/reviews/${weekStart}`),
    enabled: Boolean(weekStart),
  });
}

export function useEnsureReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<WeeklyReview>("/api/reviews/ensure", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useUpsertReview(weekStart: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WeeklyReview>) =>
      mutatingFetch<WeeklyReview>(`/api/reviews/${weekStart}`, "PUT", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["review", weekStart] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useEmergencySessions() {
  return useQuery({
    queryKey: ["emergency"],
    queryFn: () => apiFetch<EmergencySession[]>("/api/emergency"),
  });
}

export function useEmergencyAnalytics() {
  return useQuery({
    queryKey: ["emergency-analytics"],
    queryFn: () => apiFetch<import("@/lib/db/types").EmergencyAnalytics>(
      "/api/emergency/analytics"
    ),
  });
}

export function useCreateEmergencySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<EmergencySession>) =>
      mutatingFetch<EmergencySession>("/api/emergency", "POST", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency"] });
      qc.invalidateQueries({ queryKey: ["emergency-analytics"] });
    },
  });
}

export { queryClient };
