/**
 * Email Template Helper Functions
 *
 * Utility functions for formatting data in email templates.
 */

import { CLINIC_INFO } from "../../constants/contact";

/**
 * Format phone number for display
 *
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.startsWith("84")) {
    // Vietnamese international format: (+84) XXX XXX XXX
    return `(+84) ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.length === 10 && cleaned.startsWith("0")) {
    // Vietnamese local format: (+84) XXX XXX XXX (replacing 0)
    return `(+84) ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 9) {
    // Handle 9-digit numbers (without 0)
    return `(+84) ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  // Return as-is if format not recognized
  return phone;
}

/**
 * Format date and time for display
 *
 * @param date - Date object or ISO string
 * @param includeTime - Whether to include time
 * @returns Formatted date string
 */
export function formatDateTime(
  date: Date | string,
  includeTime: boolean = true,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = true;
  }

  return dateObj.toLocaleString("en-US", options);
}

/**
 * Get service display name
 *
 * @param service - Service code or name
 * @returns Display name for service
 */
export function getServiceDisplayName(service: string): string {
  const serviceMap: Record<string, string> = {
    "general-checkup": "General Check-up",
    "dental-implants": "Dental Implants",
    "teeth-whitening": "Teeth Whitening",
    "dental-braces": "Dental Braces",
    veneers: "Dental Veneers",
    "root-canal": "Root Canal Treatment",
    "tooth-extraction": "Tooth Extraction",
    "dental-cleaning": "Dental Cleaning",
    other: "Other Services",
  };

  // Try to find in map (case-insensitive)
  const normalized = service.toLowerCase().replace(/\s+/g, "-");
  return serviceMap[normalized] || service;
}

/**
 * Escape HTML special characters
 *
 * @param text - Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Truncate text to specified length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Get status badge HTML
 *
 * @param status - Status value
 * @returns HTML for status badge
 */
export function getStatusBadge(status: string): string {
  const statusConfig: Record<string, { label: string; color: string }> = {
    new: { label: "New", color: "#dbeafe" },
    contacted: { label: "Contacted", color: "#fef3c7" },
    scheduled: { label: "Scheduled", color: "#dcfce7" },
    completed: { label: "Completed", color: "#e0e7ff" },
    cancelled: { label: "Cancelled", color: "#fee2e2" },
  };

  const config = statusConfig[status] || { label: status, color: "#f1f5f9" };

  return `
    <span style="
      display: inline-block;
      padding: 4px 12px;
      background-color: ${config.color};
      color: #1e293b;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    ">
      ${config.label}
    </span>
  `;
}

/**
 * Generate mailto link
 *
 * @param email - Email address
 * @param subject - Email subject
 * @param body - Email body
 * @returns Mailto URL
 */
export function generateMailtoLink(
  email: string = CLINIC_INFO.email,
  subject?: string,
  body?: string,
): string {
  const params = new URLSearchParams();

  if (subject) {
    params.append("subject", subject);
  }

  if (body) {
    params.append("body", body);
  }

  const queryString = params.toString();
  return `mailto:${email}${queryString ? "?" + queryString : ""}`;
}

/**
 * Generate tel link
 *
 * @param phone - Phone number
 * @returns Tel URL
 */
export function generateTelLink(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

/**
 * Generate WhatsApp link
 *
 * @param phone - Phone number
 * @param message - Pre-filled message
 * @returns WhatsApp URL
 */
export function generateWhatsAppLink(phone: string, message?: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Ensure it starts with country code
  const phoneWithCode = cleaned.startsWith("84")
    ? cleaned
    : `84${cleaned.replace(/^0/, "")}`;

  const url = `https://wa.me/${phoneWithCode}`;

  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }

  return url;
}

/**
 * Get browser name from user agent
 *
 * @param userAgent - User agent string
 * @returns Browser name
 */
export function getBrowserName(userAgent: string): string {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Unknown";
}

/**
 * Get device type from user agent
 *
 * @param userAgent - User agent string
 * @returns Device type
 */
export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  return "Desktop";
}
