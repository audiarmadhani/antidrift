"use client";

import { useEffect } from "react";
import { useSyncStore } from "@/lib/stores";

export function SyncStatus() {
  const { isOnline, lastSynced, setOnline, setLastSynced } = useSyncStore();

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => {
      setOnline(true);
      setLastSynced(new Date().toISOString());
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [setOnline, setLastSynced]);

  return (
    <span className="text-xs text-muted-foreground">
      {isOnline ? "Synced" : "Offline — changes saved locally"}
      {lastSynced && isOnline && (
        <span className="hidden sm:inline"> · {new Date(lastSynced).toLocaleTimeString()}</span>
      )}
    </span>
  );
}
