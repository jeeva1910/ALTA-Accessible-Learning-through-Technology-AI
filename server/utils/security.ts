import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

/**
 * Redacts passwords and credentials from MongoDB connection strings
 */
export function sanitizeMongoUri(uri?: string): string {
  if (!uri) return "[NOT_CONFIGURED]";
  return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
}

/**
 * Escapes user inputs for safe use in MongoDB RegExp queries (Prevents ReDoS & Regex Injection)
 */
export function escapeRegex(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Recursively sanitizes request objects to prevent NoSQL Operator Injection (e.g. { $gt: "" })
 */
export function sanitizeNoSqlInput(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeNoSqlInput(item));
  }

  const sanitized: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    // Strip keys starting with $ or containing . (MongoDB operator and path injection)
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    sanitized[key] = sanitizeNoSqlInput(obj[key]);
  }
  return sanitized;
}

/**
 * Middleware to sanitize req.body, req.query, and req.params against NoSQL injection
 */
export function noSqlSanitizer(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeNoSqlInput(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeNoSqlInput(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeNoSqlInput(req.params);
  }
  next();
}

/**
 * Standard Security Headers Middleware
 */
export function applySecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
  // Remove sensitive server identification header
  res.removeHeader("X-Powered-By");
  next();
}

/**
 * In-Memory Sliding Window Rate Limiter (No external dependency, protects against DoS/Abuse)
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup interval every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "anonymous";
    const now = Date.now();

    const record = store.get(ip);
    if (!record || now > record.resetTime) {
      store.set(ip, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      return next();
    }

    if (record.count >= options.max) {
      return res.status(429).json({
        error: options.message || "Too many requests. Please try again later.",
        retryAfterMs: Math.max(0, record.resetTime - now),
      });
    }

    record.count += 1;
    next();
  };
}

/**
 * Validates and sanitizes filenames to prevent Directory/Path Traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== "string") return "document";
  // Strip path traversal characters (../, ..\, null bytes, control chars)
  const cleaned = filename
    .replace(/^.*[\\\/]/, "") // Remove path
    .replace(/\0/g, "") // Remove null bytes
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Whitelist characters
    .slice(0, 100); // Limit filename length
  return cleaned || "document";
}
