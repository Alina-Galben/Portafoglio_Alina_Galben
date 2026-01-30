import { body, validationResult } from 'express-validator';
import { logWarn } from '../utils/logger.js';

export const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Invalid name length')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Invalid characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Invalid email')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email too long'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Invalid subject length')
    .escape(),

  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Invalid message length')
    .escape(),

  body('honeypot').optional().isEmpty().withMessage('Bot detected'),
  body('phone').optional().isMobilePhone('any', { strictMode: false }).withMessage('Invalid phone')
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const details = errors.array().map(({ path, msg, value }) => ({ field: path, message: msg, value }));
    
    logWarn('Validation Failure', { ip: req.ip, details, payload: req.body });
    return res.status(422).json({ error: 'Validation Failed', details });
  }

  next();
};

export const sanitizeInput = (req, _, next) => {
  if (!req.body) return next();

  Object.keys(req.body).forEach(key => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:|on\w+\s*=/gi, '');
    }
  });

  next();
};

const SPAM_PATTERNS = [
  /viagra|cialis|lottery|winner|congratulations|click here|limited time|act now|\$\$\$|!!!/i,
  /http[s]?:\/\/[^\s]{10,}/g
];

export const detectSpam = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  const content = `${name} ${email} ${subject} ${message}`.toLowerCase();
  const hasSpamKeywords = SPAM_PATTERNS.some(p => p.test(content));
  
  const suspiciousFlags = [
    name?.length < 2,
    email?.includes('tempmail'),
    subject?.length < 5,
    message?.length < 5
  ].filter(Boolean).length;

  if (hasSpamKeywords || suspiciousFlags >= 2) {
    logWarn('Spam Blocked', { ip: req.ip, email, userAgent: req.get('User-Agent') });
    return res.status(422).json({ error: 'Spam Detected', message: 'Submission rejected' });
  }

  next();
};

export const validateBlogParams = (req, res, next) => {
  const { slug } = req.params;

  if (!slug) return res.status(400).json({ error: 'Missing Slug' });
  if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: 'Invalid Slug Format' });
  if (slug.length > 100) return res.status(400).json({ error: 'Slug Too Long' });

  next();
};

export const validateSearchParams = (req, res, next) => {
  const { q, tags, limit, skip } = req.query;

  if (!q && !tags) return res.status(400).json({ error: 'Missing Criteria', message: 'Provide q or tags' });

  if (q && (typeof q !== 'string' || q.trim().length < 2 || q.length > 100)) {
    return res.status(400).json({ error: 'Invalid Query' });
  }

  if (tags) {
    const tagList = Array.isArray(tags) ? tags : [tags];
    if (tagList.some(t => typeof t !== 'string' || !t.trim() || t.length > 50)) {
      return res.status(400).json({ error: 'Invalid Tags' });
    }
    if (tagList.length > 10) return res.status(400).json({ error: 'Too Many Tags' });
  }

  if ((limit && (isNaN(limit) || limit < 1 || limit > 50)) || (skip && (isNaN(skip) || skip < 0))) {
    return res.status(400).json({ error: 'Invalid Pagination' });
  }

  next();
};

export const validateProjectSlug = (req, res, next) => {
   const { slug } = req.params;
   if (!slug) return res.status(400).json({ error: 'Missing slug' });
   if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: 'Invalid slug format' });
   if (slug.length > 100) return res.status(400).json({ error: 'Slug too long' });
   next();
 };
