import express from 'express';
import { handleContactSubmission, getContactStats } from '../controllers/contact.controller.js';
import { validateContactForm, handleValidationErrors, sanitizeInput, detectSpam } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';

const router = express.Router();

/**
 * POST /api/contact
 * Handle contact form submissions
 */
router.post(
  '/',
  contactLimiter,
  sanitizeInput,
  validateContactForm,
  handleValidationErrors,
  detectSpam,
  asyncHandler(handleContactSubmission)
);

/**
 * GET /api/contact/stats
 * Get contact form statistics (for monitoring)
 */
router.get('/stats', asyncHandler(getContactStats));

export default router;