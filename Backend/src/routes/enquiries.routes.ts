import { Router } from "express";
import {
  create,
  list,
  getOne,
  updateStatus,
  remove,
  stats,
  exportCsv,
  bulkStatus,
  reply,
} from "../controllers/enquiries.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { enquiryRateLimiter } from "../middleware/rateLimiter.middleware";
import {
  createEnquirySchema,
  enquiryStatusSchema,
  enquiryListQuerySchema,
  enquiryStatsQuerySchema,
  bulkStatusSchema,
  replyEnquirySchema,
} from "../schemas/enquiry.schema";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────

// POST /api/enquiries — contact form submission, strict rate-limited
router.post(
  "/",
  enquiryRateLimiter,
  validate(createEnquirySchema),
  create
);

// ── Admin ─────────────────────────────────────────────────────────────────────

// GET /api/enquiries — paginated list with filters
router.get(
  "/",
  requireAuth,
  validate(enquiryListQuerySchema, "query"),
  list
);

// GET /api/enquiries/stats — aggregated metrics (must precede "/:id")
router.get(
  "/stats",
  requireAuth,
  validate(enquiryStatsQuerySchema, "query"),
  stats
);

// GET /api/enquiries/export — CSV download (must precede "/:id")
router.get(
  "/export",
  requireAuth,
  validate(enquiryListQuerySchema, "query"),
  exportCsv
);

// PATCH /api/enquiries/bulk-status — update many at once (must precede "/:id/status")
router.patch(
  "/bulk-status",
  requireAuth,
  validate(bulkStatusSchema),
  bulkStatus
);

// GET /api/enquiries/:id
router.get("/:id", requireAuth, getOne);

// PATCH /api/enquiries/:id/status
router.patch(
  "/:id/status",
  requireAuth,
  validate(enquiryStatusSchema),
  updateStatus
);

// POST /api/enquiries/:id/reply — email the enquirer
router.post(
  "/:id/reply",
  requireAuth,
  validate(replyEnquirySchema),
  reply
);

// DELETE /api/enquiries/:id — admin only (editors cannot delete)
router.delete("/:id", requireAuth, requireRole("admin"), remove);

export default router;
