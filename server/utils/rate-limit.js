import { createError, getRequestIP, setResponseHeader } from 'h3'

/**
 * Simple in-memory, fixed-window rate limiter keyed by client IP.
 *
 * Good enough for a portfolio app on a single instance. Know the limits:
 *  - State lives in process memory, so it is NOT shared between instances.
 *    For a real multi-instance deployment, use a shared store (e.g. Redis
 *    INCR + EXPIRE keyed by IP).
 *  - It trusts X-Forwarded-For for the client IP (Render sets this). Only
 *    enable that trust when you are actually behind a trusted proxy.
 *
 * Tunable via env vars so the deployed app can be adjusted without a redeploy:
 *  - RATE_LIMIT_MAX            (default 10 requests per window)
 *  - RATE_LIMIT_WINDOW_SECONDS (default 900 = 15 minutes)
 */

const DEFAULT_MAX = Math.max(1, Number(process.env.RATE_LIMIT_MAX) || 10)
const DEFAULT_WINDOW_MS =
  Math.max(1, Number(process.env.RATE_LIMIT_WINDOW_SECONDS) || 900) * 1000

// key (scope|ip) -> { count, resetAt }
const buckets = new Map()

const SWEEP_INTERVAL_MS = 5 * 60 * 1000
const MAX_BUCKETS = 10_000
let lastSweepAt = Date.now()

// Periodically drop expired entries so the map can't grow without bound.
function sweep(now) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return
  lastSweepAt = now
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key)
  }
  // Hard cap: evict oldest entries (Map iterates in insertion order).
  while (buckets.size > MAX_BUCKETS) {
    buckets.delete(buckets.keys().next().value)
  }
}

/**
 * Records one attempt and reports whether it is within the allowed budget.
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 */
export function checkRateLimit(
  event,
  { scope = 'default', max = DEFAULT_MAX, windowMs = DEFAULT_WINDOW_MS, now = Date.now() } = {}
) {
  sweep(now)
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `${scope}|${ip}`
  const bucket = buckets.get(key)

  // First attempt of the window (or window already expired) — start a new bucket.
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: Math.max(0, max - 1), retryAfter: 0 }
  }

  bucket.count += 1
  if (bucket.count > max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    }
  }

  return { allowed: true, remaining: max - bucket.count, retryAfter: 0 }
}

/**
 * Rate-limit enforcement for handlers: throws an h3 429 error (with a
 * Retry-After header) when the budget is exhausted.
 */
export function enforceRateLimit(event, opts) {
  const { allowed, retryAfter } = checkRateLimit(event, opts)
  if (allowed) return true

  setResponseHeader(event, 'retry-after', String(retryAfter))
  throw createError({
    statusCode: 429,
    statusMessage: 'Too Many Requests',
    message: 'Too many attempts. Please try again later.',
    data: { retryAfter }
  })
}