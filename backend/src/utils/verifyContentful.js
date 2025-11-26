import { createHmac, timingSafeEqual } from 'node:crypto';
import { logError } from './logger.js';

const TOPIC_MAP = {
  blogPost: 'blog-updated',
  project: 'project-updated'
};

const BROADCAST_EVENTS = new Set([
  'ContentManagement.Entry.publish',
  'ContentManagement.Entry.unpublish',
  'ContentManagement.Entry.delete'
]);

export const verifyContentfulSignature = (payload, signatureHeader, secret) => {
  if (!payload || !signatureHeader || !secret) return false;

  try {
    const signature = signatureHeader.replace(/^sha256=/, '');
    const digest = createHmac('sha256', secret).update(payload).digest('hex');

    return timingSafeEqual(
      Buffer.from(digest, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    logError('Signature verification failed', error);
    return false;
  }
};

export const extractTopicFromPayload = (payload) => {
  const typeId = payload?.sys?.contentType?.sys?.id;
  return TOPIC_MAP[typeId] ?? 'stats-updated';
};

export const shouldBroadcastEvent = (payload) => 
  BROADCAST_EVENTS.has(payload?.sys?.topic);