import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Changes you make will sync when you reconnect.
      </p>
      <Link href="/dashboard">
        <Button className="mt-6 rounded-xl">Return to Dashboard</Button>
      </Link>
    </div>
  );
}
