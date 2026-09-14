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

export async function listEnquiries(
  query: EnquiryListQuery
): Promise<PaginatedResult<EnquiryRow>> {
  const { page, limit, status, budget, from, to } = query;
  const offset = (page - 1) * limit;

  let builder = supabase
    .from(TABLE)
    .select("*", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) builder = builder.eq("status", status);
  if (budget) builder = builder.eq("budget", budget);
  if (from) builder = builder.gte("submitted_at", from);
  if (to) builder = builder.lte("submitted_at", to);

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
