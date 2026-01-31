import { sendContactEmail, sendAutoReply } from '../services/mailer.js';
import { logInfo, logError } from '../utils/logger.js';

export const handleContactSubmission = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const { ip } = req;

  logInfo('Inbound contact request', { email, subject, ip });

  try {
    const { success, error, messageId } = await sendContactEmail({ name, email, subject, message });

    if (!success) {
      logError('Primary email delivery failed', null, { email, error });
      return res.status(502).json({
        error: 'Delivery Failure',
        message: 'Impossible to send message at this time. Please contact directly via email.'
      });
    }

    sendAutoReply({ name, email, subject })
      .catch(err => logError('Auto-reply dispatch error', err, { email }));

    logInfo('Contact flow finalized', { email, messageId });

    res.status(200).json({
      success: true,
      message: 'Messaggio inviato con successo! Ti risponderò al più presto.',
      messageId
    });

  } catch (err) {
    logError('Contact handler exception', err, { email, ip });
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Si è verificato un errore. Riprova più tardi.' 
    });
  }
};

export const getContactStats = (_, res) => {
  res.json({
    endpoint: '/api/contact',
    status: 'operational',
    timestamp: new Date().toISOString(),
    limits: { 
      rpm: 3, 
      window: '10m' 
    }
  });
};