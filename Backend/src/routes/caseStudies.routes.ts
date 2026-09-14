import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  reorder,
} from "../controllers/caseStudies.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createCaseStudySchema,
  updateCaseStudySchema,
  reorderCaseStudiesSchema,
} from "../schemas/caseStudy.schema";

const router = Router();

// ── Public (read-only) ────────────────────────────────────────────────────────

// GET /api/case-studies — all case studies sorted by display_order
router.get("/", getAll);

// GET /api/case-studies/:id — single case study by id or slug
router.get("/:id", getOne);

// ── Admin (JWT required) ──────────────────────────────────────────────────────

// PATCH /api/case-studies/reorder — MUST be defined before /:id to avoid
// Express treating "reorder" as the :id param
router.patch("/reorder", requireAuth, validate(reorderCaseStudiesSchema), reorder);

// POST /api/case-studies
router.post("/", requireAuth, validate(createCaseStudySchema), create);

// PUT /api/case-studies/:id
router.put("/:id", requireAuth, validate(updateCaseStudySchema), update);

// DELETE /api/case-studies/:id
router.delete("/:id", requireAuth, remove);

export default router;
