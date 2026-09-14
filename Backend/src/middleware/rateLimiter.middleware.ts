import rateLimit from "express-rate-limit";

/**
 * Strict limiter for /api/auth/login — brute-force protection.
 * Production: 5 attempts per 15 min. Development: relaxed to 50.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed attempts
  message: {
    success: false,
    error: {
      message: "Too many login attempts. Please try again in 15 minutes.",
      code: "RATE_LIMITED",
    },
  },
});

/**
 * Anti-spam limiter for POST /api/enquiries — 3 submissions per 10 minutes per IP.
 * Prevents contact form spam without impacting real users.
 */
export const enquiryRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many submissions from this IP. Please wait 10 minutes before trying again.",
      code: "RATE_LIMITED",
    },
  },
  skipSuccessfulRequests: false,
});

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 * Applied globally as a baseline DoS guard.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many requests. Please slow down.",
      code: "RATE_LIMITED",
    },
  },
  skipSuccessfulRequests: true, // Don't count successful requests against the limit
});
