"use client";

import { useState } from "react";
import { Activity, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import { useAuditLog, type AuditEntry } from "@/lib/queries/audit.queries";
import { useMe } from "@/lib/queries/auth.queries";
import { formatDistanceToNow, format } from "date-fns";

const ACTION_LABELS: Record<string, string> = {
  "enquiry.status_change": "changed status",
  "enquiry.bulk_status_change": "bulk-updated status",
  "enquiry.delete": "deleted an enquiry",
  "enquiry.reply": "replied to an enquiry",
  "auth.password_change": "changed their password",
  "auth.username_change": "changed their username",
};

function describe(entry: AuditEntry): string {
  const base = ACTION_LABELS[entry.action] ?? entry.action;
  const meta = entry.meta ?? {};
  const parts: string[] = [];
  if (typeof meta.name === "string") parts.push(String(meta.name));
  if (typeof meta.status === "string") parts.push(`→ ${meta.status}`);
  if (typeof meta.count === "number") parts.push(`(${meta.count})`);
  if (typeof meta.to === "string") parts.push(String(meta.to));
  return parts.length ? `${base} ${parts.join(" ")}` : base;
}

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const { data: me } = useMe();
  const { data, isLoading, error } = useAuditLog(page, 50);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // RBAC: audit is admin-only on the backend; editors get a 403.
  if (me && me.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "64px", color: "var(--text-muted)" }}>
        <ShieldAlert size={36} style={{ color: "var(--border-strong)", marginBottom: "12px" }} />
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>Admins only</p>
        <p style={{ fontSize: "13px" }}>The activity log is restricted to admin accounts.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="page-title">Activity</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {total} recorded action{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        {isLoading ? (
          <div style={{ padding: "20px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "16px", margin: "10px 0" }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
            Failed to load activity.
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <Activity size={36} style={{ color: "var(--border-strong)", marginBottom: "8px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>No activity yet</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Admin actions will appear here.</p>
          </div>
        ) : (
          <div>
            {items.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 20px",
                  borderBottom: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <div style={{
                  width: "30px", height: "30px", borderRadius: "var(--radius-full)", flexShrink: 0,
                  backgroundColor: "var(--accent-subtle-bg)", border: "1px solid var(--accent-subtle-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase",
                }}>
                  {entry.actor.slice(0, 1)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0 }}>
                    <span style={{ fontWeight: 600 }}>{entry.actor}</span>{" "}
                    <span style={{ color: "var(--text-secondary)" }}>{describe(entry)}</span>
                  </p>
                </div>
                <span
                  style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}
                  title={format(new Date(entry.createdAt), "PPpp")}
                >
                  {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
            Page {page} of {totalPages} · {total} total
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            <button className="btn btn-secondary" style={{ padding: "6px 10px" }} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={14} />
            </button>
            <button className="btn btn-secondary" style={{ padding: "6px 10px" }} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
