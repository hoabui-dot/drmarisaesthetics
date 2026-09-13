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
  service: string;
  otherService?: string;
  message?: string;
}

export interface PromotionNotificationData {
  phoneNumber: string;
  promotionName?: string;
}

// Global wrapper to enforce system-ui font and background
const wrapHTML = (content: string) => `
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
        <table role="presentation" style="max-width: 540px; width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.04);">
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

  const content = `
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 40px 30px; text-align: center;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: rgba(255,255,255,0.15); border-radius: 12px; margin-bottom: 16px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      </div>
      <h2 style="color: #FFFFFF; font-size: 22px; font-weight: 600; margin: 0 0 6px 0; letter-spacing: -0.5px;">New Booking Submission</h2>
      <p style="color: #DBEAFE; font-size: 15px; margin: 0; font-weight: 400;">DR. MARIS AESTHETICS</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 30px 40px 30px;">
      
      <!-- Action Banner -->
      <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; padding: 14px 18px; border-radius: 10px; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p style="margin: 0; color: #1E40AF; font-weight: 500; font-size: 14px;">Action Required: Please respond to this customer within 24 hours.</p>
      </div>

      <!-- Customer Information -->
      <div style="margin-bottom: ${data.message ? '32px' : '0'};">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h2 style="font-size: 15px; font-weight: 600; color: #0F172A; margin: 0;">Customer Information</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F8FAFC; width: 120px;">
              <span style="font-weight: 500; color: #64748B; font-size: 14px;">Full Name</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F8FAFC;">
              <span style="color: #0F172A; font-weight: 600; font-size: 15px;">${escapeHtml(data.fullName)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F8FAFC;">
              <span style="font-weight: 500; color: #64748B; font-size: 14px;">Phone</span>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F8FAFC;">
              <a href="tel:${data.phoneNumber}" style="color: #2563EB; text-decoration: none; font-weight: 600; font-size: 15px;">
                ${formatPhoneNumber(data.phoneNumber)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <span style="font-weight: 500; color: #64748B; font-size: 14px;">Service</span>
            </td>
            <td style="padding: 10px 0;">
              <span style="color: #0F172A; font-weight: 600; font-size: 15px;">${escapeHtml(serviceName)}</span>
            </td>
          </tr>
        </table>
      </div>

      ${data.message ? `
      <!-- Message Section -->
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <h2 style="font-size: 15px; font-weight: 600; color: #0F172A; margin: 0;">Optional Note</h2>
        </div>
        <div style="background-color: #F8FAFC; border-left: 3px solid #3B82F6; padding: 18px 20px; border-radius: 12px;">
          <p style="color: #0F172A; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
      </div>
      ` : ""}
    </div>
  `;

  return wrapHTML(content);
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
