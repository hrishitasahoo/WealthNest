const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_FROM_ADDRESS;
  const senderName = process.env.EMAIL_FROM_NAME || 'WealthNest';

  if (!apiKey || !senderEmail) {
    console.log('[mailer] Email is not configured, so the reset link is being printed here instead:');
    console.log(`[mailer]   To:   ${toEmail}`);
    console.log(`[mailer]   Link: ${resetUrl}`);
    console.log('[mailer] Set BREVO_API_KEY and EMAIL_FROM_ADDRESS in .env to send real emails.');
    return { delivered: false, viaConsole: true };
  }

  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: toEmail }],
    subject: 'Reset your WealthNest password',
    htmlContent: `
      <p>We received a request to reset your WealthNest password.</p>
      <p><a href="${resetUrl}">Click here to set a new password</a> (this link is valid for 1 hour).</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
    textContent: `We received a request to reset your WealthNest password.\n\nClick the link below to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`
  };

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Brevo API responded with ${res.status}: ${errText}`);
    }

    return { delivered: true, viaConsole: false };
  } catch (err) {
    console.error('[mailer] Failed to send email, falling back to console log:', err.message);
    console.log(`[mailer]   To:   ${toEmail}`);
    console.log(`[mailer]   Link: ${resetUrl}`);
    return { delivered: false, viaConsole: true };
  }
}

module.exports = { sendPasswordResetEmail };
