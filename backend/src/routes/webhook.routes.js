import { Router } from 'express';
import { handleContentfulWebhook, getWebhookStats, testWebhook } from '../controllers/webhook.controller.js';
import { webhookLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';

const router = Router();

// Raw body capture is handled by global express.json() verify hook in server.js
router.post('/', webhookLimiter, asyncHandler(handleContentfulWebhook));
router.get('/stats', asyncHandler(getWebhookStats));
router.post('/test', asyncHandler(testWebhook));

export default router;