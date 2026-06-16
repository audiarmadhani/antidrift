"use client";

import { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";
import { flushOfflineQueue } from "@/lib/sync/offline-queue";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => (await get(key)) ?? null,
    setItem: async (key, value) => {
      await set(key, value);
    },
    removeItem: async (key) => {
      await del(key);
    },
  },
  key: "antidrift-query-cache",
});

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json();
}

export { apiFetch, queryClient };

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleOnline = async () => {
      await flushOfflineQueue();
      queryClient.invalidateQueries();
    };
    window.addEventListener("online", handleOnline);
    fetch("/api/reviews/ensure", { method: "POST" }).catch(() => {});
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
