import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  reorder,
} from "../controllers/insights.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createInsightSchema,
  updateInsightSchema,
  reorderInsightsSchema,
} from "../schemas/insight.schema";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/insights
router.get("/", getAll);

// GET /api/insights/:id
router.get("/:id", getOne);

// ── Admin ─────────────────────────────────────────────────────────────────────

// PATCH /api/insights/reorder — before /:id to avoid param collision
router.patch("/reorder", requireAuth, validate(reorderInsightsSchema), reorder);

// POST /api/insights
router.post("/", requireAuth, validate(createInsightSchema), create);

// PUT /api/insights/:id
router.put("/:id", requireAuth, validate(updateInsightSchema), update);

// DELETE /api/insights/:id
router.delete("/:id", requireAuth, remove);

export default router;
