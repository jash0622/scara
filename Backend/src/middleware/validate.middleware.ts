import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/apiResponse";

type ValidateTarget = "body" | "query" | "params";

/**
 * Generic zod-schema validation middleware factory.
 * Parses and replaces the target (body/query/params) with the validated+coerced value.
 * Returns 400 with field-level error messages on failure.
 */
export function validate(schema: ZodSchema, target: ValidateTarget = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = formatZodErrors(result.error);
      // Send the first human-readable message as the top-level message
      const firstMessage = result.error.issues[0]?.message ?? "Validation failed";
      const body = {
        success: false,
        error: {
          message: firstMessage,
          code: "VALIDATION_ERROR",
          details,
        },
      };
      res.status(400).json(body);
      return;
    }

    // Replace the request field with the validated (and coerced/defaulted) value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[target] = result.data;
    next();
  };
}

function formatZodErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";
    out[key] = issue.message;
  }
  return out;
}
