import { PageHeader } from "@/components/layout/page-header";
import { JournalForm } from "@/components/journal/journal-form";

export default function JournalPage() {
  return (
    <div>
      <PageHeader
        title="Journal"
        description="Daily postmortem. Focus on system failures, not shame."
      />
      <JournalForm />
    </div>
  );
}
