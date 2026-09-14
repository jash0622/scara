import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { generalRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { logger } from "./utils/logger";

// ── Route modules ─────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.routes";
import caseStudiesRoutes from "./routes/caseStudies.routes";
import insightsRoutes from "./routes/insights.routes";
import enquiriesRoutes from "./routes/enquiries.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — strict allow-list ──────────────────────────────────────────────────
const allowedOrigins = [env.FRONTEND_URL, env.ADMIN_PANEL_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl, Postman in dev)
      if (!origin) {
        if (env.NODE_ENV === "production") {
          callback(new Error("Origin required in production"), false);
        } else {
          callback(null, true);
        }
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn({ origin }, "CORS blocked request from unlisted origin");
        callback(new Error(`CORS: origin '${origin}' is not allowed`), false);
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // tokens sent via Authorization header, not cookies
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── Global rate limiter ───────────────────────────────────────────────────────
app.use("/api", generalRateLimiter);

// ── Request logging ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.debug({ method: req.method, url: req.url, ip: req.ip }, "Incoming request");
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/case-studies", caseStudiesRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/upload", uploadRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { message: "Route not found", code: "NOT_FOUND" },
  });
});

// ── Centralized error handler — must be last ──────────────────────────────────
app.use(errorHandler);

export default app;
