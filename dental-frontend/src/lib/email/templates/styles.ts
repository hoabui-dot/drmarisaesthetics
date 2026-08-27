/**
 * Email CSS Styles
 *
 * Inline CSS styles for email templates.
 * Email clients don't support modern CSS, so we use inline styles and tables.
 */

export const emailStyles = {
  // Container styles
  container: `
    max-width: 600px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
  `,

  // Header styles
  header: `
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    padding: 40px 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  `,

  headerTitle: `
    color: #ffffff;
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
  `,

  headerSubtitle: `
    color: #dbeafe;
    font-size: 16px;
    margin: 0;
    font-weight: 400;
  `,

  // Body styles
  body: `
    background-color: #ffffff;
    padding: 40px 30px;
  `,

  // Section styles
  section: `
    margin-bottom: 30px;
  `,

  sectionTitle: `
    font-size: 14px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 15px 0;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
  `,

  // Info row styles
  infoRow: `
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  `,

  infoLabel: `
    font-weight: 600;
    color: #475569;
    min-width: 100px;
    font-size: 14px;
  `,

  infoValue: `
    color: #1e293b;
    font-size: 14px;
    word-break: break-word;
  `,

  // Message box styles
  messageBox: `
    background-color: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 20px 0;
  `,

  messageText: `
    color: #334155;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  `,

  // Button styles
  buttonContainer: `
    text-align: center;
    margin: 30px 0;
  `,

  button: `
    display: inline-block;
    padding: 14px 32px;
    background-color: #2563eb;
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    margin: 0 8px;
    transition: background-color 0.2s;
  `,

  buttonSecondary: `
    display: inline-block;
    padding: 14px 32px;
    background-color: #ffffff;
    color: #2563eb !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    margin: 0 8px;
    border: 2px solid #2563eb;
  `,

  // Footer styles
  footer: `
    background-color: #f8fafc;
    padding: 30px;
    text-align: center;
    border-radius: 0 0 8px 8px;
    border-top: 1px solid #e2e8f0;
  `,

  footerText: `
    color: #64748b;
    font-size: 13px;
    line-height: 1.6;
    margin: 8px 0;
  `,

  footerLink: `
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  `,

  // Divider
  divider: `
    height: 1px;
    background-color: #e2e8f0;
    margin: 30px 0;
    border: none;
  `,

  // Alert box styles
  alertSuccess: `
    background-color: #f0fdf4;
    border-left: 4px solid #22c55e;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 20px 0;
  `,

  alertInfo: `
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 20px 0;
  `,

  alertWarning: `
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 20px 0;
  `,

  // Badge styles
  badge: `
    display: inline-block;
    padding: 4px 12px;
    background-color: #dbeafe;
    color: #1e40af;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,

  badgeSuccess: `
    display: inline-block;
    padding: 4px 12px;
    background-color: #dcfce7;
    color: #166534;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,

  // Table styles (for email client compatibility)
  table: `
    width: 100%;
    border-collapse: collapse;
  `,

  tableCell: `
    padding: 12px;
    border-bottom: 1px solid #f1f5f9;
  `,
};

/**
 * Generate complete email wrapper HTML
 */
export function wrapEmailContent(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Saigon International Dental Clinic</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="${emailStyles.container}; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
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
}
