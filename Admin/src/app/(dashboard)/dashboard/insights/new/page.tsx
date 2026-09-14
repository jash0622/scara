"use client";

import { useRouter } from "next/navigation";
import { useCreateInsight } from "@/lib/queries/insights.queries";
import { InsightForm } from "@/components/InsightForm";
import { InsightFormData } from "@/lib/types";

export default function NewInsightPage() {
  const router = useRouter();
  const createMutation = useCreateInsight();

  async function handleSubmit(data: InsightFormData) {
    const result = await createMutation.mutateAsync(data);
    router.push(`/dashboard/insights/${result.id}`);
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <div className="page-header" style={{ marginBottom: "28px" }}>
        <div>
          <h1 className="page-title">New Article</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Add a press article, interview, or authored piece.
          </p>
        </div>
      </div>
      <InsightForm mode="create" onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
    </div>
  );
}
