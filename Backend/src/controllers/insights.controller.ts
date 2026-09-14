import { Request, Response, NextFunction } from "express";
import * as service from "../services/insights.service";
import { sendSuccess, sendError, mapInsightRow } from "../utils/apiResponse";
import { CreateInsightInput, UpdateInsightInput, ReorderInsightsInput } from "../schemas/insight.schema";

// GET /api/insights
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await service.getAllInsights();
    sendSuccess(res, rows.map((r) => mapInsightRow(r as unknown as Record<string, unknown>)));
  } catch (err) {
    next(err);
  }
}

// GET /api/insights/:id
export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await service.getInsightById(req.params.id);
    if (!row) {
      sendError(res, "Insight not found", "NOT_FOUND", 404);
      return;
    }
    sendSuccess(res, mapInsightRow(row as unknown as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

// POST /api/insights
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = req.body as CreateInsightInput;
    const row = await service.createInsight(input);
    sendSuccess(res, mapInsightRow(row as unknown as Record<string, unknown>), 201);
  } catch (err) {
    next(err);
  }
}

// PUT /api/insights/:id
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = req.body as UpdateInsightInput;
    const row = await service.updateInsight(req.params.id, input);
    sendSuccess(res, mapInsightRow(row as unknown as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/insights/:id
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await service.deleteInsight(req.params.id);
    sendSuccess(res, { id: deleted.id, deleted: true });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/insights/reorder
export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { order } = req.body as ReorderInsightsInput;
    await service.reorderInsights(order);
    sendSuccess(res, { reordered: true, count: order.length });
  } catch (err) {
    next(err);
  }
}
