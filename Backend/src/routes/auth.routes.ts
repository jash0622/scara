import { Router } from "express";
import { login, me, changePassword, changeUsername } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware";
import { loginSchema, changePasswordSchema, changeUsernameSchema } from "../schemas/auth.schema";

const router = Router();

// POST /api/auth/login — public, strict rate-limited
router.post("/login", loginRateLimiter, validate(loginSchema), login);

// GET /api/auth/me — admin only, verifies session validity
router.get("/me", requireAuth, me);

// PATCH /api/auth/password — change own password
router.patch("/password", requireAuth, validate(changePasswordSchema), changePassword);

// PATCH /api/auth/username — change own username (re-issues token)
router.patch("/username", requireAuth, validate(changeUsernameSchema), changeUsername);

export default router;
