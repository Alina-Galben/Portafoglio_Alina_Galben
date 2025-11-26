import { verifyContentfulSignature, extractTopicFromPayload, shouldBroadcastEvent } from '../utils/verifyContentful.js';
import sseBus from '../services/sse-bus.js';
import { invalidateCache } from './blog.controller.js';
import { logInfo, logError, logWarn } from '../utils/logger.js';

export const handleContentfulWebhook = async (req, res) => {
  const { rawBody, body: webhookEvent, ip } = req;
  const signature = req.get('X-Contentful-Webhook-Signature');

  try {
    if (!verifyContentfulSignature(rawBody, signature, process.env.CONTENTFUL_WEBHOOK_SECRET)) {
      logWarn('Security: Invalid Contentful signature', { ip });
      return res.status(401).json({ error: 'Signature verification failed' });
    }

    if (!shouldBroadcastEvent(webhookEvent)) {
      return res.json({ status: 'ignored', reason: 'Event type filtered' });
    }

    const { id: entryId, contentType, topic: eventType } = webhookEvent.sys;
    const contentTypeId = contentType?.sys?.id;

    if (contentTypeId === 'blogPost') {
      invalidateCache();
      logInfo('Cache invalidated via Webhook', { entryId });
    }

    const broadcastTopic = extractTopicFromPayload(webhookEvent);
    
    if (broadcastTopic) {
      sseBus.broadcast(broadcastTopic, {
        contentType: contentTypeId,
        entryId,
        eventType,
        updatedAt: new Date().toISOString()
      });
      
      logInfo(`SSE Broadcast dispatched: ${broadcastTopic}`, { 
        clients: sseBus.getStats().totalClients 
      });
    }

    res.json({ success: true });

  } catch (error) {
    logError('Webhook handler failure', error, { entryId: webhookEvent?.sys?.id });
    res.status(500).json({ error: 'Processing failed' });
  }
};

export const getWebhookStats = (_, res) => {
  res.json({
    endpoint: '/api/contentful-webhook',
    status: 'operational',
    timestamp: new Date().toISOString(),
    sseClients: sseBus.getStats(),
    topics: ['blog-updated', 'project-updated', 'stats-updated']
  });
};

export const testWebhook = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not Found' });
  }

  const { topic, data = {} } = req.body;
  const VALID_TOPICS = ['blog-updated', 'project-updated', 'stats-updated'];

  if (!VALID_TOPICS.includes(topic)) {
    return res.status(400).json({ error: 'Invalid Topic', validTopics: VALID_TOPICS });
  }

  sseBus.broadcast(topic, { ...data, test: true, source: 'dev-test' });
  
  res.json({ 
    success: true, 
    topic, 
    clients: sseBus.getStats().totalClients 
  });
};