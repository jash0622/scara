"use client";

import { useRouter } from "next/navigation";
import { useCreateCaseStudy } from "@/lib/queries/caseStudies.queries";
import { CaseStudyForm } from "@/components/CaseStudyForm";
import { CaseStudyFormData } from "@/lib/types";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const createMutation = useCreateCaseStudy();

  async function handleSubmit(data: CaseStudyFormData) {
    const result = await createMutation.mutateAsync(data);
    router.push(`/dashboard/case-studies/${result.id}`);
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="page-header" style={{ marginBottom: "28px" }}>
        <div>
          <h1 className="page-title">New Case Study</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Fill in all required fields then save.
          </p>
        </div>
      </div>

      <CaseStudyForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
