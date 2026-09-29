import { escapeHtml, formatPhoneNumber, getServiceDisplayName } from "./helpers";

export type SubmissionType = "booking" | "promotion" | "newsletter";

export interface BookingNotificationData {
  fullName?: string;
  phoneNumber?: string;
  country?: string;
  email?: string;
  service?: string;
  serviceLabel?: string;
  otherService?: string;
  message?: string;
  submissionType?: SubmissionType;
  submissionSource?: string;
  siteName?: string;
  logoUrl?: string;
}

export interface PromotionNotificationData {
  phoneNumber: string;
  promotionName?: string;
  country?: string;
}

const wrapHTML = (content: string) => `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>DR. MARIS AESTHETICS</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,Helvetica,sans-serif;color:#172B4D;-webkit-font-smoothing:antialiased;"><table role="presentation" style="width:100%;border-collapse:collapse;background:#F8FAFC;"><tr><td align="center" style="padding:32px 16px;"><table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:4px;overflow:hidden;"><tr><td>${content}</td></tr></table></td></tr></table></body></html>`.trim();

function row(label: string, value: string, options: { link?: string; multiline?: boolean } = {}) {
  const content = options.link
    ? `<a href="${escapeHtml(options.link)}" style="color:#174A7E;text-decoration:none;">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  const style = options.multiline ? "white-space:pre-wrap;overflow-wrap:anywhere;font-weight:400;" : "";
  return `<tr><td style="width:138px;padding:12px 12px 12px 16px;border-bottom:1px solid #E8EDF3;color:#64748B;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:12px 16px 12px 0;border-bottom:1px solid #E8EDF3;color:#172B4D;font-size:15px;line-height:1.5;font-weight:600;vertical-align:top;${style}">${content}</td></tr>`;
}

function serviceName(data: BookingNotificationData) {
  if (data.service === "Other" && data.otherService?.trim()) return data.otherService.trim();
  return data.serviceLabel?.trim() || (data.service ? getServiceDisplayName(data.service) : "");
}

export function generateBookingNotificationEmail(data: BookingNotificationData): string {
  const type = data.submissionType || "booking";
  const siteName = data.siteName || "DR. MARIS AESTHETICS";
  const logoUrl = data.logoUrl && /^https?:\/\//i.test(data.logoUrl) ? data.logoUrl : undefined;
  const title = type === "promotion" ? "New promotion claim" : type === "newsletter" ? "New newsletter signup" : "New consultation request";
  const description = type === "promotion" ? "A promotion claim was submitted through the website." : type === "newsletter" ? "A new email joined the website newsletter." : "A new request was submitted through the website.";
  const rows = [
    data.fullName?.trim() ? row("Full name", data.fullName.trim()) : "",
    data.phoneNumber?.trim() ? row("Phone", formatPhoneNumber(data.phoneNumber.trim()), { link: `tel:${data.phoneNumber.replace(/[^\d+]/g, "")}` }) : "",
    data.country?.trim() ? row("Country", data.country.trim()) : "",
    data.email?.trim() ? row("Email", data.email.trim(), { link: `mailto:${data.email.trim()}` }) : "",
    serviceName(data) ? row("Requested service", serviceName(data)) : "",
    data.message?.trim() ? row("Note", data.message.trim(), { multiline: true }) : "",
  ].filter(Boolean).join("");
  const safeRows = rows || row("Submission type", type);
  const content = `<table role="presentation" style="width:100%;border-collapse:collapse;"><tr><td style="height:4px;background:#C5A880;font-size:0;line-height:0;">&nbsp;</td></tr><tr><td align="center" style="padding:26px 28px 20px;background:#FFFFFF;">${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(siteName)}" width="170" style="display:block;width:auto;max-width:170px;max-height:58px;object-fit:contain;border:0;margin:0 auto 16px;">` : `<p style="margin:0 0 14px;color:#174A7E;font-size:13px;font-weight:700;letter-spacing:1.4px;">${escapeHtml(siteName)}</p>`}<h1 style="margin:0;color:#102A4C;font-size:23px;line-height:1.3;font-weight:600;">${escapeHtml(title)}</h1><p style="margin:8px 0 0;color:#64748B;font-size:14px;line-height:1.5;">${escapeHtml(description)}</p></td></tr><tr><td style="padding:22px 28px 28px;background:#F8FAFC;border-top:1px solid #E8EDF3;"><table role="presentation" style="width:100%;border-collapse:collapse;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:3px;">${safeRows}</table><p style="margin:18px 0 0;color:#64748B;font-size:12px;line-height:1.5;">${escapeHtml(siteName)} · Website form submission</p></td></tr></table>`;
  return wrapHTML(content);
}

export function generateBookingNotificationSubject(data: BookingNotificationData): string {
  const type = data.submissionType || "booking";
  const prefix = type === "promotion" ? "New Promotion Claim" : type === "newsletter" ? "New Newsletter Signup" : "New Booking";
  const identity = data.fullName?.trim() || data.email?.trim() || data.phoneNumber?.trim() || "Website form";
  const service = serviceName(data);
  return `${prefix}: ${identity}${service ? ` - ${service}` : ""}`;
}

export function generatePromotionNotificationEmail(data: PromotionNotificationData): string {
  return generateBookingNotificationEmail({ phoneNumber: data.phoneNumber, country: data.country, message: data.promotionName ? `Claim Your Offer: ${data.promotionName}` : "Claim Your Offer", submissionType: "promotion" });
}

export function generatePromotionNotificationSubject(data: PromotionNotificationData): string {
  return generateBookingNotificationSubject({ phoneNumber: data.phoneNumber, message: data.promotionName ? `Claim Your Offer: ${data.promotionName}` : "Claim Your Offer", submissionType: "promotion" });
}
