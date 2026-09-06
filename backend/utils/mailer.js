const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD }
  });
  return transporter;
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const t = getTransporter();

  if (!t) {
    console.log('[mailer] Email is not configured, so the reset link is being printed here instead:');
    console.log(`[mailer]   To:   ${toEmail}`);
    console.log(`[mailer]   Link: ${resetUrl}`);
    console.log('[mailer] Set EMAIL_HOST, EMAIL_USER and EMAIL_PASSWORD in .env to send real emails.');
    return { delivered: false, viaConsole: true };
  }

  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || `"WealthNest" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset your WealthNest password',
      text: `We received a request to reset your WealthNest password.\n\nClick the link below to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
      html: `
        <p>We received a request to reset your WealthNest password.</p>
        <p><a href="${resetUrl}">Click here to set a new password</a> (this link is valid for 1 hour).</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `
    });
    return { delivered: true, viaConsole: false };
  } catch (err) {
    console.error('[mailer] Failed to send email, falling back to console log:', err.message);
    console.log(`[mailer]   To:   ${toEmail}`);
    console.log(`[mailer]   Link: ${resetUrl}`);
    return { delivered: false, viaConsole: true };
  }
}

module.exports = { sendPasswordResetEmail };
