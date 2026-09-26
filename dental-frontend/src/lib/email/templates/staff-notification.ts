/**
 * Staff Notification Email Templates
 * Single-file Responsive HTML with Inline CSS
 */

import {
  formatPhoneNumber,
  getServiceDisplayName,
  escapeHtml,
} from "./helpers";

export interface BookingNotificationData {
  fullName: string;
  phoneNumber: string;
  email?: string;
  service: string;
  otherService?: string;
  message?: string;
  siteName?: string;
  logoUrl?: string;
}

export interface PromotionNotificationData {
  phoneNumber: string;
  promotionName?: string;
}

// Global wrapper to enforce system-ui font and background
const wrapHTML = (content: string, borderRadius = 16) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DR. MARIS AESTHETICS</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; -webkit-font-smoothing: antialiased; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 40px 0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: ${borderRadius}px; overflow: hidden;">
          <tr>
            <td>
              ${content}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

/**
 * Generate Booking notification email HTML
 */
export function generateBookingNotificationEmail(
  data: BookingNotificationData,
): string {
  const serviceName =
    data.service === "Other" && data.otherService
      ? data.otherService
      : getServiceDisplayName(data.service);

  const siteName = data.siteName || "DR. MARIS AESTHETICS";
  const safeLogoUrl = data.logoUrl && /^https?:\/\//i.test(data.logoUrl)
    ? data.logoUrl
    : undefined;
  const phoneLink = data.phoneNumber.replace(/[^\d+]/g, "");
  const rows = [
    `<tr><td style="width: 138px; padding: 13px 12px 13px 16px; border-bottom: 1px solid #E8EDF3; color: #64748B; font-size: 14px; vertical-align: top;">Full name</td><td style="padding: 13px 16px 13px 0; border-bottom: 1px solid #E8EDF3; color: #172B4D; font-size: 15px; font-weight: 600; vertical-align: top;">${escapeHtml(data.fullName)}</td></tr>`,
    `<tr><td style="width: 138px; padding: 13px 12px 13px 16px; border-bottom: 1px solid #E8EDF3; color: #64748B; font-size: 14px; vertical-align: top;">Phone</td><td style="padding: 13px 16px 13px 0; border-bottom: 1px solid #E8EDF3; color: #172B4D; font-size: 15px; font-weight: 600; vertical-align: top;"><a href="tel:${escapeHtml(phoneLink)}" style="color: #174A7E; text-decoration: none;">${escapeHtml(formatPhoneNumber(data.phoneNumber))}</a></td></tr>`,
    ...(data.email?.trim() ? [`<tr><td style="width: 138px; padding: 13px 12px 13px 16px; border-bottom: 1px solid #E8EDF3; color: #64748B; font-size: 14px; vertical-align: top;">Email</td><td style="padding: 13px 16px 13px 0; border-bottom: 1px solid #E8EDF3; color: #172B4D; font-size: 15px; vertical-align: top;"><a href="mailto:${escapeHtml(data.email.trim())}" style="color: #174A7E; text-decoration: none;">${escapeHtml(data.email.trim())}</a></td></tr>`] : []),
    `<tr><td style="width: 138px; padding: 13px 12px 13px 16px; ${data.message?.trim() ? "border-bottom: 1px solid #E8EDF3;" : ""} color: #64748B; font-size: 14px; vertical-align: top;">Requested service</td><td style="padding: 13px 16px 13px 0; ${data.message?.trim() ? "border-bottom: 1px solid #E8EDF3;" : ""} color: #172B4D; font-size: 15px; font-weight: 600; vertical-align: top;">${escapeHtml(serviceName)}</td></tr>`,
    ...(data.message?.trim() ? [`<tr><td style="width: 138px; padding: 13px 12px 13px 16px; color: #64748B; font-size: 14px; vertical-align: top;">Message</td><td style="padding: 13px 16px 13px 0; color: #172B4D; font-size: 14px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; vertical-align: top;">${escapeHtml(data.message.trim())}</td></tr>`] : []),
  ].join("");

  const content = `
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="height: 4px; background-color: #C5A880; font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>
      <tr>
        <td align="center" style="padding: 28px 28px 22px; background-color: #FFFFFF;">
          ${safeLogoUrl ? `<img src="${escapeHtml(safeLogoUrl)}" alt="${escapeHtml(siteName)}" width="170" style="display: block; width: auto; max-width: 170px; max-height: 58px; object-fit: contain; border: 0; margin: 0 auto 18px;">` : `<p style="margin: 0 0 16px; color: #174A7E; font-size: 13px; font-weight: 700; letter-spacing: 1.4px;">${escapeHtml(siteName)}</p>`}
          <h1 style="margin: 0; color: #102A4C; font-size: 23px; line-height: 1.3; font-weight: 600; letter-spacing: -0.3px;">New consultation request</h1>
          <p style="margin: 8px 0 0; color: #64748B; font-size: 14px; line-height: 1.5;">A new request was submitted through the website.</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 24px 28px 30px; background-color: #F8FAFC; border-top: 1px solid #E8EDF3;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 3px;">
            ${rows}
          </table>
          <p style="margin: 20px 0 0; color: #64748B; font-size: 12px; line-height: 1.5;">${escapeHtml(siteName)} · Website booking form</p>
        </td>
      </tr>
    </table>
  `;

  return wrapHTML(content, 4);
}

