// Simple in-memory rate limiter for serverless edge/node
// Limits per key (e.g., per IP + action)
// Resets naturally as serverless instances cycle

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

const LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  "admin-login": { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  "admin-api": { maxRequests: 60, windowMs: 60 * 1000 },        // 60 req/min
  "public-api": { maxRequests: 120, windowMs: 60 * 1000 },      // 120 req/min
};

/**
 * Check rate limit for a given identifier and action.
 * Returns { allowed: boolean, retryAfter?: number }
 */
export function rateLimit(
  identifier: string,
  action: string = "public-api"
): { allowed: boolean; retryAfter?: number } {
  const config = LIMITS[action] || LIMITS["public-api"];
  const key = `${action}:${identifier}`;
  const now = Date.now();

  // Clean expired entries periodically
  if (store.size > 10000) {
    for (const [k, v] of store) {
      if (v.resetTime < now) store.delete(k);
    }
  }

  const entry = store.get(key);

  if (!entry || entry.resetTime < now) {
    // New window
    store.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}
