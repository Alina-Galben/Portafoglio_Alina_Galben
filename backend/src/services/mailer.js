import { Resend } from 'resend';
import { logInfo, logError } from '../utils/logger.js';

// Initialize Resend instance
let resend = null;

const getResendClient = () => {
  if (!resend) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
};

/**
 * Send contact form email using Resend
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} - Success/error response
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error('Missing required contact form fields');
    }

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuovo messaggio dal portfolio</title>
          <style>
            body {
              font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f8fafc;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background: white;
              border-radius: 6px;
              border-left: 4px solid #3b82f6;
            }
            .field-label {
              font-weight: 600;
              color: #1e40af;
              margin-bottom: 5px;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            .field-value {
              color: #374151;
              font-size: 14px;
            }
            .message-content {
              background: white;
              padding: 20px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.6;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Nuovo Messaggio</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Portfolio Alina Galben</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="field-label">Nome</div>
              <div class="field-value">${name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${email}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Oggetto</div>
              <div class="field-value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Messaggio</div>
              <div class="message-content">${message}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Messaggio ricevuto tramite il form contatti del portfolio</p>
            <p>Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}</p>
          </div>
        </body>
      </html>
    `;

    // Send email
    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'portfolio@alinadev.com',
      to: process.env.EMAIL_TO || 'alina@example.com',
      replyTo: email,
      subject: `Portfolio: ${subject}`,
      html: htmlContent,
      text: `
Nuovo messaggio dal portfolio

Nome: ${name}
Email: ${email}
Oggetto: ${subject}

Messaggio:
${message}

---
Ricevuto il ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
      `.trim()
    });

    logInfo('Contact email sent successfully', {
      messageId: result.data?.id,
      recipient: process.env.EMAIL_TO,
      sender: email,
      subject: subject
    });

    return {
      success: true,
      messageId: result.data?.id
    };

  } catch (error) {
    logError('Failed to send contact email', error, {
      sender: email,
      subject: subject
    });

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send auto-reply email to the contact form sender
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} - Success/error response
 */
export const sendAutoReply = async ({ name, email, subject }) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Grazie per il tuo messaggio</title>
          <style>
            body {
              font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 8px;
              text-align: center;
            }
            .content {
              padding: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Grazie ${name}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Il tuo messaggio è stato ricevuto</p>
          </div>
          
          <div class="content">
            <p>Ciao ${name},</p>
            <p>Grazie per avermi contattato tramite il mio portfolio. Ho ricevuto il tuo messaggio riguardo "<strong>${subject}</strong>" e ti risponderò al più presto.</p>
            <p>Ti ricontatterò entro 24-48 ore all'indirizzo ${email}.</p>
            <p>A presto!</p>
            <p><strong>Alina Galben</strong><br>Full-Stack Web Developer</p>
          </div>
        </body>
      </html>
    `;

    const resendClient = getResendClient();
    const result = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'portfolio@alinadev.com',
      to: email,
      subject: 'Grazie per il tuo messaggio - Alina Galben',
      html: htmlContent,
      text: `
Ciao ${name},

Grazie per avermi contattato tramite il mio portfolio. Ho ricevuto il tuo messaggio riguardo "${subject}" e ti risponderò al più presto.

Ti ricontatterò entro 24-48 ore all'indirizzo ${email}.

A presto!

Alina Galben
Full-Stack Web Developer
      `.trim()
    });

    logInfo('Auto-reply sent successfully', {
      messageId: result.data?.id,
      recipient: email
    });

    return {
      success: true,
      messageId: result.data?.id
    };

  } catch (error) {
    logError('Failed to send auto-reply', error, { recipient: email });
    
    return {
      success: false,
      error: error.message
    };
  }
};