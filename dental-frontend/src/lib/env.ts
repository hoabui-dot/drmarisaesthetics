/**
 * Environment Variables Validation
 *
 * Uses Zod to validate required environment variables at startup.
 * - Server-side vars: validated on every server boot. Missing vars kill the process.
 * - Client-side NEXT_PUBLIC_* vars: validated at server startup too (they're baked
 *   at build, but we still check them so a bad build is caught immediately on boot).
 *
 * NO default values. NO fallbacks. Missing = crash with clear error.
 */

import { z } from "zod";

// Helper to check if we're on server-side
const isServer = typeof window === "undefined";

// ─── Server-side schema ────────────────────────────────────────────────────────
const serverEnvSchema = z.object({
  // Strapi Configuration (Server-side — resolved at runtime)
  STRAPI_URL: z
    .string()
    .min(1, "STRAPI_URL is required")
    .refine(
      (val) => val.startsWith("http://") || val.startsWith("https://"),
      "STRAPI_URL must be a valid URL starting with http:// or https://",
    ),
  STRAPI_API_TOKEN: z.string().min(1, "STRAPI_API_TOKEN is required"),

  // Preview Mode (Server-side)
  NEXT_PREVIEW_SECRET: z.string().min(1, "NEXT_PREVIEW_SECRET is required"),

  // reCAPTCHA Secret (Server-side)
  RECAPTCHA_SECRET_KEY: z.string().min(1, "RECAPTCHA_SECRET_KEY is required"),

  // Email Configuration (Server-side)
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.string().regex(/^\d+$/, "SMTP_PORT must be a valid port number"),
  SMTP_SECURE: z
    .string()
    .regex(/^(true|false)$/, "SMTP_SECURE must be 'true' or 'false'"),
  SMTP_USER: z
    .string()
    .min(1, "SMTP_USER is required")
    .refine((val) => val.includes("@"), "SMTP_USER must be a valid email"),
  SMTP_PASSWORD: z.string().min(1, "SMTP_PASSWORD is required"),

  EMAIL_FROM: z
    .string()
    .min(1, "EMAIL_FROM is required")
    .refine((val) => val.includes("@"), "EMAIL_FROM must be a valid email"),
  EMAIL_FROM_NAME: z.string().min(1, "EMAIL_FROM_NAME is required"),
  EMAIL_TO_ADMIN: z
    .string()
    .min(1, "EMAIL_TO_ADMIN is required")
    .refine(
      (val) => val.includes("@"),
      "EMAIL_TO_ADMIN must be a valid email",
    ),
  EMAIL_TO_STAFF: z
    .string()
    .min(1, "EMAIL_TO_STAFF is required")
    .refine(
      (val) => val.includes("@"),
      "EMAIL_TO_STAFF must be a valid email",
    ),
  EMAIL_ENABLED: z
    .string()
    .regex(/^(true|false)$/, "EMAIL_ENABLED must be 'true' or 'false'"),
  EMAIL_RETRY_ATTEMPTS: z
    .string()
    .regex(/^\d+$/, "EMAIL_RETRY_ATTEMPTS must be a number"),
  EMAIL_RETRY_DELAY: z
    .string()
    .regex(/^\d+$/, "EMAIL_RETRY_DELAY must be a number"),

  // Optional
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  STRAPI_WEBHOOK_SECRET: z.string().optional(),
});

// ─── Client-side schema (NEXT_PUBLIC_* — baked at build, checked at boot) ─────
const clientEnvSchema = z.object({
  NEXT_PUBLIC_STRAPI_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_STRAPI_URL is required")
    .refine(
      (val) => val.startsWith("http://") || val.startsWith("https://"),
      "NEXT_PUBLIC_STRAPI_URL must be a valid URL",
    ),
  NEXT_PUBLIC_STRAPI_API_TOKEN: z
    .string()
    .min(1, "NEXT_PUBLIC_STRAPI_API_TOKEN is required"),
  NEXT_PUBLIC_SERVER_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SERVER_URL is required"),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required"),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;
type ClientEnv = z.infer<typeof clientEnvSchema>;

// ─── Validation ────────────────────────────────────────────────────────────────
function formatZodErrors(
  error: z.ZodError,
  requiredVars: string[],
): string {
  const lines: string[] = [];
  lines.push("\n❌ Environment variable validation failed:");
  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  );
  lines.push("\n📋 Missing or invalid variables:");
  error.issues.forEach((issue, i) => {
    const field = issue.path.join(".");
    lines.push(`  ${i + 1}. ${field}: ${issue.message}`);
  });

  lines.push("\n🔍 Current status:");
  requiredVars.forEach((name) => {
    const val = process.env[name];
    const status = val ? "✅" : "❌";
    const display = val
      ? val.length > 20
        ? `${val.substring(0, 20)}...`
        : val
      : "NOT SET";
    lines.push(`     ${status} ${name}: ${display}`);
  });

  lines.push(
    "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  );
  lines.push("💡 Fix: set all required variables in your .env file.");
  lines.push("📖 Reference: .env.example contains all required variables.");
  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
  );
  return lines.join("\n");
}

