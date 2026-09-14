"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, Newspaper, Inbox, ArrowRight, Clock } from "lucide-react";
import { useCaseStudies } from "@/lib/queries/caseStudies.queries";
import { useInsights } from "@/lib/queries/insights.queries";
import { useEnquiries, useUnreadEnquiryCount } from "@/lib/queries/enquiries.queries";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data: caseStudies, isLoading: loadingCS } = useCaseStudies();
  const { data: insights, isLoading: loadingInsights } = useInsights();
  const { data: unreadCount = 0, isLoading: loadingUnread } = useUnreadEnquiryCount();
  const { data: enquiriesPage, isLoading: loadingEnquiries } = useEnquiries({ limit: 5, page: 1 });

  const totalEnquiries = enquiriesPage?.total ?? 0;
  const recentEnquiries = enquiriesPage?.items ?? [];

  return (
    <div>
      {/* Page title */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <StatCard
          label="Case Studies"
          value={caseStudies?.length ?? 0}
          loading={loadingCS}
          icon={<Film size={16} style={{ color: "var(--text-muted)" }} />}
          href="/dashboard/case-studies"
          accentBorder={false}
        />
        <StatCard
          label="Insight Articles"
          value={insights?.length ?? 0}
          loading={loadingInsights}
          icon={<Newspaper size={16} style={{ color: "var(--text-muted)" }} />}
          href="/dashboard/insights"
          accentBorder={false}
        />
        <StatCard
          label="New Enquiries"
          value={unreadCount}
          loading={loadingUnread}
          icon={<Inbox size={16} style={{ color: "var(--accent)" }} />}
          href="/dashboard/enquiries?status=new"
          accentBorder={true}
          highlight
        />
        <StatCard
          label="Total Enquiries"
          value={totalEnquiries}
          loading={loadingEnquiries}
          icon={<Inbox size={16} style={{ color: "var(--text-muted)" }} />}
          href="/dashboard/enquiries"
          accentBorder={false}
        />
      </div>

      {/* ── Recent enquiries ── */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              Recent Enquiries
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
              Latest 5 submissions
            </p>
          </div>
          <Link
            href="/dashboard/enquiries"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "color 120ms",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {/* Table */}
        {loadingEnquiries ? (
          <div style={{ padding: "20px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom: i < 4 ? "1px solid var(--border-subtle)" : "none",
                }}
              >
                <div className="skeleton" style={{ width: "60px", height: "14px" }} />
                <div className="skeleton" style={{ flex: 1, height: "14px" }} />
                <div className="skeleton" style={{ width: "80px", height: "14px" }} />
                <div className="skeleton" style={{ width: "60px", height: "14px" }} />
              </div>
            ))}
          </div>
        ) : recentEnquiries.length === 0 ? (
          <EmptyEnquiries />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Budget</th>
                <th>Submitted</th>
                <th style={{ width: "48px" }} />
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((enq) => (
                <RecentEnquiryRow key={enq.id} enq={enq} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  loading,
  icon,
  href,
  accentBorder,
  highlight,
}: {
  label: string;
  value: number;
  loading: boolean;
  icon: React.ReactNode;
  href: string;
  accentBorder: boolean;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="stat-card"
      style={{
        border: `1px solid ${accentBorder ? "var(--accent-subtle-border)" : "var(--border-subtle)"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: highlight ? "var(--accent)" : "var(--text-muted)",
          }}
        >
          {label}
        </span>
        {icon}
      </div>
      {loading ? (
        <div className="skeleton" style={{ width: "60px", height: "32px" }} />
      ) : (
        <span
          style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1,
            color: highlight && value > 0 ? "var(--accent)" : "var(--text-primary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      )}
    </Link>
  );
}

// ── Recent enquiry row ─────────────────────────────────────────────────────────

function RecentEnquiryRow({ enq }: { enq: import("@/lib/types").Enquiry }) {
  const router = useRouter();
  const isNew = enq.status === "new";

  return (
    <tr
      onClick={() => router.push(`/dashboard/enquiries/${enq.id}`)}
      style={{
        cursor: "pointer",
        borderLeft: isNew ? "2px solid var(--accent)" : "2px solid transparent",
      }}
    >
      <td>
        <StatusBadge status={enq.status} />
      </td>
      <td style={{ fontWeight: isNew ? 500 : 400 }}>{enq.name}</td>
      <td style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>
        {enq.email}
      </td>
      <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
        {enq.budget ?? "—"}
      </td>
      <td>
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontVariantNumeric: "tabular-nums",
          }}
          title={new Date(enq.submittedAt).toLocaleString()}
        >
          <Clock size={11} />
          {formatDistanceToNow(new Date(enq.submittedAt), { addSuffix: true })}
        </span>
      </td>
      <td>
        <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
      </td>
    </tr>
  );
}

function EmptyEnquiries() {
  return (
    <div
      style={{
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        textAlign: "center",
      }}
    >
      <Inbox size={32} style={{ color: "var(--border-strong)", marginBottom: "8px" }} />
      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
        No enquiries yet
      </p>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
        Contact form submissions will appear here.
      </p>
    </div>
  );
}
