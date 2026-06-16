"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { EmergencyFab } from "./emergency-fab";
import { SyncStatus } from "@/components/shared/sync-status";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmergency = pathname === "/emergency";

  if (isEmergency) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
          <span className="font-semibold">Anti-Drift</span>
          <SyncStatus />
        </header>
        <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 md:px-8 md:pb-8">
          <div className="mb-6 hidden md:flex md:justify-end">
            <SyncStatus />
          </div>
          {children}
        </main>
      </div>
      <BottomNav />
      <EmergencyFab />
    </div>
  );
}
