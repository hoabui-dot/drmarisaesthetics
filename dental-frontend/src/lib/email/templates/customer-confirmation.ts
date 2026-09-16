/**
 * Customer Confirmation Email Template
 *
 * Email sent to customers when their booking submission is received.
 */

import { emailStyles, wrapEmailContent } from "./styles";
import {
  formatPhoneNumber,
  formatDateTime,
  getServiceDisplayName,
  escapeHtml,
  generateTelLink,
  generateMailtoLink,
} from "./helpers";
import { getGoogleMapsUrl } from "../../utils/maps";
import { CLINIC_INFO } from "../../constants/contact";

export interface CustomerConfirmationData {
  fullName: string;
  phoneNumber: string;
  service: string;
  otherService?: string;
  message?: string;
  submittedAt: Date | string;
  bookingId?: number;
}

/**
 * Generate customer confirmation email HTML
 *
 * @param data - Booking submission data
 * @returns HTML email content
 */
export function generateCustomerConfirmationEmail(
  data: CustomerConfirmationData,
): string {
  const serviceName =
    data.service === "Other" && data.otherService
      ? data.otherService
      : getServiceDisplayName(data.service);

  const clinicAddress =
    CLINIC_INFO.address;
  const clinicPhone1 = CLINIC_INFO.phone1;
  const clinicPhone2 = CLINIC_INFO.phone2;
  const clinicEmail = CLINIC_INFO.email;

  const content = `
    <!-- Header -->
    <div style="${emailStyles.header}">
      <h2 style="${emailStyles.headerTitle}">
        ✅ Booking Received
      </h2>
      <p style="${emailStyles.headerSubtitle}">
        DR. MARIS AESTHETICS
      </p>
    </div>

    <!-- Body -->
    <div style="${emailStyles.body}">
      
      <!-- Welcome Message -->
      <div style="${emailStyles.section}">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">
          Dear <strong>${escapeHtml(data.fullName)}</strong>,
        </p>
        <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0;">
          Thank you for choosing <strong>DR. MARIS AESTHETICS</strong>.
          We have received your booking request and our team will review it shortly.
        </p>
      </div>

      <!-- Success Alert -->
      <div style="${emailStyles.alertSuccess}">
        <p style="margin: 0; color: #166534; font-weight: 600; font-size: 14px;">
          ✓ Your booking request has been successfully submitted!
        </p>
      </div>

      <!-- Booking Details Section -->
      <div style="${emailStyles.section}">
        <h2 style="${emailStyles.sectionTitle}">
          📋 Your Booking Details
        </h2>
        
        <table style="${emailStyles.table}">
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Service:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                <strong>${escapeHtml(serviceName)}</strong>
              </span>
            </td>
          </tr>
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Submitted:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                ${formatDateTime(data.submittedAt)}
              </span>
            </td>
          </tr>
          ${data.bookingId
      ? `
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Reference ID:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                #${data.bookingId}
              </span>
            </td>
          </tr>
          `
      : ""
    }
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Status:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="
                display: inline-block;
                padding: 4px 12px;
                background-color: #fef3c7;
                color: #92400e;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">
                Pending Confirmation
              </span>
            </td>
          </tr>
        </table>
      </div>

      <hr style="${emailStyles.divider}" />

      <!-- What Happens Next Section -->
      <div style="${emailStyles.section}">
        <h2 style="${emailStyles.sectionTitle}">
          ✨ What Happens Next?
        </h2>
        
        <table style="${emailStyles.table}">
          <tr>
            <td style="padding: 12px; vertical-align: top; width: 40px;">
              <span style="
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #dbeafe;
                color: #1e40af;
                border-radius: 50%;
                text-align: center;
                line-height: 32px;
                font-weight: 700;
                font-size: 14px;
              ">1</span>
            </td>
            <td style="padding: 12px;">
              <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
                <strong>Review</strong><br/>
                Our team will review your booking request and check availability.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; vertical-align: top; width: 40px;">
              <span style="
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #dbeafe;
                color: #1e40af;
                border-radius: 50%;
                text-align: center;
                line-height: 32px;
                font-weight: 700;
                font-size: 14px;
              ">2</span>
            </td>
            <td style="padding: 12px;">
              <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
                <strong>Contact</strong><br/>
                We'll contact you within <strong>24 hours</strong> via phone or email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; vertical-align: top; width: 40px;">
              <span style="
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #dbeafe;
                color: #1e40af;
                border-radius: 50%;
                text-align: center;
                line-height: 32px;
                font-weight: 700;
                font-size: 14px;
              ">3</span>
            </td>
            <td style="padding: 12px;">
              <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
                <strong>Schedule</strong><br/>
                We'll work with you to find the best appointment time.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; vertical-align: top; width: 40px;">
              <span style="
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #dbeafe;
                color: #1e40af;
                border-radius: 50%;
                text-align: center;
                line-height: 32px;
                font-weight: 700;
                font-size: 14px;
              ">4</span>
            </td>
            <td style="padding: 12px;">
              <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
                <strong>Confirmation</strong><br/>
                You'll receive a confirmation with your appointment details.
              </p>
            </td>
          </tr>
        </table>
      </div>

      <hr style="${emailStyles.divider}" />

      <!-- Contact Information Section -->
      <div style="${emailStyles.section}">
        <h2 style="${emailStyles.sectionTitle}">
          📞 Contact Us
        </h2>
        
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Phone:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                <a href="${generateTelLink(clinicPhone1)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
                  ${formatPhoneNumber(clinicPhone1)}
                </a>
                <br/>
                <a href="${generateTelLink(clinicPhone2)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
                  ${formatPhoneNumber(clinicPhone2)}
                </a>
              </span>
            </td>
          </tr>
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Email:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                <a href="${generateMailtoLink()}" style="color: #2563eb; text-decoration: none;">
                  ${clinicEmail}
                </a>
              </span>
            </td>
          </tr>
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Address:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                ${clinicAddress}
              </span>
            </td>
          </tr>
          <tr>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoLabel}">Hours:</span>
            </td>
            <td style="${emailStyles.tableCell}">
              <span style="${emailStyles.infoValue}">
                ${CLINIC_INFO.days}, ${CLINIC_INFO.hours}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Buttons -->
      <div style="${emailStyles.buttonContainer}">
        <a href="${CLINIC_INFO.website}" style="${emailStyles.button}">
          🌐 Visit Website
        </a>
        <a href="${generateTelLink(clinicPhone1)}" style="${emailStyles.button}">
          📞 Call Us
        </a>
        <a href="${getGoogleMapsUrl()}" style="${emailStyles.buttonSecondary}">
          📍 Get Directions
        </a>
      </div>

      <!-- Additional Info -->
      <div style="${emailStyles.alertInfo}">
        <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
          <strong>Need immediate assistance?</strong><br/>
          Call us directly at <a href="${generateTelLink(clinicPhone1)}" style="color: #1e40af; font-weight: 600;">${formatPhoneNumber(clinicPhone1)}</a> 
          or <a href="${generateTelLink(clinicPhone2)}" style="color: #1e40af; font-weight: 600;">${formatPhoneNumber(clinicPhone2)}</a>
          during business hours.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="${emailStyles.footer}">
      <p style="${emailStyles.footerText}">
        <strong>DR. MARIS AESTHETICS</strong><br/>
        ${clinicAddress}<br/>
        Hotlines: <a href="${generateTelLink(clinicPhone1)}" style="${emailStyles.footerLink}">${formatPhoneNumber(clinicPhone1)}</a> | 
        <a href="${generateTelLink(clinicPhone2)}" style="${emailStyles.footerLink}">${formatPhoneNumber(clinicPhone2)}</a><br/>
        Email: <a href="${generateMailtoLink()}" style="${emailStyles.footerLink}">${clinicEmail}</a>
      </p>
      <p style="${emailStyles.footerText}">
        We look forward to serving you!
      </p>
      <p style="${emailStyles.footerText}; font-size: 11px; color: #94a3b8;">
        This is an automated confirmation email. Please do not reply to this email.<br/>
        If you did not make this booking request, please contact us immediately.
      </p>
    </div>
  `;

  return wrapEmailContent(content);
}

/**
 * Generate customer confirmation email subject
 *
 * @param data - Booking submission data
 * @returns Email subject
 */
export function generateCustomerConfirmationSubject(
  _data: CustomerConfirmationData,
): string {
  return "✅ Consultation Case Received - DR. MARIS AESTHETICS";
}
