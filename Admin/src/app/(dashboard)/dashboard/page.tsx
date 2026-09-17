"use client";

import { useMemo, useState } from "react";
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
  Legend,
} from "recharts";
import { useCaseStudies } from "@/lib/queries/caseStudies.queries";
import { useInsights } from "@/lib/queries/insights.queries";
import { useEnquiries, useUnreadEnquiryCount, useEnquiryStats } from "@/lib/queries/enquiries.queries";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

// ── Colour palette ─────────────────────────────────────────────────────────────
const ACCENT = "#C3ED00";
const BUDGET_COLORS = ["#C3ED00", "#5B9DF9", "#34D399", "#FBBF24"];
const STATUS_COLORS = { new: "#C3ED00", read: "#5B9DF9", archived: "#6E6E73" };

type YMonth = { year: number; month: number }; // month: 0-11

// Iterate months from start..end inclusive, calling fn for each. Guard reversed input.
function eachMonth(start: YMonth, end: YMonth, fn: (y: number, m: number, label: string) => void) {
  let y = start.year;
  let m = start.month;
  for (let i = 0; i < 120; i++) {
    const label = new Date(y, m, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    fn(y, m, label);
    if (y === end.year && m === end.month) break;
    m += 1;
    if (m > 11) { m = 0; y += 1; }
    if (y > end.year + 1) break;
  }
}

// ── Build monthly bar-chart data from server buckets over a continuous range ──
// Zero-fills empty months, always chronological.
function buildMonthlyData(
  serverMonths: { year: number; month: number; count: number }[],
  start: YMonth,
  end: YMonth
) {
  const tally: Record<string, number> = {};
  serverMonths.forEach((s) => { tally[`${s.year}-${s.month}`] = s.count; });

  const buckets: { month: string; count: number }[] = [];
  eachMonth(start, end, (y, m, label) => {
    buckets.push({ month: label, count: tally[`${y}-${m}`] ?? 0 });
  });
  return buckets;
}

// ── Build monthly-by-status data (stacked bars) from server buckets ───────────
function buildMonthlyByStatus(
  serverMonths: { year: number; month: number; new: number; read: number; archived: number }[],
  start: YMonth,
  end: YMonth
) {
  const tally: Record<string, { new: number; read: number; archived: number }> = {};
  serverMonths.forEach((s) => { tally[`${s.year}-${s.month}`] = { new: s.new, read: s.read, archived: s.archived }; });

  const buckets: { month: string; new: number; read: number; archived: number }[] = [];
  eachMonth(start, end, (y, m, label) => {
    const t = tally[`${y}-${m}`] ?? { new: 0, read: 0, archived: 0 };
    buckets.push({ month: label, new: t.new, read: t.read, archived: t.archived });
  });
  return buckets;
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

// ── Month/year range selector for the enquiries chart ─────────────────────────
type YM = { year: number; month: number }; // month: 0-11

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MonthRangeSelector({
  start,
  end,
  onChange,
  onReset,
}: {
  start: YM;
  end: YM;
  onChange: (start: YM, end: YM) => void;
  onReset: () => void;
}) {
  const thisYear = new Date().getFullYear();
  // Offer a sensible span of selectable years (5 years back → current).
  const years = Array.from({ length: 6 }, (_, i) => thisYear - 5 + i);

  const selectStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-surface-raised)",
    border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-sm, 6px)",
    color: "var(--text-primary)",
    fontSize: "12px",
    padding: "4px 6px",
    outline: "none",
    cursor: "pointer",
  };
  const labelStyle: React.CSSProperties = { fontSize: "11px", color: "var(--text-muted)" };

  // Quick presets relative to the current month.
  const applyLast = (months: number) => {
    const now = new Date();
    const s = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    onChange(
      { year: s.getFullYear(), month: s.getMonth() },
      { year: now.getFullYear(), month: now.getMonth() }
    );
  };

  const presetBtn = (label: string, onClick: () => void): React.ReactNode => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "transparent",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm, 6px)",
        color: "var(--text-secondary)",
        fontSize: "11px",
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
      {presetBtn("6M", () => applyLast(6))}
      {presetBtn("12M", () => applyLast(12))}
      {presetBtn("Reset", onReset)}

      <span style={{ ...labelStyle, marginLeft: "4px" }}>From</span>
      <select
        aria-label="Start month"
        value={start.month}
        onChange={(e) => onChange({ ...start, month: Number(e.target.value) }, end)}
        style={selectStyle}
      >
        {MONTH_NAMES.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select
        aria-label="Start year"
        value={start.year}
        onChange={(e) => onChange({ ...start, year: Number(e.target.value) }, end)}
        style={selectStyle}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <span style={labelStyle}>To</span>
      <select
        aria-label="End month"
        value={end.month}
        onChange={(e) => onChange(start, { ...end, month: Number(e.target.value) })}
        style={selectStyle}
      >
        {MONTH_NAMES.map((m, i) => (
          <option key={m} value={i}>{m}</option>
        ))}
      </select>
      <select
        aria-label="End year"
        value={end.year}
        onChange={(e) => onChange(start, { ...end, year: Number(e.target.value) })}
        style={selectStyle}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: caseStudies, isLoading: loadingCS } = useCaseStudies();
  const { data: insights, isLoading: loadingInsights } = useInsights();
  const { data: unreadCount = 0, isLoading: loadingUnread } = useUnreadEnquiryCount();

  // ── Chart month range ── default: the last 6 months up to the current month.
  const now = new Date();
  const defaultEnd = { year: now.getFullYear(), month: now.getMonth() };
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const defaultStart = { year: defaultStartDate.getFullYear(), month: defaultStartDate.getMonth() };

  const [rangeStart, setRangeStart] = useState(defaultStart);
  const [rangeEnd, setRangeEnd] = useState(defaultEnd);

  // Ensure start <= end; if a user picks an inverted range we swap for the query.
  const [orderedStart, orderedEnd] = useMemo(() => {
    const s = rangeStart.year * 12 + rangeStart.month;
    const e = rangeEnd.year * 12 + rangeEnd.month;
    return s <= e ? [rangeStart, rangeEnd] : [rangeEnd, rangeStart];
  }, [rangeStart, rangeEnd]);

  // Derive ISO from/to covering the whole selected span (first day of start month
  // → last moment of end month) so the backend gte/lte on submitted_at matches.
  const fromISO = useMemo(
    () => new Date(orderedStart.year, orderedStart.month, 1, 0, 0, 0).toISOString(),
    [orderedStart]
  );
  const toISO = useMemo(
    () => new Date(orderedEnd.year, orderedEnd.month + 1, 0, 23, 59, 59, 999).toISOString(),
    [orderedEnd]
  );

  // ── Server-aggregated stats for the selected range — drives ALL charts + counts.
  const { data: stats, isLoading: loadingStats } = useEnquiryStats({ from: fromISO, to: toISO });

  // Recent-enquiries table + total card: latest submissions (unfiltered).
  const { data: enquiriesPage, isLoading: loadingEnquiries } = useEnquiries({ limit: 5, page: 1 });

  const totalEnquiries = enquiriesPage?.total ?? 0;
  const recentEnquiries = enquiriesPage?.items ?? [];

  // Build continuous monthly buckets from the server stats over the selected range.
  const monthlyData = buildMonthlyData(stats?.monthly ?? [], orderedStart, orderedEnd);
  const monthlyByStatusData = buildMonthlyByStatus(stats?.monthlyByStatus ?? [], orderedStart, orderedEnd);
  const budgetData = stats?.budgetDistribution ?? [];

  // Status counts (within the selected range) drive the summary strip + funnel.
  const newCount = stats?.statusCounts.new ?? 0;
  const readCount = stats?.statusCounts.read ?? 0;
  const archivedCount = stats?.statusCounts.archived ?? 0;
  const rangeTotal = stats?.total ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* ── Page header ── */}
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        {/* Global date range — drives every chart + range totals below */}
        <MonthRangeSelector
          start={rangeStart}
          end={rangeEnd}
          onChange={(s, e) => { setRangeStart(s); setRangeEnd(e); }}
          onReset={() => { setRangeStart(defaultStart); setRangeEnd(defaultEnd); }}
        />
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
          <SectionHeader
            icon={<BarChart2 size={15} />}
            title="Enquiries over time"
            action={
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                {rangeTotal} total
              </span>
            }
          />
          {loadingStats ? (
            <ChartSkeleton />
          ) : monthlyData.length === 0 ? (
            <EmptyChart message="No enquiries in this range" />
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
          {loadingStats ? (
            <ChartSkeleton />
          ) : budgetData.length === 0 ? (
            <EmptyChart message="No budget data in this range" />
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

      {/* ── Status breakdown over time (stacked) ── */}
      <div style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
      }}>
        <SectionHeader icon={<BarChart2 size={15} />} title="Enquiries by status over time" />
        {loadingStats ? (
          <ChartSkeleton />
        ) : monthlyByStatusData.length === 0 ? (
          <EmptyChart message="No enquiries in this range" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyByStatusData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "var(--bg-surface-hover)" }} contentStyle={{
                backgroundColor: "var(--bg-surface-raised)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)", fontSize: "12px",
              }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="new" stackId="s" fill={STATUS_COLORS.new} radius={[0, 0, 0, 0]} maxBarSize={48} name="New" />
              <Bar dataKey="read" stackId="s" fill={STATUS_COLORS.read} maxBarSize={48} name="Read" />
              <Bar dataKey="archived" stackId="s" fill={STATUS_COLORS.archived} radius={[4, 4, 0, 0]} maxBarSize={48} name="Archived" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Conversion funnel (range) — new → read → archived ── */}
      {!loadingStats && rangeTotal > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {[
            { label: "New", value: newCount, color: STATUS_COLORS.new },
            { label: "Read", value: readCount, color: STATUS_COLORS.read },
            { label: "Archived", value: archivedCount, color: STATUS_COLORS.archived },
          ].map(({ label, value, color }) => {
            const pct = rangeTotal > 0 ? Math.round((value / rangeTotal) * 100) : 0;
            return (
              <div key={label} style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
                </div>
                <div style={{ height: "6px", borderRadius: "999px", backgroundColor: "var(--bg-surface-hover)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, transition: "width 300ms ease-out" }} />
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "6px 0 0", fontVariantNumeric: "tabular-nums" }}>{pct}% of range</p>
              </div>
            );
          })}
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
