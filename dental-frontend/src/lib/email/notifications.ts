/**
 * Email Notification Functions
 *
 * High-level functions for sending booking-related email notifications.
 */

import { sendEmail, type EmailOptions } from "./email-service";
import {
  generateBookingNotificationEmail,
  generateBookingNotificationSubject,
  generatePromotionNotificationEmail,
  generatePromotionNotificationSubject,
  type BookingNotificationData,
  type PromotionNotificationData,
} from "./templates/staff-notification";

// Email addresses from environment
const EMAIL_TO_ADMIN = process.env.EMAIL_TO_ADMIN || "";
const EMAIL_TO_STAFF = process.env.EMAIL_TO_STAFF || "";

/**
 * Send booking notification email
 *
 * Notifies clinic staff of a new booking submission.
 *
 * @param data - Booking submission data
 * @returns Promise<boolean> - true if email sent successfully
 */
export async function sendBookingNotifications(
  data: BookingNotificationData,
): Promise<boolean> {
  try {
    // Generate email content
    const subject = generateBookingNotificationSubject(data);
    const html = generateBookingNotificationEmail(data);

    // Determine recipients
    const recipients: string[] = [];
    if (EMAIL_TO_ADMIN) recipients.push(EMAIL_TO_ADMIN);
    if (EMAIL_TO_STAFF && EMAIL_TO_STAFF !== EMAIL_TO_ADMIN) {
      recipients.push(EMAIL_TO_STAFF);
    }

    if (recipients.length === 0) {
      console.warn(
        "[Notifications] No staff email addresses configured (EMAIL_TO_ADMIN, EMAIL_TO_STAFF)",
      );
      return false;
    }

    // Send email
    const emailOptions: EmailOptions = {
      to: recipients,
      subject,
      html,
    };

    const result = await sendEmail(emailOptions);

    if (result.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Send promotion notification email
 *
 * Notifies clinic staff of a new promotion claim.
 *
 * @param data - Promotion submission data
 * @returns Promise<boolean> - true if email sent successfully
 */
export async function sendPromotionNotification(
  data: PromotionNotificationData,
): Promise<boolean> {
  try {
    // Generate email content
    const subject = generatePromotionNotificationSubject(data);
    const html = generatePromotionNotificationEmail(data);

    // Determine recipients
    const recipients: string[] = [];
    if (EMAIL_TO_ADMIN) recipients.push(EMAIL_TO_ADMIN);
    if (EMAIL_TO_STAFF && EMAIL_TO_STAFF !== EMAIL_TO_ADMIN) {
      recipients.push(EMAIL_TO_STAFF);
    }

    if (recipients.length === 0) {
      console.warn(
        "[Notifications] No staff email addresses configured (EMAIL_TO_ADMIN, EMAIL_TO_STAFF)",
      );
      return false;
    }

    // Send email
    const emailOptions: EmailOptions = {
      to: recipients,
      subject,
      html,
    };

    const result = await sendEmail(emailOptions);

    if (result.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Send test email
 *
 * Utility function for testing email configuration.
 *
 * @param to - Recipient email address
 * @returns Promise<boolean>
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  try {
    const emailOptions: EmailOptions = {
      to,
      subject: "Test Email - DR. MARIS AESTHETICS",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Email Configuration Test</h2>
          <p>This is a test email from DR. MARIS AESTHETICS.</p>
          <p>If you received this email, your email configuration is working correctly!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="color: #64748b; font-size: 13px;">
            Sent at: ${new Date().toISOString()}<br/>
            From: DR. MARIS AESTHETICS Email System
          </p>
        </div>
      `,
    };

    const result = await sendEmail(emailOptions);

    if (result.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
