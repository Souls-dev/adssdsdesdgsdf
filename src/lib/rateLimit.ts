type RateLimitEntry = {
  count: number;
  firstRequest: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.firstRequest > WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
}

export function rateLimit(
  ip: string,
  action: string
): { allowed: boolean; retryAfter?: number } {
  // Auto-clean entries older than 15 minutes
  cleanupExpiredEntries();

  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  // Window has expired — reset
  if (now - entry.firstRequest > WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  // Within window — check count
  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil(
      (WINDOW_MS - (now - entry.firstRequest)) / 1000
    );
    return { allowed: false, retryAfter };
  }

  // Increment
  entry.count++;
  return { allowed: true };
}
