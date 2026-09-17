"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Inbox, ArrowRight, ChevronLeft, ChevronRight, Search, Download, X, CheckCheck, Bookmark, Star } from "lucide-react";
import { useEnquiries, useUpdateEnquiryStatus, useBulkUpdateEnquiryStatus } from "@/lib/queries/enquiries.queries";
import { downloadCsv } from "@/lib/api-client";
import { Enquiry, EnquiryFilters } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// ── Saved filter presets (persisted to localStorage) ──────────────────────────
const PRESETS_KEY = "scara_enquiry_presets";
type FilterPreset = { name: string; filters: EnquiryFilters };

function loadPresets(): FilterPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    return raw ? (JSON.parse(raw) as FilterPreset[]) : [];
  } catch {
    return [];
  }
}
function savePresets(presets: FilterPreset[]) {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    /* ignore quota errors */
  }
}

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
] as const;

const BUDGET_OPTIONS = [
  "< $50k",
  "$50k - $100k",
  "$100k - $250k",
  "$250k+",
];

// Parse a comma-separated status string into a Set for chip toggling.
function statusSet(csv?: string): Set<string> {
  return new Set((csv ?? "").split(",").map((s) => s.trim()).filter(Boolean));
}

function EnquiriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<EnquiryFilters>({
    page: 1,
    limit: 20,
    status: searchParams.get("status") ?? undefined,
  });
  // Live search box value (debounced into filters.q).
  const [searchInput, setSearchInput] = useState("");
  // Selected row ids for bulk actions.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  // Saved filter presets.
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  useEffect(() => { setPresets(loadPresets()); }, []);

  function saveCurrentPreset() {
    const name = window.prompt("Name this filter preset:");
    if (!name?.trim()) return;
    const { page: _p, limit: _l, ...rest } = filters;
    void _p; void _l;
    const next = [...presets.filter((p) => p.name !== name.trim()), { name: name.trim(), filters: rest }];
    setPresets(next);
    savePresets(next);
    toast.success(`Preset "${name.trim()}" saved`);
  }
  function applyPreset(p: FilterPreset) {
    setSearchInput(p.filters.q ?? "");
    setFilters({ page: 1, limit: 20, ...p.filters });
  }
  function deletePreset(name: string) {
    const next = presets.filter((p) => p.name !== name);
    setPresets(next);
    savePresets(next);
  }

  const { data, isLoading } = useEnquiries(filters, { poll: true });
  const statusMutation = useUpdateEnquiryStatus();
  const bulkMutation = useBulkUpdateEnquiryStatus();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const activeStatuses = useMemo(() => statusSet(filters.status), [filters.status]);
  const hasFilters = !!(filters.status || filters.budget || filters.q || filters.from || filters.to);

  // Toggle a status chip on/off (multi-select → CSV).
  function toggleStatus(value: string) {
    setFilters((f) => {
      const set = statusSet(f.status);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      const csv = Array.from(set).join(",");
      return { ...f, status: csv || undefined, page: 1 };
    });
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, q: searchInput.trim() || undefined, page: 1 }));
  }

  function clearAll() {
    setSearchInput("");
    setFilters({ page: 1, limit: 20 });
  }

  function setPage(page: number) {
    setFilters((f) => ({ ...f, page }));
    setSelected(new Set());
  }

  // ── Bulk selection helpers ──
  const allSelected = items.length > 0 && items.every((e) => selected.has(e.id));
  function toggleAll() {
    setSelected((prev) => {
      if (items.every((e) => prev.has(e.id))) return new Set();
      return new Set(items.map((e) => e.id));
    });
  }
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function runBulk(status: "new" | "read" | "archived") {
    const ids = Array.from(selected);
    if (!ids.length) return;
    bulkMutation.mutate({ ids, status }, { onSuccess: () => setSelected(new Set()) });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      await downloadCsv(
        "/api/enquiries/export",
        {
          status: filters.status,
          budget: filters.budget,
          q: filters.q,
          from: filters.from,
          to: filters.to,
        },
        `enquiries-${stamp}.csv`
      );
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
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
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <form onSubmit={applySearch} style={{ position: "relative", flex: "1 1 240px", minWidth: "200px" }}>
          <Search
            size={14}
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email, company…"
            className="input-base"
            style={{ paddingLeft: "32px", fontSize: "13px", paddingTop: "7px", paddingBottom: "7px" }}
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setFilters((f) => ({ ...f, q: undefined, page: 1 })); }}
              aria-label="Clear search"
              style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Status multi-select chips */}
        <div style={{ display: "flex", gap: "6px" }}>
          {STATUS_OPTIONS.map((opt) => {
            const active = activeStatuses.has(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleStatus(opt.value)}
                aria-pressed={active}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: `1px solid ${active ? "var(--accent-subtle-border)" : "var(--border-default)"}`,
                  backgroundColor: active ? "var(--accent-subtle-bg)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  transition: "all 120ms ease-out",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Budget filter */}
        <select
          value={filters.budget ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, budget: e.target.value || undefined, page: 1 }))}
          className="input-base"
          style={{ width: "auto", minWidth: "150px", fontSize: "12px", padding: "6px 10px" }}
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

        {/* Export */}
        <button
          className="btn btn-secondary"
          style={{ fontSize: "12px", gap: "6px" }}
          onClick={handleExport}
          disabled={exporting}
          title="Export current results to CSV"
        >
          <Download size={14} />
          {exporting ? "Exporting…" : "Export"}
        </button>

        {/* Save preset */}
        <button
          className="btn btn-ghost"
          style={{ fontSize: "12px", gap: "6px" }}
          onClick={saveCurrentPreset}
          disabled={!hasFilters}
          title={hasFilters ? "Save current filters as a preset" : "Apply filters first"}
        >
          <Bookmark size={14} /> Save preset
        </button>

        {/* Clear filters */}
        {hasFilters && (
          <button className="btn btn-ghost" style={{ fontSize: "12px" }} onClick={clearAll}>
            Clear
          </button>
        )}
      </div>

      {/* ── Saved presets ── */}
      {presets.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "5px" }}>
            <Star size={12} /> Presets
          </span>
          {presets.map((p) => (
            <span
              key={p.name}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "4px 6px 4px 12px", borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-default)", backgroundColor: "var(--bg-surface)",
                fontSize: "12px",
              }}
            >
              <button
                onClick={() => applyPreset(p)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "12px", padding: 0 }}
              >
                {p.name}
              </button>
              <button
                onClick={() => deletePreset(p.name)}
                aria-label={`Delete preset ${p.name}`}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: "2px" }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            padding: "10px 16px",
            backgroundColor: "var(--accent-subtle-bg)",
            border: "1px solid var(--accent-subtle-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <CheckCheck size={15} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>
            {selected.size} selected
          </span>
          <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
            <button className="btn btn-secondary" style={{ fontSize: "12px" }} disabled={bulkMutation.isPending} onClick={() => runBulk("read")}>
              Mark read
            </button>
            <button className="btn btn-secondary" style={{ fontSize: "12px" }} disabled={bulkMutation.isPending} onClick={() => runBulk("archived")}>
              Archive
            </button>
            <button className="btn btn-secondary" style={{ fontSize: "12px" }} disabled={bulkMutation.isPending} onClick={() => runBulk("new")}>
              Mark new
            </button>
            <button className="btn btn-ghost" style={{ fontSize: "12px" }} onClick={() => setSelected(new Set())}>
              Clear
            </button>
          </div>
        </div>
      )}

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
          <EmptyEnquiries hasFilters={hasFilters} />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                    style={{ cursor: "pointer", accentColor: "var(--accent)" }}
                  />
                </th>
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
                <EnquiryRow
                  key={enq.id}
                  enq={enq}
                  onClick={handleRowClick}
                  selected={selected.has(enq.id)}
                  onToggleSelect={toggleOne}
                />
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

export default function EnquiriesPage() {
  return (
    <Suspense>
      <EnquiriesContent />
    </Suspense>
  );
}

function EnquiryRow({
  enq,
  onClick,
  selected,
  onToggleSelect,
}: {
  enq: Enquiry;
  onClick: (e: Enquiry) => void;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const isNew = enq.status === "new";
  return (
    <tr
      onClick={() => onClick(enq)}
      style={{
        cursor: "pointer",
        borderLeft: isNew ? "2px solid var(--accent)" : "2px solid transparent",
        backgroundColor: selected ? "var(--accent-subtle-bg)" : undefined,
      }}
    >
      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(enq.id)}
          aria-label={`Select ${enq.name}`}
          style={{ cursor: "pointer", accentColor: "var(--accent)" }}
        />
      </td>
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
