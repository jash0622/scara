import { supabase } from "../config/supabase";
import { InsightArticleRow } from "../types";
import { CreateInsightInput, UpdateInsightInput } from "../schemas/insight.schema";
import { toInsightDBFields } from "../utils/apiResponse";
import { logger } from "../utils/logger";

const TABLE = "insight_articles";

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getAllInsights(): Promise<InsightArticleRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    logger.error({ error }, "getAllInsights failed");
    throw new Error(error.message);
  }

  return (data ?? []) as InsightArticleRow[];
}

export async function getInsightById(id: string): Promise<InsightArticleRow | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logger.error({ error, id }, "getInsightById failed");
    throw new Error(error.message);
  }

  return data as InsightArticleRow | null;
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createInsight(input: CreateInsightInput): Promise<InsightArticleRow> {
  const dbFields = toInsightDBFields(input as unknown as Record<string, unknown>);

  const { data, error } = await supabase
    .from(TABLE)
    .insert(dbFields)
    .select()
    .single();

  if (error) {
    logger.error({ error, input }, "createInsight failed");
    throw new Error(error.message);
  }

  return data as InsightArticleRow;
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateInsight(
  id: string,
  input: UpdateInsightInput
): Promise<InsightArticleRow> {
  const dbFields = toInsightDBFields(input as unknown as Record<string, unknown>);

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logger.error({ error, id, input }, "updateInsight failed");
    // Supabase returns PGRST116 when no rows match
    if (error.code === "PGRST116") {
      const notFound = new Error("Insight not found") as Error & {
        statusCode: number;
        code: string;
      };
      notFound.statusCode = 404;
      notFound.code = "NOT_FOUND";
      throw notFound;
    }
    throw new Error(error.message);
  }

  return data as InsightArticleRow;
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteInsight(id: string): Promise<InsightArticleRow> {
  const existing = await getInsightById(id);
  if (!existing) {
    const err = new Error("Insight not found") as Error & {
      statusCode: number;
      code: string;
    };
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    logger.error({ error, id }, "deleteInsight failed");
    throw new Error(error.message);
  }

  return existing;
}

// ── Reorder ───────────────────────────────────────────────────────────────────

export async function reorderInsights(
  order: { id: string; display_order: number }[]
): Promise<void> {
  const updates = order.map(({ id, display_order }) => ({ id, display_order }));

  const { error } = await supabase
    .from(TABLE)
    .upsert(updates, { onConflict: "id" });

  if (error) {
    logger.error({ error }, "reorderInsights failed");
    throw new Error(error.message);
  }
}
