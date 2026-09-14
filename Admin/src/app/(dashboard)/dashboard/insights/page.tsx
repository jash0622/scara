"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Newspaper, ExternalLink } from "lucide-react";
import {
  useInsights,
  useDeleteInsight,
  useReorderInsights,
} from "@/lib/queries/insights.queries";
import { InsightArticle } from "@/lib/types";
import { ReorderableTable, Column } from "@/components/ReorderableTable";
import { InsightCategoryBadge } from "@/components/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export default function InsightsPage() {
  const router = useRouter();
  const { data: items = [], isLoading } = useInsights();
  const deleteMutation = useDeleteInsight();
  const reorderMutation = useReorderInsights();

  const [deleteTarget, setDeleteTarget] = useState<InsightArticle | null>(null);
  const [localItems, setLocalItems] = useState<InsightArticle[] | null>(null);

  const displayItems = localItems ?? items;

  function handleReorder(newOrder: InsightArticle[]) {
    setLocalItems(newOrder);
    reorderMutation.mutate(
      newOrder.map((a, i) => ({ id: a.id, display_order: i })),
      { onSettled: () => setLocalItems(null) }
    );
  }

  const columns: Column<InsightArticle>[] = [
    {
      key: "title",
      header: "Title",
      render: (a) => (
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: 0, lineHeight: "18px" }}>
            {a.title}
          </p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0", fontVariantNumeric: "tabular-nums" }}>
            {a.outlet}
          </p>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      width: "140px",
      render: (a) => (
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          {a.author ?? "—"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "160px",
      render: (a) => <InsightCategoryBadge category={a.category} />,
    },
    {
      key: "url",
      header: "URL",
      width: "56px",
      render: (a) => (
        <a
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Open article"
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "var(--text-muted)",
            transition: "color 120ms",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
        >
          <ExternalLink size={13} />
        </a>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "80px",
      render: (a) => (
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="btn btn-ghost"
            style={{ padding: "5px", minWidth: 0 }}
            onClick={() => router.push(`/dashboard/insights/${a.id}`)}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: "5px", minWidth: 0, color: "var(--status-danger)" }}
            onClick={() => setDeleteTarget(a)}
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
          <h1 className="page-title">Insights & Media</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {items.length} {items.length === 1 ? "article" : "articles"} · drag to reorder
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => router.push("/dashboard/insights/new")}>
          <Plus size={15} /> New Article
        </button>
      </div>

      <ReorderableTable
        items={displayItems}
        columns={columns}
        onReorder={handleReorder}
        onRowClick={(a) => router.push(`/dashboard/insights/${a.id}`)}
        loading={isLoading}
        emptyState={<InsightsEmpty />}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently delete this article. This action cannot be undone."
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

function InsightsEmpty() {
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
      <Newspaper size={36} style={{ color: "var(--border-strong)", marginBottom: "8px" }} />
      <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
        No articles yet
      </p>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, marginBottom: "20px" }}>
        Add press coverage and interviews here.
      </p>
      <button className="btn btn-primary" onClick={() => router.push("/dashboard/insights/new")}>
        <Plus size={14} /> Add First Article
      </button>
    </div>
  );
}
