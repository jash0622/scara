import { Request, Response, NextFunction } from "express";
import * as service from "../services/enquiries.service";
import { sendEnquiryEmails, sendReplyEmail } from "../services/email.service";
import { writeAudit } from "../services/audit.service";
import { sendSuccess, sendError, mapEnquiryRow } from "../utils/apiResponse";
import {
  CreateEnquiryInput,
  EnquiryStatusInput,
  EnquiryListQuery,
  EnquiryStatsQuery,
  BulkStatusInput,
  ReplyEnquiryInput,
} from "../schemas/enquiry.schema";
import { AuthenticatedRequest } from "../types";
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
      items: result.items.map((r) => mapEnquiryRow(r)),
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
    sendSuccess(res, mapEnquiryRow(row));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/enquiries/:id/status  (admin)
export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.body as EnquiryStatusInput;
    const row = await service.updateEnquiryStatus(req.params.id, status);
    const admin = (req as AuthenticatedRequest).admin;
    await writeAudit({
      actor: admin.username,
      actorId: admin.sub,
      action: "enquiry.status_change",
      entity: "enquiry",
      entityId: row.id,
      meta: { status, name: row.name },
    });
    sendSuccess(res, mapEnquiryRow(row));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/enquiries/:id  (admin only)
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await service.getEnquiryById(req.params.id);
    await service.deleteEnquiry(req.params.id);
    const admin = (req as AuthenticatedRequest).admin;
    await writeAudit({
      actor: admin.username,
      actorId: admin.sub,
      action: "enquiry.delete",
      entity: "enquiry",
      entityId: req.params.id,
      meta: existing ? { name: existing.name, email: existing.email } : null,
    });
    sendSuccess(res, { id: req.params.id, deleted: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/enquiries/stats  (admin) — aggregated metrics over a date range
export async function stats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { from, to } = req.query as unknown as EnquiryStatsQuery;
    const result = await service.getEnquiryStats(from, to);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

// GET /api/enquiries/export  (admin) — CSV of all rows matching the filters
export async function exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query as unknown as EnquiryListQuery;
    const rows = await service.listAllEnquiriesForExport(query);

    const headers = ["Name", "Email", "Company", "Budget", "Status", "Message", "Submitted At"];
    const escape = (v: unknown): string => {
      const s = v == null ? "" : String(v);
      // Wrap in quotes and double internal quotes; prevents CSV/formula injection issues
      const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    };

    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [r.name, r.email, r.company ?? "", r.budget ?? "", r.status, r.message, r.submitted_at]
          .map(escape)
          .join(",")
      ),
    ];
    // Prepend BOM so Excel opens UTF-8 correctly
    const csv = "\uFEFF" + lines.join("\r\n");

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="enquiries-${stamp}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/enquiries/bulk-status  (admin)
export async function bulkStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { ids, status } = req.body as BulkStatusInput;
    const updated = await service.bulkUpdateStatus(ids, status);
    const admin = (req as AuthenticatedRequest).admin;
    await writeAudit({
      actor: admin.username,
      actorId: admin.sub,
      action: "enquiry.bulk_status_change",
      entity: "enquiry",
      entityId: null,
      meta: { status, count: updated, ids },
    });
    sendSuccess(res, { updated, status });
  } catch (err) {
    next(err);
  }
}

// POST /api/enquiries/:id/reply  (admin) — email the enquirer directly
export async function reply(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { subject, message } = req.body as ReplyEnquiryInput;
    const row = await service.getEnquiryById(req.params.id);
    if (!row) {
      sendError(res, "Enquiry not found", "NOT_FOUND", 404);
      return;
    }

    await sendReplyEmail({
      to: row.email,
      name: row.name,
      subject,
      message,
    });

    // Opening/replying implies it has been handled — mark as read if still new.
    if (row.status === "new") {
      await service.updateEnquiryStatus(row.id, "read");
    }

    const admin = (req as AuthenticatedRequest).admin;
    await writeAudit({
      actor: admin.username,
      actorId: admin.sub,
      action: "enquiry.reply",
      entity: "enquiry",
      entityId: row.id,
      meta: { to: row.email, subject },
    });
    logger.info({ id: row.id, to: row.email, by: admin?.username }, "Reply email sent to enquirer");

    sendSuccess(res, { sent: true, to: row.email });
  } catch (err) {
    next(err);
  }
}
