import { Router } from 'express';
import { handleContactSubmission, getContactStats } from '../controllers/contact.controller.js';
import { validateContactForm, handleValidationErrors, sanitizeInput, detectSpam } from '../middleware/validate.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';

const router = Router();

router.post('/',
  contactLimiter,
  sanitizeInput,
  validateContactForm,
  handleValidationErrors,
  detectSpam,
  asyncHandler(handleContactSubmission)
);

router.get('/stats', asyncHandler(getContactStats));

export default router;