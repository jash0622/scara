import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { env } from "../config/env";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { AuthenticatedRequest, AdminPayload } from "../types";
import { logger } from "../utils/logger";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body as { username: string; password: string };

    // Fetch admin record
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash")
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

    const payload: AdminPayload = { username: admin.username, sub: admin.id };
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    logger.info({ username }, "Admin login successful");

    sendSuccess(res, {
      token,
      expiresIn: env.JWT_EXPIRES_IN,
      admin: { username: admin.username },
    });
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response): void {
  const { admin } = req as AuthenticatedRequest;
  sendSuccess(res, { username: admin.username });
}
