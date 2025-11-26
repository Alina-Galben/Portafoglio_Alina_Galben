import rateLimit from 'express-rate-limit';
import { logWarn } from '../utils/logger.js';

const createLimiter = ({ windowMinutes, maxRequests, message, logContext = 'API' }) => rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    error: 'Rate limit exceeded', 
    message, 
    retryAfter: `${windowMinutes} minutes` 
  },
  handler: (req, res, next, options) => {
    logWarn(`${logContext} rate limit hit`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl
    });
    res.status(options.statusCode).send(options.message);
  }
});

const isDev = process.env.NODE_ENV === 'development';

export const generalLimiter = createLimiter({
  windowMinutes: 15,
  maxRequests: 100,
  message: 'System load limit reached. Please pause requests.',
  logContext: 'General'
});

export const contactLimiter = createLimiter({
  windowMinutes: 10,
  maxRequests: isDev ? 50 : 3,
  message: 'Message quota exceeded. Please wait before sending more.',
  logContext: 'ContactForm'
});

export const webhookLimiter = createLimiter({
  windowMinutes: 1,
  maxRequests: 20,
  message: 'Webhook throughput limit exceeded.',
  logContext: 'Webhook'
});