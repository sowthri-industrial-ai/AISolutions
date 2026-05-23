// lib/rate-limit.ts
// Upstash sliding-window rate limiter (TECH-STACK.md §9).
// 5 demo runs / IP / 10 min, hard cap 50 / IP / day.

export async function rateLimit(
  _req: Request,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  // TODO: derive visitorId (hashed IP + UA), call @upstash/ratelimit, return
  // a friendly 429 reason when blocked.
  return { ok: true };
}
