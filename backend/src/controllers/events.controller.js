import { v4 as uuidv4 } from 'uuid';
import sseBus from '../services/sse-bus.js';
import { logInfo, logDebug, logError } from '../utils/logger.js';

export const handleSSEConnection = (req, res) => {
  const clientId = uuidv4();
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': req.get('Origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
    'X-Accel-Buffering': 'no'
  });

  logInfo('SSE Connected', { clientId, ip: req.ip, userAgent: req.get('User-Agent') });

  sseBus.addClient(res, clientId);

  const keepAliveInterval = setInterval(() => {
    if (res.writableEnded) return clearInterval(keepAliveInterval);
    res.write(': keep-alive\n\n');
  }, 15_000);

  const cleanup = (reason) => {
    logDebug(`SSE Disconnected: ${reason}`, { clientId });
    clearInterval(keepAliveInterval);
    sseBus.removeClient(clientId);
  };

  req.on('close', () => cleanup('client_close'));
  res.on('close', () => cleanup('stream_close'));
  res.on('error', (err) => cleanup(`stream_error: ${err.message}`));
};

export const getSSEStats = (_, res) => {
  res.json({
    endpoint: '/api/events',
    status: 'operational',
    timestamp: new Date().toISOString(),
    ...sseBus.getStats(),
    events: ['connected', 'heartbeat', 'blog-updated', 'project-updated', 'stats-updated']
  });
};

export const broadcastTestMessage = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not Found', message: 'Dev only endpoint' });
  }

  try {
    const { message = 'Test payload', topic = 'test' } = req.body;
    
    sseBus.broadcast(topic, {
      message,
      test: true,
      triggeredBy: req.ip,
      timestamp: new Date().toISOString()
    });

    logInfo('SSE Test Broadcast', { topic, ip: req.ip });

    res.json({
      success: true,
      topic,
      clients: sseBus.getStats().totalClients
    });
  } catch (error) {
    logError('Broadcast failed', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};