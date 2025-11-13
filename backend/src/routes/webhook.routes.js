import express from 'express';
import { handleContentfulWebhook, getWebhookStats, testWebhook } from '../controllers/webhook.controller.js';
import { webhookLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';

const router = express.Router();

// Middleware to capture raw body for signature verification
const captureRawBody = (req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  
  req.on('data', (chunk) => {
    data += chunk;
  });
  
  req.on('end', () => {
    req.rawBody = data;
    try {
      req.body = JSON.parse(data);
    } catch (error) {
      req.body = {};
    }
    next();
  });
};

/**
 * POST /api/contentful-webhook
 * Handle Contentful webhook events
 */
router.post(
  '/',
  webhookLimiter,
  captureRawBody,
  asyncHandler(handleContentfulWebhook)
);

/**
 * GET /api/contentful-webhook/stats
 * Get webhook statistics
 */
router.get('/stats', asyncHandler(getWebhookStats));

/**
 * POST /api/contentful-webhook/test
 * Test webhook broadcasting (development only)
 */
router.post('/test', asyncHandler(testWebhook));

export default router;