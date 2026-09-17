import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AdminPayload, AuthenticatedRequest } from "../types";
import { sendError } from "../utils/apiResponse";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "Missing or malformed Authorization header", "UNAUTHORIZED", 401);
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AdminPayload;
    // Tokens issued before roles existed won't carry one — default to "admin"
    // so a single-admin setup keeps full access.
    if (!payload.role) payload.role = "admin";
    (req as AuthenticatedRequest).admin = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      sendError(res, "Token has expired — please log in again", "TOKEN_EXPIRED", 401);
    } else {
      sendError(res, "Invalid token", "INVALID_TOKEN", 401);
    }
  }
}

/**
 * Guard a route so only the given role(s) may proceed. Must run AFTER requireAuth.
 * Example: router.delete("/:id", requireAuth, requireRole("admin"), remove)
 */
export function requireRole(...roles: Array<"admin" | "editor">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const admin = (req as AuthenticatedRequest).admin;
    if (!admin) {
      sendError(res, "Not authenticated", "UNAUTHORIZED", 401);
      return;
    }
    if (!roles.includes(admin.role)) {
      sendError(res, "You don't have permission to perform this action", "FORBIDDEN", 403);
      return;
    }
    next();
  };
}
