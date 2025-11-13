import express from 'express';
import { handleSSEConnection, getSSEStats, broadcastTestMessage } from '../controllers/events.controller.js';
import { generalLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';

const router = express.Router();

/**
 * GET /api/events
 * Server-Sent Events endpoint for real-time updates
 */
router.get('/', handleSSEConnection);

/**
 * GET /api/events/stats
 * Get SSE connection statistics
 */
router.get('/stats', generalLimiter, asyncHandler(getSSEStats));

/**
 * POST /api/events/broadcast
 * Broadcast test message to all connected clients (development only)
 */
router.post('/broadcast', generalLimiter, asyncHandler(broadcastTestMessage));

export default router;