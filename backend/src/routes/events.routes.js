import { Router } from 'express';
import { handleSSEConnection, getSSEStats, broadcastTestMessage } from '../controllers/events.controller.js';
import { generalLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';

const router = Router();

router.get('/', handleSSEConnection);
router.get('/stats', generalLimiter, asyncHandler(getSSEStats));
router.post('/broadcast', generalLimiter, asyncHandler(broadcastTestMessage));

export default router;