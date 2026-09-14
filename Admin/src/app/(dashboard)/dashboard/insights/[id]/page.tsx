"use client";

import { useParams, useRouter } from "next/navigation";
import { useInsight, useUpdateInsight, useDeleteInsight } from "@/lib/queries/insights.queries";
import { InsightForm } from "@/components/InsightForm";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { InsightFormData } from "@/lib/types";
import { useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";

export default function EditInsightPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: article, isLoading } = useInsight(id);
  const updateMutation = useUpdateInsight(id);
  const deleteMutation = useDeleteInsight();
  const [showDelete, setShowDelete] = useState(false);

  async function handleSubmit(data: InsightFormData) {
    await updateMutation.mutateAsync(data);
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: "700px" }}>
        <div className="skeleton" style={{ height: "36px", width: "260px", marginBottom: "28px" }} />
        <div className="skeleton" style={{ height: "360px", borderRadius: "var(--radius-lg)" }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: "center", padding: "64px", color: "var(--text-muted)" }}>
        <p>Article not found.</p>
        <button className="btn btn-secondary" style={{ marginTop: "16px" }} onClick={() => router.push("/dashboard/insights")}>
          ← Back to list
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <div className="page-header" style={{ marginBottom: "28px" }}>
        <div style={{ minWidth: 0 }}>
          <h1 className="page-title" style={{ fontSize: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {article.title}
          </h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {article.outlet}
            {article.author && ` · ${article.author}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ gap: "6px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            <ExternalLink size={13} /> View Article
          </a>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)} style={{ gap: "6px" }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <InsightForm
        mode="edit"
        defaultValues={article}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={showDelete}
        title={`Delete "${article.title}"?`}
        description="This will permanently delete this article entry. This cannot be undone."
        loading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => router.push("/dashboard/insights"),
          });
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
