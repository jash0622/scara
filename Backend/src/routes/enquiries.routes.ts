import { Router } from "express";
import {
  create,
  list,
  getOne,
  updateStatus,
  remove,
} from "../controllers/enquiries.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { enquiryRateLimiter } from "../middleware/rateLimiter.middleware";
import {
  createEnquirySchema,
  enquiryStatusSchema,
  enquiryListQuerySchema,
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

// GET /api/enquiries/:id
router.get("/:id", requireAuth, getOne);

// PATCH /api/enquiries/:id/status
router.patch(
  "/:id/status",
  requireAuth,
  validate(enquiryStatusSchema),
  updateStatus
);

// DELETE /api/enquiries/:id
router.delete("/:id", requireAuth, remove);

export default router;
