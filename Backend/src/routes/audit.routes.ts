import { Router } from "express";
import { list } from "../controllers/audit.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

const router = Router();

// GET /api/audit — admin-only activity feed
router.get("/", requireAuth, requireRole("admin"), list);

export default router;
