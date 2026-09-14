import { Request, Response, NextFunction } from "express";
import * as service from "../services/enquiries.service";
import { sendEnquiryEmails } from "../services/email.service";
import { sendSuccess, sendError, mapEnquiryRow } from "../utils/apiResponse";
import { CreateEnquiryInput, EnquiryStatusInput, EnquiryListQuery } from "../schemas/enquiry.schema";
import { logger } from "../utils/logger";

// POST /api/enquiries  (public — rate-limited)
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = req.body as CreateEnquiryInput;

    // 1. Save to DB first — this is the source of truth
    const row = await service.createEnquiry(input);

    // 2. Fire emails — best-effort, never blocks the response
    sendEnquiryEmails(
      { name: input.name, email: input.email },
      {
        name: input.name,
        email: input.email,
        company: input.company,
        budget: input.budget,
        message: input.message,
        submittedAt: row.submitted_at,
      }
    ).catch((err) => {
      // This should never throw (Promise.allSettled inside), but guard anyway
      logger.error({ err }, "sendEnquiryEmails threw unexpectedly");
    });

    logger.info({ id: row.id, email: input.email }, "New enquiry created");

    sendSuccess(res, { id: row.id }, 201);
  } catch (err) {
    next(err);
  }
}

// GET /api/enquiries  (admin)
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query as unknown as EnquiryListQuery;
    const result = await service.listEnquiries(query);

    sendSuccess(res, {
      items: result.items.map((r) => mapEnquiryRow(r as unknown as Record<string, unknown>)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/enquiries/:id  (admin)
export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await service.getEnquiryById(req.params.id);
    if (!row) {
      sendError(res, "Enquiry not found", "NOT_FOUND", 404);
      return;
    }
    sendSuccess(res, mapEnquiryRow(row as unknown as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/enquiries/:id/status  (admin)
export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.body as EnquiryStatusInput;
    const row = await service.updateEnquiryStatus(req.params.id, status);
    sendSuccess(res, mapEnquiryRow(row as unknown as Record<string, unknown>));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/enquiries/:id  (admin)
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.deleteEnquiry(req.params.id);
    sendSuccess(res, { id: req.params.id, deleted: true });
  } catch (err) {
    next(err);
  }
}
