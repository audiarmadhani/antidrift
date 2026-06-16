"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function EmergencyFab() {
  const pathname = usePathname();
  if (pathname === "/emergency") return null;

  return (
    <Link
      href="/emergency"
      className={cn(
        "fixed z-50 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-wide",
        "bg-accent-amber/15 text-amber-400 border border-accent-amber/30",
        "shadow-lg shadow-accent-amber/10 hover:bg-accent-amber/25 transition-all duration-150",
        "bottom-20 right-4 md:bottom-6 md:right-6 md:text-sm"
      )}
    >
      I am having an urge
    </Link>
  );
}
