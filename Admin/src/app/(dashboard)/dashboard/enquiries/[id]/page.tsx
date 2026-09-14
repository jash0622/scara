"use client";

import { useParams, useRouter } from "next/navigation";
import { useEnquiry, useUpdateEnquiryStatus, useDeleteEnquiry } from "@/lib/queries/enquiries.queries";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
import { Trash2, Mail, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";

type Status = "new" | "read" | "archived";
const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "new",      label: "New" },
  { value: "read",     label: "Read" },
  { value: "archived", label: "Archived" },
];

export default function EnquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: enq, isLoading } = useEnquiry(id);
  const statusMutation = useUpdateEnquiryStatus();
  const deleteMutation = useDeleteEnquiry();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) {
    return (
      <div style={{ maxWidth: "680px" }}>
        <div className="skeleton" style={{ height: "20px", width: "120px", marginBottom: "24px" }} />
        <div className="skeleton" style={{ height: "400px", borderRadius: "var(--radius-lg)" }} />
      </div>
    );
  }

  if (!enq) {
    return (
      <div style={{ textAlign: "center", padding: "64px", color: "var(--text-muted)" }}>
        <p>Enquiry not found.</p>
        <button className="btn btn-secondary" style={{ marginTop: "16px" }} onClick={() => router.push("/dashboard/enquiries")}>
          ← Back to enquiries
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px" }}>
      {/* Back link */}
      <button
        className="btn btn-ghost"
        style={{ marginBottom: "20px", gap: "6px", fontSize: "12px", padding: "5px 8px" }}
        onClick={() => router.push("/dashboard/enquiries")}
      >
        <ArrowLeft size={13} /> Enquiries
      </button>

      {/* ── Header ── */}
      <div className="page-header" style={{ marginBottom: "24px", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title" style={{ fontSize: "22px" }}>{enq.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
            <StatusBadge status={enq.status} />
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={11} />
              {format(new Date(enq.submittedAt), "d MMM yyyy, HH:mm")}
            </span>
          </div>
        </div>
        <button className="btn btn-danger" style={{ gap: "6px", flexShrink: 0 }} onClick={() => setShowDelete(true)}>
          <Trash2 size={13} /> Delete
        </button>
      </div>

      {/* ── Status control ── */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
          Status
        </span>
        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "var(--bg-surface-raised)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            padding: "3px",
          }}
        >
          {STATUS_OPTIONS.map((opt) => {
            const active = enq.status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => statusMutation.mutate({ id: enq.id, status: opt.value })}
                disabled={statusMutation.isPending}
                style={{
                  padding: "5px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: active ? "var(--bg-surface-hover)" : "transparent",
                  color: active
                    ? (opt.value === "new" ? "var(--accent)" : "var(--text-primary)")
                    : "var(--text-muted)",
                  transition: "all 120ms ease-out",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Detail card ── */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        {/* Key-value rows */}
        {[
          {
            label: "Name",
            value: <span style={{ fontWeight: 500 }}>{enq.name}</span>,
          },
          {
            label: "Email",
            value: (
              <a
                href={`mailto:${enq.email}`}
                style={{ color: "var(--status-info)", textDecoration: "none", fontFamily: "var(--font-geist-mono)", fontSize: "13px" }}
              >
                {enq.email}
              </a>
            ),
          },
          {
            label: "Company",
            value: <span style={{ color: enq.company ? "var(--text-primary)" : "var(--text-muted)" }}>{enq.company ?? "—"}</span>,
          },
          {
            label: "Budget Range",
            value: (
              <span style={{ fontWeight: 500, color: enq.budget ? "var(--text-primary)" : "var(--text-muted)" }}>
                {enq.budget ?? "Not specified"}
              </span>
            ),
          },
          {
            label: "Submitted",
            value: (
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
                {format(new Date(enq.submittedAt), "PPPP p")}
              </span>
            ),
          },
        ].map(({ label, value }, i, arr) => (
          <div
            key={label}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "16px",
              padding: "14px 20px",
              alignItems: "center",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </span>
            <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Message ── */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
          }}
        >
          Message
        </div>
        <div
          style={{
            padding: "20px",
            borderLeft: "3px solid var(--accent)",
            margin: "16px",
            backgroundColor: "var(--bg-surface-raised)",
            borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-primary)",
              lineHeight: "22px",
              whiteSpace: "pre-wrap",
              margin: 0,
            }}
          >
            {enq.message}
          </p>
        </div>
      </div>

      {/* ── Reply button ── */}
      <a
        href={`mailto:${enq.email}?subject=Re: Your enquiry to SCARA`}
        className="btn btn-secondary"
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "12px" }}
      >
        <Mail size={14} />
        Reply via Email
      </a>

      <ConfirmDeleteDialog
        open={showDelete}
        title="Delete this enquiry?"
        description={`This will permanently delete the enquiry from ${enq.name} (${enq.email}). This cannot be undone.`}
        loading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => router.push("/dashboard/enquiries"),
          });
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
