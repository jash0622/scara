"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, Newspaper, Inbox, ArrowRight, Clock, TrendingUp, BarChart2, PieChart as PieIcon } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { useCaseStudies } from "@/lib/queries/caseStudies.queries";
import { useInsights } from "@/lib/queries/insights.queries";
import { useEnquiries, useUnreadEnquiryCount } from "@/lib/queries/enquiries.queries";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

// ── Colour palette ─────────────────────────────────────────────────────────────
const ACCENT = "#C3ED00";
const BUDGET_COLORS = ["#C3ED00", "#5B9DF9", "#34D399", "#FBBF24"];

// ── Build monthly bar-chart data from enquiries list ──────────────────────────
function buildMonthlyData(items: import("@/lib/types").Enquiry[]) {
  const map: Record<string, number> = {};
  items.forEach((e) => {
    const d = new Date(e.submittedAt);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    map[key] = (map[key] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([month, count]) => ({ month, count }))
    .slice(-6);
}

// ── Build budget pie data ─────────────────────────────────────────────────────
function buildBudgetData(items: import("@/lib/types").Enquiry[]) {
  const map: Record<string, number> = {};
  items.forEach((e) => {
    const k = e.budget ?? "Unknown";
    map[k] = (map[k] ?? 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "var(--bg-surface-raised)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "8px 12px",
      fontSize: "12px",
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "4px" }}>{label}</p>
      <p style={{ color: ACCENT, fontWeight: 600 }}>{payload[0].value} enquir{payload[0].value === 1 ? "y" : "ies"}</p>
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "var(--bg-surface-raised)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "8px 12px",
      fontSize: "12px",
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "4px" }}>{payload[0].name}</p>
      <p style={{ color: ACCENT, fontWeight: 600 }}>{payload[0].value} submission{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: caseStudies, isLoading: loadingCS } = useCaseStudies();
  const { data: insights, isLoading: loadingInsights } = useInsights();
  const { data: unreadCount = 0, isLoading: loadingUnread } = useUnreadEnquiryCount();
  // Fetch more for chart accuracy
  const { data: enquiriesPage, isLoading: loadingEnquiries } = useEnquiries({ limit: 100, page: 1 });

  const totalEnquiries = enquiriesPage?.total ?? 0;
  const allEnquiries = enquiriesPage?.items ?? [];
  const recentEnquiries = allEnquiries.slice(0, 5);

  const monthlyData = buildMonthlyData(allEnquiries);
  const budgetData = buildBudgetData(allEnquiries);

  // Status counts
  const newCount = allEnquiries.filter((e) => e.status === "new").length;
  const readCount = allEnquiries.filter((e) => e.status === "read").length;
  const archivedCount = allEnquiries.filter((e) => e.status === "archived").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        <StatCard label="Case Studies" value={caseStudies?.length ?? 0} loading={loadingCS}
          icon={<Film size={16} />} href="/dashboard/case-studies" />
        <StatCard label="Insight Articles" value={insights?.length ?? 0} loading={loadingInsights}
          icon={<Newspaper size={16} />} href="/dashboard/insights" />
        <StatCard label="New Enquiries" value={unreadCount} loading={loadingUnread}
          icon={<Inbox size={16} />} href="/dashboard/enquiries?status=new" highlight />
        <StatCard label="Total Enquiries" value={totalEnquiries} loading={loadingEnquiries}
          icon={<TrendingUp size={16} />} href="/dashboard/enquiries" />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Monthly enquiries bar chart */}
        <div style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
        }}>
          <SectionHeader icon={<BarChart2 size={15} />} title="Enquiries — Last 6 Months" />
          {loadingEnquiries ? (
            <ChartSkeleton />
          ) : monthlyData.length === 0 ? (
            <EmptyChart message="No enquiries yet" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--bg-surface-hover)" }} />
                <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Budget breakdown pie */}
        <div style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
        }}>
          <SectionHeader icon={<PieIcon size={15} />} title="Budget Distribution" />
          {loadingEnquiries ? (
            <ChartSkeleton />
          ) : budgetData.length === 0 ? (
            <EmptyChart message="No budget data yet" />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {budgetData.map((_, index) => (
                      <Cell key={index} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                {budgetData.map((item, i) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      width: "8px", height: "8px", borderRadius: "2px", flexShrink: 0,
                      backgroundColor: BUDGET_COLORS[i % BUDGET_COLORS.length],
                    }} />
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Enquiry status summary ── */}
      {!loadingEnquiries && totalEnquiries > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[
            { label: "New", value: newCount, color: "var(--status-new)" },
            { label: "Read", value: readCount, color: "var(--status-info)" },
            { label: "Archived", value: archivedCount, color: "var(--status-neutral)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: "22px", fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Recent enquiries table ── */}
      <div style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              Recent Enquiries
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>Latest 5 submissions</p>
          </div>
          <Link
            href="/dashboard/enquiries"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-secondary)", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loadingEnquiries ? (
          <div style={{ padding: "20px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: i < 4 ? "1px solid var(--border-subtle)" : "none" }}>
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

// ── Components ────────────────────────────────────────────────────────────────

function StatCard({ label, value, loading, icon, href, highlight }: {
  label: string; value: number; loading: boolean;
  icon: React.ReactNode; href: string; highlight?: boolean;
}) {
  return (
    <Link href={href} className="stat-card" style={{
      border: `1px solid ${highlight ? "var(--accent-subtle-border)" : "var(--border-subtle)"}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 500, textTransform: "uppercase",
          letterSpacing: "0.06em", color: highlight ? "var(--accent)" : "var(--text-muted)",
        }}>{label}</span>
        <span style={{ color: highlight ? "var(--accent)" : "var(--text-muted)", opacity: 0.7 }}>{icon}</span>
      </div>
      {loading ? (
        <div className="skeleton" style={{ width: "60px", height: "32px" }} />
      ) : (
        <span style={{
          fontSize: "32px", fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums",
          color: highlight && value > 0 ? "var(--accent)" : "var(--text-primary)",
        }}>{value}</span>
      )}
    </Link>
  );
}

function RecentEnquiryRow({ enq }: { enq: import("@/lib/types").Enquiry }) {
  const router = useRouter();
  const isNew = enq.status === "new";
  return (
    <tr onClick={() => router.push(`/dashboard/enquiries/${enq.id}`)} style={{
      cursor: "pointer",
      borderLeft: isNew ? "2px solid var(--accent)" : "2px solid transparent",
    }}>
      <td><StatusBadge status={enq.status} /></td>
      <td style={{ fontWeight: isNew ? 500 : 400 }}>{enq.name}</td>
      <td style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)", fontSize: "12px" }}>{enq.email}</td>
      <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{enq.budget ?? "—"}</td>
      <td>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}
          title={new Date(enq.submittedAt).toLocaleString()}>
          <Clock size={11} />
          {formatDistanceToNow(new Date(enq.submittedAt), { addSuffix: true })}
        </span>
      </td>
      <td><ArrowRight size={14} style={{ color: "var(--text-muted)" }} /></td>
    </tr>
  );
}

function EmptyEnquiries() {
  return (
    <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
      <Inbox size={32} style={{ color: "var(--border-strong)", marginBottom: "8px" }} />
      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>No enquiries yet</p>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Contact form submissions will appear here.</p>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px", padding: "0 4px" }}>
      {[60, 90, 45, 110, 75, 95].map((h, i) => (
        <div key={i} className="skeleton" style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0" }} />
      ))}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{message}</p>
    </div>
  );
}