function validateEnv<T>(
  schema: z.ZodSchema<T>,
  label: string,
  requiredVars: string[],
): T {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    process.exit(1);
  }
  return result.data;
}

// ─── Initialization (server-side only) ───────────────────────────────────────
let _serverEnv: ServerEnv | null = null;
let _clientEnv: ClientEnv | null = null;

// During `next build` (docker image build), Next.js executes server code to
// pre-render pages. Runtime-only vars (STRAPI_URL, SMTP_*, etc.) are NOT
// available at that point — they're injected by docker-compose at container
// start. We skip server-side validation during the build phase and only run
// it at true runtime (next start / node server.js).
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (isServer && !isBuildPhase) {
  _serverEnv = validateEnv(
    serverEnvSchema,
    "Server env",
    [
      "STRAPI_URL",
      "STRAPI_API_TOKEN",
      "NEXT_PREVIEW_SECRET",
      "RECAPTCHA_SECRET_KEY",
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_SECURE",
      "SMTP_USER",
      "SMTP_PASSWORD",
      "EMAIL_FROM",
      "EMAIL_FROM_NAME",
      "EMAIL_TO_ADMIN",
      "EMAIL_TO_STAFF",
      "EMAIL_ENABLED",
      "EMAIL_RETRY_ATTEMPTS",
      "EMAIL_RETRY_DELAY",
    ],
  );

  _clientEnv = validateEnv(
    clientEnvSchema,
    "Build-time env (NEXT_PUBLIC_*)",
    [
      "NEXT_PUBLIC_STRAPI_URL",
      "NEXT_PUBLIC_STRAPI_API_TOKEN",
      "NEXT_PUBLIC_SERVER_URL",
      "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    ],
  );
} else if (isServer && isBuildPhase) {
  // Build phase: only validate NEXT_PUBLIC_* (baked into bundle — must be present now)
  _clientEnv = validateEnv(
    clientEnvSchema,
    "Build-time env (NEXT_PUBLIC_*)",
    [
      "NEXT_PUBLIC_STRAPI_URL",
      "NEXT_PUBLIC_STRAPI_API_TOKEN",
      "NEXT_PUBLIC_SERVER_URL",
      "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    ],
  );
}

// ─── Accessors ────────────────────────────────────────────────────────────────
export const getServerEnv = (): ServerEnv => {
  if (!isServer) {
    throw new Error(
      "getServerEnv() can only be called on the server side",
    );
  }
  if (!_serverEnv) {
    throw new Error("Server environment not initialized");
  }
  return _serverEnv;
};

// ─── Server-side exports (runtime — available on server only) ────────────────
// Guaranteed non-empty after validation; no || "" fallback needed.
export const STRAPI_URL = isServer ? (process.env.STRAPI_URL as string) : "";
export const STRAPI_API_TOKEN = isServer
  ? (process.env.STRAPI_API_TOKEN as string)
  : "";
export const NEXT_PREVIEW_SECRET = isServer
  ? (process.env.NEXT_PREVIEW_SECRET as string)
  : "";
export const RECAPTCHA_SECRET_KEY = isServer
  ? (process.env.RECAPTCHA_SECRET_KEY as string)
  : "";
export const SMTP_HOST = isServer ? (process.env.SMTP_HOST as string) : "";
export const SMTP_PORT = isServer ? (process.env.SMTP_PORT as string) : "";
export const SMTP_SECURE = isServer
  ? (process.env.SMTP_SECURE as string)
  : "";
export const SMTP_USER = isServer ? (process.env.SMTP_USER as string) : "";
export const SMTP_PASSWORD = isServer
  ? (process.env.SMTP_PASSWORD as string)
  : "";
export const EMAIL_FROM = isServer ? (process.env.EMAIL_FROM as string) : "";
export const EMAIL_FROM_NAME = isServer
  ? (process.env.EMAIL_FROM_NAME as string)
  : "";
export const EMAIL_TO_ADMIN = isServer
  ? (process.env.EMAIL_TO_ADMIN as string)
  : "";
export const EMAIL_TO_STAFF = isServer
  ? (process.env.EMAIL_TO_STAFF as string)
  : "";
export const EMAIL_ENABLED = isServer
  ? (process.env.EMAIL_ENABLED as string)
  : "";
export const EMAIL_RETRY_ATTEMPTS = isServer
  ? (process.env.EMAIL_RETRY_ATTEMPTS as string)
  : "";
export const EMAIL_RETRY_DELAY = isServer
  ? (process.env.EMAIL_RETRY_DELAY as string)
  : "";
export const NODE_ENV = isServer ? (process.env.NODE_ENV ?? "") : "";
export const STRAPI_WEBHOOK_SECRET = isServer
  ? (process.env.STRAPI_WEBHOOK_SECRET ?? "")
  : "";

// ─── Client-side exports (build-time — available everywhere) ─────────────────
// NEXT_PUBLIC_* vars are inlined by Next.js at build time.
// These are validated at server boot; no || "" needed.
export const NEXT_PUBLIC_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL as string;
export const NEXT_PUBLIC_STRAPI_API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN as string;
export const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL as string;
export const NEXT_PUBLIC_RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;
