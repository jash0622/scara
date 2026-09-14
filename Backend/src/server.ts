// env MUST be imported first — validates all required env vars at boot.
// If any are missing/malformed, the process exits immediately with a clear error.
import "./config/env";

import http from "http";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const server = http.createServer(app);
const PORT = env.PORT;

// ── Boot ──────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      env: env.NODE_ENV,
      frontendUrl: env.FRONTEND_URL,
      adminPanelUrl: env.ADMIN_PANEL_URL,
    },
    `🚀 SCARA API server running on port ${PORT}`
  );
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
function shutdown(signal: string): void {
  logger.info({ signal }, "Received shutdown signal — closing server gracefully");

  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error during server close");
      process.exit(1);
    }
    logger.info("HTTP server closed — process exiting");
    process.exit(0);
  });

  // Force-exit after 10 seconds if connections won't close
  setTimeout(() => {
    logger.warn("Graceful shutdown timed out after 10s — forcing exit");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ── Unhandled rejection / exception guards ────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
  // Do not exit — log and continue; critical rejections will bubble through
  // error handlers naturally
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — shutting down");
  process.exit(1);
});
