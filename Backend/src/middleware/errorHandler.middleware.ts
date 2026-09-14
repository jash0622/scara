import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Centralized error handler — must be registered LAST in the Express middleware chain.
 * Logs the full error server-side (with stack in dev) but only returns a safe,
 * consistent { success, error } shape to the client — never leaks stack traces
 * in production.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV !== "production";
  const statusCode = err.statusCode ?? 500;
  const code = err.code ?? "INTERNAL_ERROR";
  const message =
    statusCode >= 500 && !isDev
      ? "An unexpected error occurred. Please try again later."
      : err.message ?? "An unexpected error occurred.";

  logger.error(
    {
      err,
      req: {
        method: req.method,
        url: req.url,
        ip: req.ip,
      },
    },
    "Unhandled error"
  );

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(isDev && err.stack ? { stack: err.stack } : {}),
    },
  });
}

/** Helper to create a typed app error and pass it to next() */
export function createError(message: string, statusCode: number, code: string): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}
