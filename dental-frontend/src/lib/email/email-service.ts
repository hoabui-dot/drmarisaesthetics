/**
 * Email Service
 *
 * Centralized email sending service using Nodemailer.
 * Handles SMTP configuration, retry logic, and error handling.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Email configuration from environment variables
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const EMAIL_FROM = process.env.EMAIL_FROM || "vanhoa.bui2628@gmail.com";
const EMAIL_FROM_NAME =
  process.env.EMAIL_FROM_NAME || "DR. MARIS AESTHETICS";
const EMAIL_ENABLED = process.env.EMAIL_ENABLED !== "false"; // Default to true
const EMAIL_RETRY_ATTEMPTS = parseInt(process.env.EMAIL_RETRY_ATTEMPTS || "3");
const EMAIL_RETRY_DELAY = parseInt(process.env.EMAIL_RETRY_DELAY || "5000");

/**
 * Email options interface
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Email send result interface
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  attempts: number;
}

/**
 * Create email transporter
 */
function createTransporter(): Transporter | null {
  if (!EMAIL_ENABLED) {
    return null;
  }

  if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
    return null;
  }

  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    return transporter;
  } catch (error) {
    return null;
  }
}

/**
 * Send email with retry logic
 *
 * @param options - Email options
 * @param attempt - Current attempt number (for retry logic)
 * @returns Promise<EmailResult>
 */
export async function sendEmail(
  options: EmailOptions,
  attempt: number = 1,
): Promise<EmailResult> {
  // Check if email is enabled
  if (!EMAIL_ENABLED) {
    return {
      success: false,
      error: "Email sending is disabled",
      attempts: attempt,
    };
  }

  // Create transporter
  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: false,
      error: "Failed to create email transporter",
      attempts: attempt,
    };
  }

  // Prepare email
  const mailOptions = {
    from: options.from || `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
    to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || stripHtml(options.html),
    replyTo: options.replyTo,
    cc: options.cc,
    bcc: options.bcc,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      attempts: attempt,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Retry logic
    if (attempt < EMAIL_RETRY_ATTEMPTS) {
      const delay = EMAIL_RETRY_DELAY * attempt; // Exponential backoff

      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendEmail(options, attempt + 1);
    }

    // Final failure
    return {
      success: false,
      error: errorMessage,
      attempts: attempt,
    };
  }
}

/**
 * Send multiple emails in parallel
 *
 * @param emailList - Array of email options
 * @returns Promise<EmailResult[]>
 */
export async function sendBulkEmails(
  emailList: EmailOptions[],
): Promise<EmailResult[]> {
  const results = await Promise.allSettled(
    emailList.map((options) => sendEmail(options)),
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        success: false,
        error: result.reason?.message || "Unknown error",
        attempts: 1,
      };
    }
  });
}

/**
 * Verify SMTP connection
 *
 * @returns Promise<boolean>
 */
export async function verifyEmailConnection(): Promise<boolean> {
  if (!EMAIL_ENABLED) {
    return false;
  }

  const transporter = createTransporter();
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return false;
  }
}

/**
 * Strip HTML tags from string (for plain text fallback)
 *
 * @param html - HTML string
 * @returns Plain text string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*<\/style>/gm, "")
    .replace(/<script[^>]*>.*<\/script>/gm, "")
    .replace(/<[^>]+>/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Format email address with name
 *
 * @param email - Email address
 * @param name - Display name
 * @returns Formatted email string
 */
export function formatEmailAddress(email: string, name?: string): string {
  if (name) {
    return `"${name}" <${email}>`;
  }
  return email;
}

/**
 * Validate email address format
 *
 * @param email - Email address to validate
 * @returns boolean
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
