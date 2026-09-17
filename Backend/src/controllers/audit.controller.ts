import { Request, Response, NextFunction } from "express";
import * as service from "../services/audit.service";
import { sendSuccess } from "../utils/apiResponse";
import { AuditLogRow } from "../types";

function mapAuditRow(row: AuditLogRow) {
  return {
    id: row.id,
    actor: row.actor,
    actorId: row.actor_id,
    action: row.action,
    entity: row.entity,
    entityId: row.entity_id,
    meta: row.meta,
    createdAt: row.created_at,
  };
}

// GET /api/audit  (admin)
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page ?? 1) || 1;
    const limit = Math.min(Number(req.query.limit ?? 50) || 50, 200);
    const result = await service.listAuditLog(page, limit);
    sendSuccess(res, {
      items: result.items.map(mapAuditRow),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}
