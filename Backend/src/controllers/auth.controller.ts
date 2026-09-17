import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { env } from "../config/env";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { AuthenticatedRequest, AdminPayload, AdminRole } from "../types";
import { writeAudit } from "../services/audit.service";
import { logger } from "../utils/logger";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body as { username: string; password: string };

    // Fetch admin record. `role` may not exist on older schemas — select it
    // defensively and default to "admin" so the app works pre-migration.
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, role")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      logger.error({ error }, "auth.login: DB error fetching admin");
      return next(error);
    }

    // Constant-time comparison — always bcrypt.compare even if no user found
    // to prevent timing attacks from revealing whether username exists
    const dummyHash = "$2a$12$invalidhashfortimingprotectiononly.......";
    const hashToCompare = admin?.password_hash ?? dummyHash;
    const isValid = await bcrypt.compare(password, hashToCompare);

    if (!admin || !isValid) {
      sendError(res, "Invalid username or password", "INVALID_CREDENTIALS", 401);
      return;
    }

    const role: AdminRole = admin.role === "editor" ? "editor" : "admin";
    const token = signAdminToken({ username: admin.username, sub: admin.id, role });

    logger.info({ username, role }, "Admin login successful");

    sendSuccess(res, {
      token,
      expiresIn: env.JWT_EXPIRES_IN,
      admin: { username: admin.username, role },
    });
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response): void {
  const { admin } = req as AuthenticatedRequest;
  sendSuccess(res, { username: admin.username, role: admin.role });
}

// ── Change password ─────────────────────────────────────────────────────────
export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    const { admin } = req as AuthenticatedRequest;

    const { data: row, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash")
      .eq("id", admin.sub)
      .maybeSingle();

    if (error) return next(error);
    if (!row) {
      sendError(res, "Account not found", "NOT_FOUND", 404);
      return;
    }

    const ok = await bcrypt.compare(currentPassword, row.password_hash);
    if (!ok) {
      sendError(res, "Current password is incorrect", "INVALID_CREDENTIALS", 401);
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const { error: upErr } = await supabase
      .from("admin_users")
      .update({ password_hash: newHash })
      .eq("id", admin.sub);

    if (upErr) return next(upErr);

    await writeAudit({
      actor: admin.username,
      actorId: admin.sub,
      action: "auth.password_change",
      entity: "admin",
      entityId: admin.sub,
    });

    logger.info({ username: admin.username }, "Admin password changed");
    sendSuccess(res, { updated: true });
  } catch (err) {
    next(err);
  }
}

// ── Change username (re-issues a fresh token) ─────────────────────────────────
export async function changeUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { password, newUsername } = req.body as { password: string; newUsername: string };
    const { admin } = req as AuthenticatedRequest;

    const { data: row, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, role")
      .eq("id", admin.sub)
      .maybeSingle();

    if (error) return next(error);
    if (!row) {
      sendError(res, "Account not found", "NOT_FOUND", 404);
      return;
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      sendError(res, "Password is incorrect", "INVALID_CREDENTIALS", 401);
      return;
    }

    // Ensure the new username isn't taken by another account.
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", newUsername)
      .neq("id", admin.sub)
      .maybeSingle();

    if (existing) {
      sendError(res, "That username is already taken", "USERNAME_TAKEN", 409);
      return;
    }

    const { error: upErr } = await supabase
      .from("admin_users")
      .update({ username: newUsername })
      .eq("id", admin.sub);

    if (upErr) return next(upErr);

    const role: AdminRole = row.role === "editor" ? "editor" : "admin";
    const token = signAdminToken({ username: newUsername, sub: admin.sub, role });

    await writeAudit({
      actor: newUsername,
      actorId: admin.sub,
      action: "auth.username_change",
      entity: "admin",
      entityId: admin.sub,
      meta: { from: row.username, to: newUsername },
    });

    logger.info({ from: row.username, to: newUsername }, "Admin username changed");
    sendSuccess(res, { token, expiresIn: env.JWT_EXPIRES_IN, admin: { username: newUsername, role } });
  } catch (err) {
    next(err);
  }
}

// Sign an admin JWT. Cast expiresIn to `any` — JWT_EXPIRES_IN is a valid
// duration string ("7d") but jsonwebtoken's TS overloads reject bare `string`.
function signAdminToken(payload: AdminPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
}
