import { PageHeader } from "@/components/layout/page-header";
import { JournalForm } from "@/components/journal/journal-form";

export default function JournalPage() {
  return (
    <div>
      <PageHeader
        title="Journal"
        description="One entry per day. Reflect, then submit."
      />
      <JournalForm />
    </div>
  );
}
