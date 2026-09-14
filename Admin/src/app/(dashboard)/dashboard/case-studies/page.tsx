"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Star, Film } from "lucide-react";
import {
  useCaseStudies,
  useDeleteCaseStudy,
  useReorderCaseStudies,
} from "@/lib/queries/caseStudies.queries";
import { CaseStudy } from "@/lib/types";
import { ReorderableTable, Column } from "@/components/ReorderableTable";
import { CategoryBadge } from "@/components/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export default function CaseStudiesPage() {
  const router = useRouter();
  const { data: items = [], isLoading } = useCaseStudies();
  const deleteMutation = useDeleteCaseStudy();
  const reorderMutation = useReorderCaseStudies();

  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const [localItems, setLocalItems] = useState<CaseStudy[] | null>(null);

  // Use local order if a reorder is in progress, else use server data
  const displayItems = localItems ?? items;

  function handleReorder(newOrder: CaseStudy[]) {
    setLocalItems(newOrder);
    reorderMutation.mutate(
      newOrder.map((cs, i) => ({ id: cs.id, display_order: i })),
      { onSettled: () => setLocalItems(null) }
    );
  }

  const columns: Column<CaseStudy>[] = [
    {
      key: "title",
      header: "Title",
      render: (cs) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {cs.heroImage && (
            <img
              src={cs.heroImage}
              alt=""
              style={{
                width: "40px",
                height: "28px",
                objectFit: "cover",
                borderRadius: "4px",
                flexShrink: 0,
                border: "1px solid var(--border-subtle)",
              }}
            />
          )}
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
              {cs.title}
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
              {cs.client}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "year",
      header: "Year",
      width: "72px",
      render: (cs) => (
        <span style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums", color: "var(--text-secondary)" }}>
          {cs.year}
        </span>
      ),
    },
    {
      key: "market",
      header: "Market",
      width: "96px",
      render: (cs) => (
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{cs.market}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "120px",
      render: (cs) => <CategoryBadge category={cs.category} />,
    },
    {
      key: "ip",
      header: "IP",
      width: "48px",
      render: (cs) =>
        cs.isFeaturedIP ? (
          <Star size={13} style={{ color: "var(--accent)" }} fill="var(--accent)" />
        ) : (
          <span style={{ color: "var(--border-strong)" }}>—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      width: "80px",
      render: (cs) => (
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-ghost"
            style={{ padding: "5px", minWidth: 0 }}
            onClick={() => router.push(`/dashboard/case-studies/${cs.id}`)}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: "5px", minWidth: 0, color: "var(--status-danger)" }}
            onClick={() => setDeleteTarget(cs)}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Case Studies</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {items.length} {items.length === 1 ? "campaign" : "campaigns"} · drag rows to reorder
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/dashboard/case-studies/new")}
        >
          <Plus size={15} />
          New Case Study
        </button>
      </div>

      <ReorderableTable
        items={displayItems}
        columns={columns}
        onReorder={handleReorder}
        onRowClick={(cs) => router.push(`/dashboard/case-studies/${cs.id}`)}
        loading={isLoading}
        emptyState={<CaseStudiesEmpty />}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently delete this case study and its images. This action cannot be undone."
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function CaseStudiesEmpty() {
  const router = useRouter();
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "64px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        textAlign: "center",
      }}
    >
      <Film size={36} style={{ color: "var(--border-strong)", marginBottom: "8px" }} />
      <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
        No case studies yet
      </p>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, marginBottom: "20px" }}>
        Add your first campaign to get started.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => router.push("/dashboard/case-studies/new")}
      >
        <Plus size={14} /> Create First Case Study
      </button>
    </div>
  );
}
