import { sendContactEmail, sendAutoReply } from '../services/mailer.js';
import { logInfo, logError } from '../utils/logger.js';

/**
 * Handle contact form submission
 */
export const handleContactSubmission = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    logInfo('Processing contact form submission', {
      senderEmail: email,
      subject: subject,
      ip: req.ip
    });

    // Send main contact email
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    if (!emailResult.success) {
      logError('Failed to send contact email', null, {
        senderEmail: email,
        error: emailResult.error
      });

      return res.status(500).json({
        error: 'Failed to send message',
        message: 'Please try again later or contact directly via email'
      });
    }

    // Send auto-reply (non-blocking - don't fail the request if this fails)
    sendAutoReply({ name, email, subject }).catch(error => {
      logError('Failed to send auto-reply', error, {
        senderEmail: email
      });
    });

    logInfo('Contact form processed successfully', {
      senderEmail: email,
      messageId: emailResult.messageId
    });

    res.status(200).json({
      success: true,
      message: 'Messaggio inviato con successo! Ti risponderò al più presto.',
      messageId: emailResult.messageId
    });

  } catch (error) {
    logError('Contact form submission error', error, {
      senderEmail: req.body?.email,
      ip: req.ip
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Si è verificato un errore. Riprova più tardi.'
    });
  }
};

/**
 * Get contact form statistics (optional endpoint for admin)
 */
export const getContactStats = async (req, res) => {
  try {
    // This could be enhanced to return actual statistics from a database
    const stats = {
      endpoint: '/api/contact',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      rateLimits: {
        perMinute: 3,
        windowMinutes: 10
      }
    };

    res.status(200).json(stats);

  } catch (error) {
    logError('Error getting contact stats', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to retrieve contact statistics'
    });
  }
};