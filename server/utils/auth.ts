import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedUser {
  userId: string;
  name: string;
  email?: string;
  role: "student" | "educator" | "administrator";
}

// Extend Express Request interface with authenticated user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Secret key for signing tokens (strictly derived from server environment variable)
export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  throw new Error(
    "FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is required and must be at least 16 characters long. Fallback keys are strictly disabled for security."
  );
};

/**
 * Validates critical authentication configuration on server boot
 */
export function validateAuthConfig(): void {
  // Enforces that JWT_SECRET is configured before accepting traffic
  getJwtSecret();
}

/**
 * Hashes a plaintext password using scrypt with a unique cryptographically random salt.
 * Output format: scrypt$<salt_hex>$<derived_key_hex>
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Verifies a candidate password against a stored scrypt hash in constant time.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || typeof storedHash !== "string" || !password || typeof password !== "string") {
      return false;
    }
    const parts = storedHash.split("$");
    if (parts.length !== 3 || parts[0] !== "scrypt") {
      return false;
    }
    const salt = parts[1];
    const expectedHashHex = parts[2];
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const expectedBuffer = Buffer.from(expectedHashHex, "hex");

    if (derivedKey.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed HMAC-SHA256 token
 */
export function generateToken(payload: { userId: string; role?: string; email?: string; name?: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days expiration
  const body = Buffer.from(
    JSON.stringify({
      userId: payload.userId,
      role: payload.role || "student",
      email: payload.email || "",
      name: payload.name || "Student",
      exp,
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies and decodes a signed HMAC-SHA256 token
 */
export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", getJwtSecret())
      .update(`${header}.${body}`)
      .digest("base64url");

    // Timing-safe comparison to protect against timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }

    return {
      userId: String(payload.userId),
      role: payload.role || "student",
      email: payload.email,
      name: payload.name || "Student",
    };
  } catch {
    return null;
  }
}

/**
 * Authentication Middleware:
 * Inspects Authorization Bearer token and resolves verified authenticated user context.
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const verified = verifyToken(token);
    if (verified) {
      req.user = verified;
      return next();
    }
  }

  // Default guest session context for public exploratory tasks
  req.user = {
    userId: "guest_learner",
    role: "student",
    name: "ALTA Learner",
  };

  next();
}

/**
 * Authorization Guard: Requires a non-guest, authenticated user session
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.userId === "guest_learner") {
    res.status(401).json({
      error: "Authentication required",
      message: "Please sign in to access or modify this resource.",
    });
    return;
  }
  next();
}
