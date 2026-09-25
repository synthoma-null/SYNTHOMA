// Test-only counter replacing persistence, never imported by runtime code.
const counts = new Map<string, number>();
export function resetPublicRateLimitsForTests() { counts.clear(); }
export async function consumeRateLimit(scope: string, identifier: string, max: number) {
 const key = scope + ':' + identifier;
 const count = (counts.get(key) || 0) + 1;
 counts.set(key, count);
 return { allowed: count <= max, retryAfter: 60 };
}
