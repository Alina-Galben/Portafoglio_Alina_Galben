import crypto from 'crypto';
import { verifyContentfulSignature, extractTopicFromPayload, shouldBroadcastEvent } from '../utils/verifyContentful.js';
import sseBus from '../services/sse-bus.js';
import { invalidateCache as invalidateBlogCache } from './blog.controller.js';
import { logInfo, logError, logWarn } from '../utils/logger.js';

/**
 * Handle Contentful webhook events
 */
export const handleContentfulWebhook = async (req, res) => {
  try {
    const signature = req.get('X-Contentful-Webhook-Signature');
    const rawBody = req.rawBody; // We'll need to add this to express middleware
    const payload = req.body;

    // Verify webhook signature
    if (!verifyContentfulSignature(rawBody, signature, process.env.CONTENTFUL_WEBHOOK_SECRET)) {
      logWarn('Invalid Contentful webhook signature', {
        hasSignature: !!signature,
        hasSecret: !!process.env.CONTENTFUL_WEBHOOK_SECRET,
        ip: req.ip
      });

      return res.status(401).json({
        error: 'Invalid signature',
        message: 'Webhook signature verification failed'
      });
    }

    logInfo('Contentful webhook received', {
      eventType: payload.sys?.topic,
      contentType: payload.sys?.contentType?.sys?.id,
      entryId: payload.sys?.id
    });

    // Check if we should broadcast this event
    if (!shouldBroadcastEvent(payload)) {
      logInfo('Webhook event ignored (not a broadcast-worthy event)', {
        eventType: payload.sys?.topic
      });

      return res.status(200).json({
        success: true,
        message: 'Event received but not broadcasted'
      });
    }

    // Extract topic for SSE broadcasting
    const topic = extractTopicFromPayload(payload);
    
    if (!topic) {
      logWarn('Unable to extract topic from webhook payload', {
        contentType: payload.sys?.contentType?.sys?.id,
        eventType: payload.sys?.topic
      });

      return res.status(200).json({
        success: true,
        message: 'Event received but no topic determined'
      });
    }

    // Prepare broadcast data
    const broadcastData = {
      contentType: payload.sys?.contentType?.sys?.id,
      entryId: payload.sys?.id,
      eventType: payload.sys?.topic,
      updatedAt: new Date().toISOString()
    };

    // Invalidate specific cache based on content type
    const contentType = payload.sys?.contentType?.sys?.id;
    if (contentType === 'blogPost') {
      invalidateBlogCache();
      logInfo('Blog cache invalidated due to webhook event');
    }

    // Broadcast to all SSE clients
    sseBus.broadcast(topic, broadcastData);

    logInfo('Webhook processed and broadcasted', {
      topic,
      clientCount: sseBus.getStats().totalClients,
      entryId: payload.sys?.id
    });

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      broadcasted: {
        topic,
        clientCount: sseBus.getStats().totalClients
      }
    });

  } catch (error) {
    logError('Contentful webhook processing error', error, {
      hasBody: !!req.body,
      hasSignature: !!req.get('X-Contentful-Webhook-Signature'),
      ip: req.ip
    });

    res.status(500).json({
      error: 'Webhook processing failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Get webhook statistics
 */
export const getWebhookStats = async (req, res) => {
  try {
    const stats = {
      endpoint: '/api/contentful-webhook',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      sseClients: sseBus.getStats(),
      supportedTopics: [
        'blog-updated',
        'project-updated', 
        'stats-updated'
      ],
      webhookEvents: [
        'ContentManagement.Entry.publish',
        'ContentManagement.Entry.unpublish',
        'ContentManagement.Entry.delete'
      ]
    };

    res.status(200).json(stats);

  } catch (error) {
    logError('Error getting webhook stats', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to retrieve webhook statistics'
    });
  }
};

/**
 * Test webhook endpoint (development only)
 */
export const testWebhook = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Test endpoint not available in production'
    });
  }

  try {
    const { topic, data = {} } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Topic is required'
      });
    }

    const validTopics = ['blog-updated', 'project-updated', 'stats-updated'];
    
    if (!validTopics.includes(topic)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid topic. Must be one of: ${validTopics.join(', ')}`
      });
    }

    // Broadcast test event
    sseBus.broadcast(topic, {
      ...data,
      test: true,
      triggeredBy: 'test-endpoint'
    });

    logInfo('Test webhook broadcasted', {
      topic,
      clientCount: sseBus.getStats().totalClients
    });

    res.status(200).json({
      success: true,
      message: 'Test event broadcasted',
      topic,
      clientCount: sseBus.getStats().totalClients
    });

  } catch (error) {
    logError('Test webhook error', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Test webhook failed'
    });
  }
};