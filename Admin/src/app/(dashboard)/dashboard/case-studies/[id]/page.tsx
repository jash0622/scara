"use client";

import { useParams, useRouter } from "next/navigation";
import { useCaseStudy, useUpdateCaseStudy, useDeleteCaseStudy } from "@/lib/queries/caseStudies.queries";
import { CaseStudyForm } from "@/components/CaseStudyForm";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { CaseStudyFormData } from "@/lib/types";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function EditCaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: caseStudy, isLoading } = useCaseStudy(id);
  const updateMutation = useUpdateCaseStudy(id);
  const deleteMutation = useDeleteCaseStudy();
  const [showDelete, setShowDelete] = useState(false);

  async function handleSubmit(data: CaseStudyFormData) {
    await updateMutation.mutateAsync(data);
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: "860px" }}>
        <div style={{ height: "36px", width: "260px", marginBottom: "28px" }} className="skeleton" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: "200px", marginBottom: "16px", borderRadius: "var(--radius-lg)" }} />
        ))}
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div style={{ textAlign: "center", padding: "64px", color: "var(--text-muted)" }}>
        <p>Case study not found.</p>
        <button className="btn btn-secondary" style={{ marginTop: "16px" }} onClick={() => router.push("/dashboard/case-studies")}>
          ← Back to list
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="page-header" style={{ marginBottom: "28px" }}>
        <div>
          <h1 className="page-title" style={{ fontSize: "22px" }}>{caseStudy.title}</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-geist-mono)" }}>
            {caseStudy.client} · {caseStudy.year} · {caseStudy.market}
          </p>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => setShowDelete(true)}
          style={{ gap: "6px" }}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      <CaseStudyForm
        mode="edit"
        defaultValues={caseStudy}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={showDelete}
        title={`Delete "${caseStudy.title}"?`}
        description="This will permanently delete this case study and all its images. This cannot be undone."
        loading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => router.push("/dashboard/case-studies"),
          });
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
