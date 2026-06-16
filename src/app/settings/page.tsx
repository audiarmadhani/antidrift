import { PageHeader } from "@/components/layout/page-header";
import { ExportImport } from "@/components/settings/export-import";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Your data stays private." />
      <ExportImport />
      <p className="mt-8 text-xs text-muted-foreground">Anti-Drift OS v0.1.0</p>
    </div>
  );
}
