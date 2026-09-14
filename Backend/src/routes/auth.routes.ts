import { Router } from "express";
import { login, me } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

// POST /api/auth/login — public, strict rate-limited
router.post("/login", loginRateLimiter, validate(loginSchema), login);

// GET /api/auth/me — admin only, verifies session validity
router.get("/me", requireAuth, me);

export default router;