export function generateBookingNotificationSubject(data: BookingNotificationData): string {
  const serviceName =
    data.service === "Other" && data.otherService
      ? data.otherService
      : getServiceDisplayName(data.service);

  return `New Booking: ${data.fullName} - ${serviceName}`;
}

/**
 * Generate Promotion notification email HTML
 */
export function generatePromotionNotificationEmail(
  data: PromotionNotificationData,
): string {
  const content = `
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 40px 30px; text-align: center;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: rgba(255,255,255,0.15); border-radius: 12px; margin-bottom: 16px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
      </div>
      <h2 style="color: #FFFFFF; font-size: 22px; font-weight: 600; margin: 0 0 6px 0; letter-spacing: -0.5px;">New Promotion Claim</h2>
      <p style="color: #DBEAFE; font-size: 15px; margin: 0; font-weight: 400;">DR. MARIS AESTHETICS</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 30px 40px 30px;">
      
      <!-- Action Banner -->
      <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; padding: 14px 18px; border-radius: 10px; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p style="margin: 0; color: #1E40AF; font-weight: 500; font-size: 14px;">Action Required: Customer claimed a voucher. Please call them.</p>
      </div>

      <!-- Customer Information -->
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h2 style="font-size: 15px; font-weight: 600; color: #0F172A; margin: 0;">Customer Information</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          ${data.promotionName ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F8FAFC; width: 120px;">
              <span style="font-weight: 500; color: #64748B; font-size: 14px;">Promotion</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F8FAFC;">
              <span style="color: #0F172A; font-weight: 600; font-size: 15px;">${escapeHtml(data.promotionName)}</span>
            </td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 10px 0; ${data.promotionName ? '' : 'width: 120px;'}">
              <span style="font-weight: 500; color: #64748B; font-size: 14px;">Phone</span>
            </td>
            <td style="padding: 10px 0;">
              <a href="tel:${data.phoneNumber}" style="color: #2563EB; text-decoration: none; font-weight: 600; font-size: 15px;">
                ${formatPhoneNumber(data.phoneNumber)}
              </a>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;

  return wrapHTML(content);
}

export function generatePromotionNotificationSubject(data: PromotionNotificationData): string {
  const name = data.promotionName ? `[${data.promotionName}] ` : "";
  return `New VIP Voucher Claim - ${name}Phone: ${data.phoneNumber}`;
}
