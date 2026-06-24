import { PageHeader } from "@/components/layout/page-header";
import { ExportImport } from "@/components/settings/export-import";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="All data is stored locally on this device. Export regularly to back up." />
      <ExportImport />
      <p className="mt-8 text-xs text-muted-foreground">Anti-Drift OS v0.1.0</p>
    </div>
  );
}
