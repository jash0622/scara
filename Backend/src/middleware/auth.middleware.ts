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
