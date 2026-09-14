import { Request, Response, NextFunction } from "express";
import * as service from "../services/caseStudies.service";
import { deleteS3Objects } from "../services/s3.service";
import { sendSuccess, sendError, mapCaseStudyRow } from "../utils/apiResponse";
import { CreateCaseStudyInput, UpdateCaseStudyInput, ReorderCaseStudiesInput } from "../schemas/caseStudy.schema";
import { logger } from "../utils/logger";

// GET /api/case-studies
export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await service.getAllCaseStudies();
    sendSuccess(res, rows.map(mapCaseStudyRow));
  } catch (err) {
    next(err);
  }
}

// GET /api/case-studies/:id
export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await service.getCaseStudyById(req.params.id);
    if (!row) {
      sendError(res, "Case study not found", "NOT_FOUND", 404);
      return;
    }
    sendSuccess(res, mapCaseStudyRow(row));
  } catch (err) {
    next(err);
  }
}

// POST /api/case-studies
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = req.body as CreateCaseStudyInput;
    const row = await service.createCaseStudy(input);
    sendSuccess(res, mapCaseStudyRow(row), 201);
  } catch (err) {
    next(err);
  }
}

// PUT /api/case-studies/:id
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = req.body as UpdateCaseStudyInput;
    const row = await service.updateCaseStudy(req.params.id, input);
    sendSuccess(res, mapCaseStudyRow(row));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/case-studies/:id
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await service.deleteCaseStudy(req.params.id);

    // Best-effort S3 cleanup — collect all image URLs from this record
    const imageUrls: string[] = [
      deleted.hero_image,
      ...(deleted.banner_image ? [deleted.banner_image] : []),
      ...(deleted.gallery ?? []),
    ].filter((url): url is string => Boolean(url));

    // Run async, do not await — never block the HTTP response on S3 cleanup
    deleteS3Objects(imageUrls).catch((err) => {
      logger.error({ err, id: req.params.id }, "S3 cleanup failed after case study delete");
    });

    sendSuccess(res, { id: deleted.id, deleted: true });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/case-studies/reorder
export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { order } = req.body as ReorderCaseStudiesInput;
    await service.reorderCaseStudies(order);
    sendSuccess(res, { reordered: true, count: order.length });
  } catch (err) {
    next(err);
  }
}
