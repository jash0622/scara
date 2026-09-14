"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Inbox, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEnquiries, useUpdateEnquiryStatus } from "@/lib/queries/enquiries.queries";
import { Enquiry, EnquiryFilters } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

const STATUS_TABS = [
  { value: undefined,    label: "All" },
  { value: "new",        label: "New" },
  { value: "read",       label: "Read" },
  { value: "archived",   label: "Archived" },
] as const;

const BUDGET_OPTIONS = [
  "< $50k",
  "$50k - $100k",
  "$100k - $250k",
  "$250k+",
];

export default function EnquiriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<EnquiryFilters>({
    page: 1,
    limit: 20,
    status: (searchParams.get("status") as EnquiryFilters["status"]) ?? undefined,
  });

  const { data, isLoading } = useEnquiries(filters);
  const statusMutation = useUpdateEnquiryStatus();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  function setStatus(status: EnquiryFilters["status"]) {
    setFilters((f) => ({ ...f, status, page: 1 }));
  }

  function setPage(page: number) {
    setFilters((f) => ({ ...f, page }));
  }

  function handleRowClick(enq: Enquiry) {
    // Mark as read optimistically when opening
    if (enq.status === "new") {
      statusMutation.mutate({ id: enq.id, status: "read" });
    }
    router.push(`/dashboard/enquiries/${enq.id}`);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enquiries</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {total} total submission{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Status segmented control */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            padding: "3px",
          }}
        >
          {STATUS_TABS.map((tab) => {
            const active = filters.status === tab.value;
            return (
              <button
                key={String(tab.value ?? "all")}
                type="button"
                onClick={() => setStatus(tab.value)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: active ? "var(--bg-surface-raised)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  transition: "all 120ms ease-out",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Budget filter */}
        <select
          value={filters.budget ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, budget: e.target.value || undefined, page: 1 }))}
          className="input-base"
          style={{ width: "auto", minWidth: "160px", fontSize: "12px", padding: "6px 10px" }}
        >
          <option value="">All budgets</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Date range */}
        <input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || undefined, page: 1 }))}
          className="input-base"
          style={{ width: "auto", fontSize: "12px", padding: "6px 10px", colorScheme: "dark" }}
          title="From date"
        />
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>→</span>
        <input
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || undefined, page: 1 }))}
          className="input-base"
          style={{ width: "auto", fontSize: "12px", padding: "6px 10px", colorScheme: "dark" }}
          title="To date"
        />

        {/* Clear filters */}
        {(filters.status || filters.budget || filters.from || filters.to) && (
          <button
            className="btn btn-ghost"
            style={{ fontSize: "12px" }}
            onClick={() => setFilters({ page: 1, limit: 20 })}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <div style={{ padding: "20px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 1fr 120px 100px 40px",
                  gap: "12px",
                  padding: "12px 16px",
                  borderBottom: i < 7 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="skeleton" style={{ height: "14px" }} />
                ))}
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyEnquiries hasFilters={!!(filters.status || filters.budget || filters.from || filters.to)} />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "140px" }}>Budget</th>
                <th style={{ width: "130px" }}>Submitted</th>
                <th style={{ width: "40px" }} />
              </tr>
            </thead>
            <tbody>
              {items.map((enq) => (
                <EnquiryRow key={enq.id} enq={enq} onClick={handleRowClick} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
            Page {filters.page ?? 1} of {totalPages} · {total} total
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              className="btn btn-secondary"
              style={{ padding: "6px 10px" }}
              disabled={!filters.page || filters.page <= 1}
              onClick={() => setPage((filters.page ?? 1) - 1)}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: "6px 10px" }}
              disabled={!filters.page || filters.page >= totalPages}
              onClick={() => setPage((filters.page ?? 1) + 1)}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EnquiryRow({ enq, onClick }: { enq: Enquiry; onClick: (e: Enquiry) => void }) {
  const isNew = enq.status === "new";
  return (
    <tr
      onClick={() => onClick(enq)}
      style={{
        cursor: "pointer",
        borderLeft: isNew ? "2px solid var(--accent)" : "2px solid transparent",
      }}
    >
      <td><StatusBadge status={enq.status} /></td>
      <td style={{ fontWeight: isNew ? 500 : 400 }}>{enq.name}</td>
      <td>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}>
          {enq.email}
        </span>
      </td>
      <td>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{enq.budget ?? "—"}</span>
      </td>
      <td>
        <span
          style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", fontVariantNumeric: "tabular-nums" }}
          title={new Date(enq.submittedAt).toLocaleString()}
        >
          <Clock size={11} />
          {formatDistanceToNow(new Date(enq.submittedAt), { addSuffix: true })}
        </span>
      </td>
      <td><ArrowRight size={13} style={{ color: "var(--text-muted)" }} /></td>
    </tr>
  );
}

function EmptyEnquiries({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      style={{ padding: "64px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}
    >
      <Inbox size={36} style={{ color: "var(--border-strong)", marginBottom: "8px" }} />
      <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
        {hasFilters ? "No enquiries match these filters" : "No enquiries yet"}
      </p>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
        {hasFilters ? "Try clearing your filters." : "Contact form submissions will appear here."}
      </p>
    </div>
  );
}
