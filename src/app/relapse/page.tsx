import { PageHeader } from "@/components/layout/page-header";
import { RelapseForm } from "@/components/relapse/relapse-form";
import { RelapseAnalytics } from "@/components/relapse/relapse-analytics";

export default function RelapsePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Behavior Log"
        description="Clinical record for pattern analysis."
      />
      <RelapseForm />
      <RelapseAnalytics />
    </div>
  );
}
