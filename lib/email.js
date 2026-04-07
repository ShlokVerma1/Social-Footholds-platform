// server-only — never import this in client components
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = 'onboarding@resend.dev';
// When domain is verified, swap to: 'team@socialfootholds.com'

const baseStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0f0f1a;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #0f0f1a;
      padding: 40px 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #13131f;
      border-radius: 16px;
      border: 1px solid rgba(168, 85, 247, 0.2);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
      border-bottom: 1px solid rgba(168, 85, 247, 0.3);
      padding: 32px 40px;
      text-align: center;
    }
    .logo {
      font-size: 22px;
      font-weight: 700;
      color: #a855f7;
      letter-spacing: -0.5px;
    }
    .logo span {
      color: #e2e8f0;
    }
    .logo-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #a855f7;
      border-radius: 50%;
      margin-left: 4px;
      vertical-align: middle;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    .body-text {
      font-size: 15px;
      color: #94a3b8;
      line-height: 1.7;
      margin-bottom: 12px;
    }
    .divider {
      height: 1px;
      background: rgba(168, 85, 247, 0.15);
      margin: 28px 0;
    }
    .info-card {
      background: rgba(168, 85, 247, 0.06);
      border: 1px solid rgba(168, 85, 247, 0.15);
      border-radius: 10px;
      padding: 20px 24px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(168, 85, 247, 0.08);
    }
    .info-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .info-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 14px;
      color: #e2e8f0;
      font-weight: 600;
    }
    .amount-value {
      font-size: 18px;
      color: #a855f7;
      font-weight: 700;
    }
    .badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-purple {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    .badge-green {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.25);
    }
    .badge-yellow {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
      border: 1px solid rgba(234, 179, 8, 0.25);
    }
    .badge-blue {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.25);
    }
    .client-note {
      background: rgba(168, 85, 247, 0.08);
      border-left: 3px solid #a855f7;
      border-radius: 0 8px 8px 0;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .client-note-label {
      font-size: 11px;
      color: #a855f7;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .client-note-text {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .notice-box {
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      border-radius: 10px;
      padding: 16px 20px;
      margin: 20px 0;
      text-align: center;
    }
    .notice-text {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .notice-text strong {
      color: #a855f7;
    }
    .footer {
      background: #0a0a12;
      border-top: 1px solid rgba(168, 85, 247, 0.1);
      padding: 28px 40px;
      text-align: center;
    }
    .footer-brand {
      font-size: 14px;
      font-weight: 600;
      color: #a855f7;
      margin-bottom: 8px;
    }
    .footer-text {
      font-size: 12px;
      color: #475569;
      line-height: 1.6;
    }
    .footer-link {
      color: #a855f7;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      .footer { padding: 20px; }
      .greeting { font-size: 20px; }
      .info-row { flex-direction: column; align-items: flex-start; gap: 4px; }
    }
  </style>
`;

function getStatusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('complet') || s.includes('done') || s.includes('delivered')) return 'badge-green';
  if (s.includes('progress') || s.includes('active') || s.includes('running')) return 'badge-blue';
  if (s.includes('review') || s.includes('pending') || s.includes('wait')) return 'badge-yellow';
  return 'badge-purple';
}

function buildEmailShell(headerTagline, bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Footholds</title>
  ${baseStyles}
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">Social<span>Footholds</span><span class="logo-dot"></span></div>
        ${headerTagline ? `<p style="font-size:13px;color:#64748b;margin-top:8px;letter-spacing:0.5px;">${headerTagline}</p>` : ''}
      </div>
      <div class="content">
        ${bodyContent}
      </div>
      <div class="footer">
        <div class="footer-brand">Social Footholds</div>
        <p class="footer-text">
          You received this email because you have an active campaign with us.<br />
          Questions? Reach us at <a href="mailto:team@socialfootholds.com" class="footer-link">team@socialfootholds.com</a>
        </p>
        <p class="footer-text" style="margin-top:12px;color:#334155;">
          &copy; ${new Date().getFullYear()} Social Footholds. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * sendOrderConfirmation
 * Sends a confirmation email when a new order/campaign is placed by the user.
 */
export async function sendOrderConfirmation(to, creatorName, orderId, serviceName, amount) {
  try {
    const shortId = String(orderId).slice(0, 8);

    const html = buildEmailShell('Campaign Confirmation', `
      <p class="greeting">Hi ${creatorName} 👋</p>
      <p class="body-text">
        Great news — your campaign for <strong style="color:#e2e8f0;">${serviceName}</strong> has been successfully received by our team.
        We'll review the details and get everything started within the next <strong style="color:#a855f7;">24 hours</strong>.
      </p>

      <div class="divider"></div>

      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Service</span>
          <span class="info-value">${serviceName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order ID</span>
          <span class="info-value">#${shortId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Amount</span>
          <span class="info-value amount-value">$${amount}</span>
        </div>
      </div>

      <div class="notice-box">
        <p class="notice-text">
          ⏱ Our team will review your campaign and begin execution within <strong>24 hours</strong>.<br />
          You'll receive a status update as soon as we start.
        </p>
      </div>

      <div class="divider"></div>

      <p class="body-text">
        If you have any questions or need to make changes, don't hesitate to reach out to us directly.
        We're here to make your campaign a success.
      </p>
      <p class="body-text" style="margin-top:20px;">
        Warm regards,<br />
        <strong style="color:#a855f7;">The Social Footholds Team</strong>
      </p>
    `);

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject: 'Your Campaign Has Been Received — Social Footholds',
      html,
    });

    if (error) {
      console.error('[email] sendOrderConfirmation error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[email] sendOrderConfirmation exception:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * sendStatusUpdate
 * Sends an update email when an order's status/milestone changes.
 */
export async function sendStatusUpdate(to, creatorName, orderId, serviceName, newStatus, milestoneName, clientNote) {
  try {
    const shortId = String(orderId).slice(0, 8);
    const badgeClass = getStatusBadgeClass(newStatus);

    const noteBlock = clientNote
      ? `
        <div class="client-note">
          <div class="client-note-label">💬 Message from our team</div>
          <p class="client-note-text">${clientNote}</p>
        </div>
      `
      : '';

    const html = buildEmailShell('Campaign Status Update', `
      <p class="greeting">Hi ${creatorName},</p>
      <p class="body-text">
        We have an update on your campaign for <strong style="color:#e2e8f0;">${serviceName}</strong>.
        Here's a summary of where things stand right now:
      </p>

      <div class="divider"></div>

      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Service</span>
          <span class="info-value">${serviceName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">New Status</span>
          <span class="info-value">
            <span class="badge ${badgeClass}">${newStatus}</span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Current Stage</span>
          <span class="info-value">${milestoneName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order ID</span>
          <span class="info-value">#${shortId}</span>
        </div>
      </div>

      ${noteBlock}

      <div class="divider"></div>

      <p class="body-text">
        We'll keep you posted as your campaign progresses. If you have any questions,
        feel free to reach out anytime.
      </p>
      <p class="body-text" style="margin-top:20px;">
        Best regards,<br />
        <strong style="color:#a855f7;">The Social Footholds Team</strong>
      </p>
    `);

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject: `Campaign Update — ${serviceName} | Social Footholds`,
      html,
    });

    if (error) {
      console.error('[email] sendStatusUpdate error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[email] sendStatusUpdate exception:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * sendAdminOrderCreated
 * Sends a notification email when an admin creates an order on behalf of a creator.
 */
export async function sendAdminOrderCreated(to, creatorName, orderId, serviceName, amount, adminNote) {
  try {
    const shortId = String(orderId).slice(0, 8);

    const noteBlock = adminNote
      ? `
        <div class="client-note">
          <div class="client-note-label">📋 Note from our team</div>
          <p class="client-note-text">${adminNote}</p>
        </div>
      `
      : '';

    const html = buildEmailShell('New Campaign Created For You', `
      <p class="greeting">Hi ${creatorName},</p>
      <p class="body-text">
        Our team has created a new campaign on your behalf. Here are the details of your new campaign:
      </p>

      <div class="divider"></div>

      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Service</span>
          <span class="info-value">${serviceName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Amount</span>
          <span class="info-value amount-value">$${amount}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order ID</span>
          <span class="info-value">#${shortId}</span>
        </div>
      </div>

      ${noteBlock}

      <div class="notice-box">
        <p class="notice-text">
          🚀 Your campaign is now active and our team has already begun the execution process.<br />
          You'll receive updates as your campaign progresses.
        </p>
      </div>

      <div class="divider"></div>

      <p class="body-text">
        If you have any questions about this campaign or would like to discuss anything further,
        please don't hesitate to get in touch with us.
      </p>
      <p class="body-text" style="margin-top:20px;">
        Warm regards,<br />
        <strong style="color:#a855f7;">The Social Footholds Team</strong>
      </p>
    `);

    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject: `New Campaign Started — ${serviceName} | Social Footholds`,
      html,
    });

    if (error) {
      console.error('[email] sendAdminOrderCreated error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[email] sendAdminOrderCreated exception:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}
