/**
 * Next.js Instrumentation Hook
 *
 * This file runs once when the Next.js server starts.
 * It's the perfect place to validate environment variables.
 */

export async function register() {
  // Only run on server-side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import and validate environment variables
    await import("./lib/env");
  }
}
