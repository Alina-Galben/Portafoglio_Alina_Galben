import { v4 as uuidv4 } from 'uuid';
import sseBus from '../services/sse-bus.js';
import { logInfo, logDebug } from '../utils/logger.js';

/**
 * Handle SSE connection requests
 */
export const handleSSEConnection = (req, res) => {
  const clientId = uuidv4();

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': req.get('Origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Cache-Control,Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'X-Accel-Buffering': 'no' // Disable proxy buffering
  });

  logInfo('SSE connection request', {
    clientId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin')
  });

  // Add client to SSE bus
  const client = sseBus.addClient(res, clientId);

  // Handle client-specific events
  req.on('close', () => {
    logDebug('SSE client disconnected via request close', { clientId });
  });

  req.on('error', (error) => {
    logDebug('SSE client error', { clientId, error: error.message });
  });

  // Keep the connection alive
  const keepAlive = setInterval(() => {
    if (!res.destroyed && !res.finished) {
      res.write(': keep-alive\n\n');
    } else {
      clearInterval(keepAlive);
    }
  }, 15000); // Send keep-alive every 15 seconds

  // Clean up on disconnect
  res.on('close', () => {
    clearInterval(keepAlive);
    sseBus.removeClient(clientId);
  });

  res.on('error', (error) => {
    logDebug('SSE response error', { clientId, error: error.message });
    clearInterval(keepAlive);
    sseBus.removeClient(clientId);
  });
};

/**
 * Get SSE connection statistics
 */
export const getSSEStats = (req, res) => {
  try {
    const stats = sseBus.getStats();
    
    res.status(200).json({
      endpoint: '/api/events',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      ...stats,
      supportedEvents: [
        'connected',
        'heartbeat',
        'blog-updated',
        'project-updated',
        'stats-updated'
      ]
    });

  } catch (error) {
    logError('Error getting SSE stats', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to retrieve SSE statistics'
    });
  }
};

/**
 * Broadcast a test message to all SSE clients (development only)
 */
export const broadcastTestMessage = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Test endpoint not available in production'
    });
  }

  try {
    const { message = 'Test message', topic = 'test' } = req.body;

    sseBus.broadcast(topic, {
      message,
      test: true,
      triggeredBy: req.ip,
      timestamp: new Date().toISOString()
    });

    logInfo('Test SSE message broadcasted', {
      topic,
      message,
      clientCount: sseBus.getStats().totalClients,
      triggeredBy: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Test message broadcasted',
      topic,
      clientCount: sseBus.getStats().totalClients
    });

  } catch (error) {
    logError('Error broadcasting test message', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to broadcast test message'
    });
  }
};