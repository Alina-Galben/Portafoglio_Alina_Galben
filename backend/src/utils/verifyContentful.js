import crypto from 'crypto';
import { logError, logDebug } from './logger.js';

/**
 * Verify Contentful webhook signature using HMAC SHA-256
 * @param {string} payload - Raw request body
 * @param {string} signature - X-Contentful-Webhook-Signature header
 * @param {string} secret - Webhook secret from environment
 * @returns {boolean} - True if signature is valid
 */
export const verifyContentfulSignature = (payload, signature, secret) => {
  if (!payload || !signature || !secret) {
    logError('Missing required parameters for signature verification', {
      hasPayload: !!payload,
      hasSignature: !!signature,
      hasSecret: !!secret
    });
    return false;
  }

  try {
    // Contentful sends signature as hex string
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Compare signatures using timing-safe comparison
    const providedSignature = signature.replace('sha256=', '');
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );

    logDebug('Signature verification completed', {
      isValid,
      signatureLength: providedSignature.length,
      expectedLength: expectedSignature.length
    });

    return isValid;
  } catch (error) {
    logError('Error during signature verification', error);
    return false;
  }
};

/**
 * Extract topic from Contentful webhook payload
 * @param {Object} payload - Contentful webhook payload
 * @returns {string|null} - Topic for SSE broadcasting
 */
export const extractTopicFromPayload = (payload) => {
  if (!payload || !payload.sys) {
    return null;
  }

  const contentType = payload.sys.contentType?.sys?.id;
  
  switch (contentType) {
    case 'blogPost':
      return 'blog-updated';
    case 'project':
      return 'project-updated';
    default:
      // For any other content type, broadcast stats update
      return 'stats-updated';
  }
};

/**
 * Validate webhook event type
 * @param {Object} payload - Contentful webhook payload
 * @returns {boolean} - True if event should trigger broadcast
 */
export const shouldBroadcastEvent = (payload) => {
  if (!payload || !payload.sys) {
    return false;
  }

  const topic = payload.sys.topic;
  
  // Only broadcast on publish, unpublish, and delete events
  const validTopics = [
    'ContentManagement.Entry.publish',
    'ContentManagement.Entry.unpublish',
    'ContentManagement.Entry.delete'
  ];

  return validTopics.includes(topic);
};