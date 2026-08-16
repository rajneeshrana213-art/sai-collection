import { NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: { count: number; expiresAt: number };
}

const store: RateLimitStore = {};

export function rateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): { success: boolean; errorResponse?: NextResponse } {
  const now = Date.now();
  const record = store[ip];

  if (!record || record.expiresAt < now) {
    store[ip] = { count: 1, expiresAt: now + windowMs };
    return { success: true };
  }

  if (record.count >= limit) {
    return {
      success: false,
      errorResponse: NextResponse.json(
        { error: "Too many attempts. Please wait a minute before trying again." },
        { status: 429 }
      ),
    };
  }

  record.count += 1;
  return { success: true };
}
