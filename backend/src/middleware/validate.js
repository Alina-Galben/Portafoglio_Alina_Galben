import { body, validationResult } from 'express-validator';
import { logWarn } from '../utils/logger.js';

/**
 * Validation rules for contact form
 */
export const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Name contains invalid characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email address is too long'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters')
    .escape(),

  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .escape(),

  // Honeypot field - should always be empty
  body('honeypot')
    .optional()
    .isEmpty()
    .withMessage('Spam detected'),

  // Optional phone field validation (if present)
  body('phone')
    .optional()
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Please provide a valid phone number')
];

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    logWarn('Validation failed', {
      ip: req.ip,
      errors: errorMessages,
      body: req.body
    });

    return res.status(422).json({
      error: 'Validation failed',
      details: errorMessages
    });
  }

  next();
};

/**
 * Sanitize request body to prevent XSS
 */
export const sanitizeInput = (req, res, next) => {
  // Additional sanitization beyond express-validator's escape()
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove any remaining HTML tags and suspicious patterns
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      }
    }
  }

  next();
};

/**
 * Advanced spam detection
 */
export const detectSpam = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Spam indicators
  const spamPatterns = [
    /viagra|cialis|lottery|winner|congratulations/i,
    /click here|limited time|act now/i,
    /\$\$\$|\!\!\!/,
    /http[s]?:\/\/[^\s]{10,}/g // Multiple URLs
  ];

  const suspiciousPatterns = [
    name && name.length < 2,
    email && email.includes('tempmail'),
    subject && subject.length < 5,
    // Message doesn't need to be long for job proposals
    message && message.length < 5
  ];

  // Check for spam patterns
  const fullText = `${name} ${email} ${subject} ${message}`.toLowerCase();
  const hasSpamPattern = spamPatterns.some(pattern => pattern.test(fullText));
  
  // Count suspicious indicators
  const suspiciousCount = suspiciousPatterns.filter(Boolean).length;

  if (hasSpamPattern || suspiciousCount >= 2) {
    logWarn('Potential spam detected', {
      ip: req.ip,
      email: email,
      hasSpamPattern,
      suspiciousCount,
      userAgent: req.get('User-Agent')
    });

    return res.status(422).json({
      error: 'Message appears to be spam',
      message: 'Please ensure your message follows our guidelines'
    });
  }

  next();
};

/**
 * Validate blog post slug parameter
 */
export const validateBlogParams = (req, res, next) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({
      error: 'Parametro mancante',
      message: 'Slug del blog post richiesto'
    });
  }

  // Validate slug format (lowercase letters, numbers, hyphens)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({
      error: 'Formato slug non valido',
      message: 'Lo slug può contenere solo lettere minuscole, numeri e trattini'
    });
  }

  if (slug.length > 100) {
    return res.status(400).json({
      error: 'Slug troppo lungo',
      message: 'Lo slug non può superare i 100 caratteri'
    });
  }

  next();
};

/**
 * Validate blog search parameters
 */
export const validateSearchParams = (req, res, next) => {
  const { q, tags, limit, skip } = req.query;

  // At least one search parameter is required
  if (!q && !tags) {
    return res.status(400).json({
      error: 'Parametri di ricerca mancanti',
      message: 'Fornire almeno un termine di ricerca (q) o tag'
    });
  }

  // Validate search query
  if (q) {
    if (typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Query di ricerca non valida',
        message: 'La query di ricerca deve contenere almeno 2 caratteri'
      });
    }

    if (q.length > 100) {
      return res.status(400).json({
        error: 'Query di ricerca troppo lunga',
        message: 'La query di ricerca non può superare i 100 caratteri'
      });
    }
  }

  // Validate tags
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    
    for (const tag of tagArray) {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        return res.status(400).json({
          error: 'Tag non valido',
          message: 'Tutti i tag devono essere stringhe non vuote'
        });
      }

      if (tag.length > 50) {
        return res.status(400).json({
          error: 'Tag troppo lungo',
          message: 'Ogni tag non può superare i 50 caratteri'
        });
      }
    }

    if (tagArray.length > 10) {
      return res.status(400).json({
        error: 'Troppi tag',
        message: 'Non è possibile filtrare per più di 10 tag alla volta'
      });
    }
  }

  // Validate pagination parameters
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({
        error: 'Parametro limit non valido',
        message: 'Il limite deve essere un numero tra 1 e 50'
      });
    }
  }

  if (skip !== undefined) {
    const skipNum = parseInt(skip);
    if (isNaN(skipNum) || skipNum < 0) {
      return res.status(400).json({
        error: 'Parametro skip non valido',
        message: 'Skip deve essere un numero maggiore o uguale a 0'
      });
    }
  }

  next();
};