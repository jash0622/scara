import { supabase } from "../config/supabase";
import { CaseStudyRow } from "../types";
import { CreateCaseStudyInput, UpdateCaseStudyInput } from "../schemas/caseStudy.schema";
import { uniqueSlug } from "../utils/slugify";
import { toCaseStudyDBFields } from "../utils/apiResponse";
import { logger } from "../utils/logger";

const TABLE = "case_studies";

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getAllCaseStudies(): Promise<CaseStudyRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    logger.error({ error }, "getAllCaseStudies failed");
    throw new Error(error.message);
  }

  return (data ?? []) as CaseStudyRow[];
}

export async function getCaseStudyById(idOrSlug: string): Promise<CaseStudyRow | null> {
  // Support lookup by either UUID (id) or slug
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq(isUuid ? "id" : "slug", idOrSlug)
    .maybeSingle();

  if (error) {
    logger.error({ error, idOrSlug }, "getCaseStudyById failed");
    throw new Error(error.message);
  }

  return data as CaseStudyRow | null;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createCaseStudy(input: CreateCaseStudyInput): Promise<CaseStudyRow> {
  // Generate a unique slug from the title
  const slug = await uniqueSlug(input.title, async (candidate) => {
    const { data } = await supabase
      .from(TABLE)
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    return data !== null;
  });

  const dbFields = toCaseStudyDBFields({ ...input, slug });

  const { data, error } = await supabase
    .from(TABLE)
    .insert(dbFields)
    .select()
    .single();

  if (error) {
    logger.error({ error, input }, "createCaseStudy failed");
    throw new Error(error.message);
  }

  return data as CaseStudyRow;
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateCaseStudy(
  id: string,
  input: UpdateCaseStudyInput
): Promise<CaseStudyRow> {
  // If title is changing, regenerate slug
  let extraFields: Record<string, unknown> = {};
  if (input.title) {
    const newSlug = await uniqueSlug(input.title, async (candidate) => {
      const { data } = await supabase
        .from(TABLE)
        .select("id")
        .eq("slug", candidate)
        .neq("id", id) // exclude self
        .maybeSingle();
      return data !== null;
    });
    extraFields.slug = newSlug;
  }

  const dbFields = toCaseStudyDBFields({ ...input, ...extraFields });

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error({ error, id, input }, "updateCaseStudy failed");
    throw new Error(error.message);
  }

  return data as CaseStudyRow;
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteCaseStudy(id: string): Promise<CaseStudyRow> {
  // Fetch the record first so we can return it and the controller can clean up S3
  const existing = await getCaseStudyById(id);
  if (!existing) {
    const err = new Error("Case study not found") as Error & { statusCode: number; code: string };
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    logger.error({ error, id }, "deleteCaseStudy failed");
    throw new Error(error.message);
  }

  return existing;
}

// ── Reorder ───────────────────────────────────────────────────────────────────

export async function reorderCaseStudies(
  order: { id: string; display_order: number }[]
): Promise<void> {
  // Batch upsert — Supabase supports upsert with onConflict
  const updates = order.map(({ id, display_order }) => ({
    id,
    display_order,
  }));

  const { error } = await supabase
    .from(TABLE)
    .upsert(updates, { onConflict: "id" });

  if (error) {
    logger.error({ error }, "reorderCaseStudies failed");
    throw new Error(error.message);
  }
}

// ── Slug existence check (for uniqueSlug utility) ─────────────────────────────

export async function slugExists(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from(TABLE)
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return data !== null;
}
