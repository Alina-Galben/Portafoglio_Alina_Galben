import { Resend } from 'resend';
import { logInfo, logError } from '../utils/logger.js';

const generateHtml = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; }
    .header { background: #3b82f6; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; padding: 10px; background: #fff; border-left: 4px solid #3b82f6; }
    .label { font-weight: 600; color: #1e40af; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header"><h1>${title}</h1></div>
  <div class="content">${content}</div>
  <div class="footer">Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}</div>
</body>
</html>`;

const getMailer = () => {
  const { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO } = process.env;
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  
  return {
    client: new Resend(RESEND_API_KEY),
    from: EMAIL_FROM || 'portfolio@alinadev.com',
    to: EMAIL_TO || 'alina@alinadev.com'
  };
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  if (!name || !email || !subject || !message) throw new Error('Invalid contact payload');

  try {
    const { client, from, to } = getMailer();

    const { data, error } = await client.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: generateHtml('Nuovo Messaggio', `
        <div class="field"><div class="label">Nome</div><div>${name}</div></div>
        <div class="field"><div class="label">Email</div><div>${email}</div></div>
        <div class="field"><div class="label">Oggetto</div><div>${subject}</div></div>
        <div class="field"><div class="label">Messaggio</div><div style="white-space: pre-wrap">${message}</div></div>
      `)
    });

    if (error) throw new Error(error.message);

    logInfo('Email dispatched', { id: data?.id, recipient: to });
    return { success: true, messageId: data?.id };

  } catch (err) {
    logError('Email delivery failed', err, { sender: email });
    return { success: false, error: err.message };
  }
};

export const sendAutoReply = async ({ name, email, subject }) => {
  try {
    const { client, from } = getMailer();

    const { data, error } = await client.emails.send({
      from,
      to: email,
      subject: 'Messaggio Ricevuto - Alina Galben',
      html: generateHtml(`Grazie ${name}!`, `
        <p>Ho ricevuto il tuo messaggio: <strong>${subject}</strong>.</p>
        <p>Ti risponderò entro 24-48 ore.</p>
        <p><em>Alina Galben</em></p>
      `)
    });

    if (error) throw new Error(error.message);

    logInfo('Auto-reply sent', { id: data?.id, recipient: email });
    return { success: true, messageId: data?.id };

  } catch (err) {
    logError('Auto-reply failed', err, { recipient: email });
    return { success: false, error: err.message };
  }
};