import { supabase } from "../config/supabase";
import { AuditLogRow, PaginatedResult } from "../types";
import { logger } from "../utils/logger";

const TABLE = "audit_log";

export interface WriteAuditParams {
  actor: string;
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown> | null;
}

/**
 * Record an admin action. Best-effort: a logging failure must NEVER break the
 * underlying operation, so errors are swallowed (and logged) here.
 */
export async function writeAudit(params: WriteAuditParams): Promise<void> {
  try {
    const { error } = await supabase.from(TABLE).insert({
      actor: params.actor,
      actor_id: params.actorId ?? null,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId ?? null,
      meta: params.meta ?? null,
    });
    if (error) {
      logger.warn({ error, action: params.action }, "writeAudit failed (non-fatal)");
    }
  } catch (err) {
    logger.warn({ err, action: params.action }, "writeAudit threw (non-fatal)");
  }
}

// ── List (paginated) ──────────────────────────────────────────────────────────

export async function listAuditLog(
  page: number,
  limit: number
): Promise<PaginatedResult<AuditLogRow>> {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from(TABLE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    // If the audit_log table doesn't exist yet (migration not run), degrade
    // gracefully to an empty feed instead of 500-ing the whole page.
    logger.warn({ error }, "listAuditLog failed — returning empty (table may be missing)");
    return { items: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    items: (data ?? []) as AuditLogRow[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
