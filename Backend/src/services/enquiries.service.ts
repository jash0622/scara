import { supabase } from "../config/supabase";
import { EnquiryRow, PaginatedResult } from "../types";
import { CreateEnquiryInput, EnquiryListQuery } from "../schemas/enquiry.schema";
import { logger } from "../utils/logger";

const TABLE = "enquiries";

// ── Create ────────────────────────────────────────────────────────────────────

export async function createEnquiry(input: CreateEnquiryInput): Promise<EnquiryRow> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      budget: input.budget ?? null,
      message: input.message,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    logger.error({ error, email: input.email }, "createEnquiry failed");
    throw new Error(error.message);
  }

  return data as EnquiryRow;
}

// ── List (paginated + filtered) ───────────────────────────────────────────────

// Parse a comma-separated status string into a validated array (or null for "all").
function parseStatuses(status?: string): Array<"new" | "read" | "archived"> | null {
  if (!status) return null;
  const valid = new Set(["new", "read", "archived"]);
  const list = status
    .split(",")
    .map((s) => s.trim())
    .filter((s) => valid.has(s)) as Array<"new" | "read" | "archived">;
  return list.length ? list : null;
}

// Escape a value for use inside a Supabase .or() ilike pattern.
function escapeSearch(q: string): string {
  // Strip characters that would break the PostgREST or() filter grammar.
  return q.replace(/[,()*]/g, " ").trim();
}

// Apply the shared filter set (status[], budget, search, date range) to a builder.
function applyEnquiryFilters<T>(builder: T, query: EnquiryListQuery): T {
  const { status, budget, q, from, to } = query;
  let b = builder as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  const statuses = parseStatuses(status);
  if (statuses) b = statuses.length === 1 ? b.eq("status", statuses[0]) : b.in("status", statuses);
  if (budget) b = b.eq("budget", budget);
  if (from) b = b.gte("submitted_at", from);
  if (to) b = b.lte("submitted_at", to);

  if (q && q.trim()) {
    const term = escapeSearch(q);
    if (term) {
      b = b.or(`name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%`);
    }
  }
  return b as T;
}

export async function listEnquiries(
  query: EnquiryListQuery
): Promise<PaginatedResult<EnquiryRow>> {
  const { page, limit } = query;
  const offset = (page - 1) * limit;

  let builder = supabase
    .from(TABLE)
    .select("*", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(offset, offset + limit - 1);

  builder = applyEnquiryFilters(builder, query);

  const { data, error, count } = await builder;

  if (error) {
    logger.error({ error, query }, "listEnquiries failed");
    throw new Error(error.message);
  }

  const total = count ?? 0;

  return {
    items: (data ?? []) as EnquiryRow[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ── List all matching rows (no pagination) — used for CSV export ──────────────

export async function listAllEnquiriesForExport(
  query: EnquiryListQuery
): Promise<EnquiryRow[]> {
  let builder = supabase
    .from(TABLE)
    .select("*")
    .order("submitted_at", { ascending: false });

  builder = applyEnquiryFilters(builder, query);

  const { data, error } = await builder;
  if (error) {
    logger.error({ error, query }, "listAllEnquiriesForExport failed");
    throw new Error(error.message);
  }
  return (data ?? []) as EnquiryRow[];
}

// ── Aggregated stats over a date range (computed server-side) ─────────────────

export interface EnquiryStats {
  total: number;
  statusCounts: { new: number; read: number; archived: number };
  budgetDistribution: { name: string; value: number }[];
  monthly: { year: number; month: number; count: number }[]; // month: 0-11
  monthlyByStatus: { year: number; month: number; new: number; read: number; archived: number }[];
}

export async function getEnquiryStats(
  from?: string,
  to?: string
): Promise<EnquiryStats> {
  // Fetch only the lightweight columns we aggregate on, across the range.
  let builder = supabase
    .from(TABLE)
    .select("submitted_at, status, budget");

  if (from) builder = builder.gte("submitted_at", from);
  if (to) builder = builder.lte("submitted_at", to);

  const { data, error } = await builder;
  if (error) {
    logger.error({ error, from, to }, "getEnquiryStats failed");
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Pick<EnquiryRow, "submitted_at" | "status" | "budget">[];

  const statusCounts = { new: 0, read: 0, archived: 0 };
  const budgetMap: Record<string, number> = {};
  const monthMap: Record<string, { year: number; month: number; count: number; new: number; read: number; archived: number }> = {};

  for (const r of rows) {
    // Status
    if (r.status === "new" || r.status === "read" || r.status === "archived") {
      statusCounts[r.status] += 1;
    }
    // Budget
    const b = r.budget ?? "Unknown";
    budgetMap[b] = (budgetMap[b] ?? 0) + 1;
    // Month bucket
    const d = new Date(r.submitted_at);
    if (!Number.isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthMap[key]) {
        monthMap[key] = { year: d.getFullYear(), month: d.getMonth(), count: 0, new: 0, read: 0, archived: 0 };
      }
      monthMap[key].count += 1;
      if (r.status === "new" || r.status === "read" || r.status === "archived") {
        monthMap[key][r.status] += 1;
      }
    }
  }

  const monthly = Object.values(monthMap)
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map(({ year, month, count }) => ({ year, month, count }));

  const monthlyByStatus = Object.values(monthMap)
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map(({ year, month, new: n, read, archived }) => ({ year, month, new: n, read, archived }));

  return {
    total: rows.length,
    statusCounts,
    budgetDistribution: Object.entries(budgetMap).map(([name, value]) => ({ name, value })),
    monthly,
    monthlyByStatus,
  };
}

// ── Bulk status update ────────────────────────────────────────────────────────

export async function bulkUpdateStatus(
  ids: string[],
  status: "new" | "read" | "archived"
): Promise<number> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status })
    .in("id", ids)
    .select("id");

  if (error) {
    logger.error({ error, count: ids.length, status }, "bulkUpdateStatus failed");
    throw new Error(error.message);
  }
  return (data ?? []).length;
}

// ── Get single ────────────────────────────────────────────────────────────────

export async function getEnquiryById(id: string): Promise<EnquiryRow | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error({ error, id }, "getEnquiryById failed");
    throw new Error(error.message);
  }

  return data as EnquiryRow | null;
}

// ── Update status ─────────────────────────────────────────────────────────────

export async function updateEnquiryStatus(
  id: string,
  status: "new" | "read" | "archived"
): Promise<EnquiryRow> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error({ error, id, status }, "updateEnquiryStatus failed");
    if (error.code === "PGRST116") {
      const notFound = new Error("Enquiry not found") as Error & {
        statusCode: number;
        code: string;
      };
      notFound.statusCode = 404;
      notFound.code = "NOT_FOUND";
      throw notFound;
    }
    throw new Error(error.message);
  }

  return data as EnquiryRow;
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteEnquiry(id: string): Promise<void> {
  const existing = await getEnquiryById(id);
  if (!existing) {
    const err = new Error("Enquiry not found") as Error & {
      statusCode: number;
      code: string;
    };
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    logger.error({ error, id }, "deleteEnquiry failed");
    throw new Error(error.message);
  }
}
