import EventEmitter from 'events';
import { logInfo, logDebug } from '../utils/logger.js';

class SSEBus extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.setMaxListeners(0); // Remove limit for SSE connections
  }

  /**
   * Add a new SSE client connection
   * @param {Response} res - Express response object
   * @param {string} clientId - Unique client identifier
   */
  addClient(res, clientId) {
    const client = {
      id: clientId,
      response: res,
      connectedAt: new Date().toISOString()
    };

    this.clients.add(client);
    
    logInfo('SSE client connected', {
      clientId,
      totalClients: this.clients.size
    });

    // Send initial connection message
    this.sendToClient(client, {
      type: 'connected',
      timestamp: new Date().toISOString(),
      clientId
    });

    // Handle client disconnect
    res.on('close', () => {
      this.removeClient(clientId);
    });

    res.on('error', (error) => {
      logDebug('SSE client error', { clientId, error: error.message });
      this.removeClient(clientId);
    });

    return client;
  }

  /**
   * Remove a client connection
   * @param {string} clientId - Client identifier to remove
   */
  removeClient(clientId) {
    const clientToRemove = Array.from(this.clients).find(client => client.id === clientId);
    
    if (clientToRemove) {
      this.clients.delete(clientToRemove);
      
      logInfo('SSE client disconnected', {
        clientId,
        totalClients: this.clients.size,
        connectionDuration: Date.now() - new Date(clientToRemove.connectedAt).getTime()
      });
    }
  }

  /**
   * Send data to a specific client
   * @param {Object} client - Client object
   * @param {Object} data - Data to send
   */
  sendToClient(client, data) {
    try {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      client.response.write(message);
      
      logDebug('Message sent to client', {
        clientId: client.id,
        messageType: data.type
      });
    } catch (error) {
      logDebug('Failed to send message to client', {
        clientId: client.id,
        error: error.message
      });
      
      this.removeClient(client.id);
    }
  }

  /**
   * Broadcast a message to all connected clients
   * @param {string} topic - Event topic (blog-updated, project-updated, stats-updated)
   * @param {Object} payload - Optional payload data
   */
  broadcast(topic, payload = {}) {
    const message = {
      type: topic,
      timestamp: new Date().toISOString(),
      data: payload
    };

    logInfo('Broadcasting SSE message', {
      topic,
      clientCount: this.clients.size,
      hasPayload: Object.keys(payload).length > 0
    });

    // Send to all connected clients
    for (const client of this.clients) {
      this.sendToClient(client, message);
    }

    // Emit event for potential logging or other listeners
    this.emit('broadcast', { topic, payload, clientCount: this.clients.size });
  }

  /**
   * Send heartbeat to all clients to keep connections alive
   */
  sendHeartbeat() {
    const heartbeatMessage = {
      type: 'heartbeat',
      timestamp: new Date().toISOString()
    };

    for (const client of this.clients) {
      this.sendToClient(client, heartbeatMessage);
    }

    logDebug('Heartbeat sent to all clients', {
      clientCount: this.clients.size
    });
  }

  /**
   * Get current connection statistics
   * @returns {Object} - Connection stats
   */
  getStats() {
    return {
      totalClients: this.clients.size,
      clients: Array.from(this.clients).map(client => ({
        id: client.id,
        connectedAt: client.connectedAt,
        connectionDuration: Date.now() - new Date(client.connectedAt).getTime()
      }))
    };
  }

  /**
   * Close all connections (useful for graceful shutdown)
   */
  closeAllConnections() {
    logInfo('Closing all SSE connections', {
      clientCount: this.clients.size
    });

    for (const client of this.clients) {
      try {
        client.response.end();
      } catch (error) {
        logDebug('Error closing client connection', {
          clientId: client.id,
          error: error.message
        });
      }
    }

    this.clients.clear();
  }
}

// Create singleton instance
const sseBus = new SSEBus();

// Start heartbeat interval (every 30 seconds)
const heartbeatInterval = setInterval(() => {
  if (sseBus.clients.size > 0) {
    sseBus.sendHeartbeat();
  }
}, 30000);

// Cleanup on process termination
process.on('SIGTERM', () => {
  clearInterval(heartbeatInterval);
  sseBus.closeAllConnections();
});

process.on('SIGINT', () => {
  clearInterval(heartbeatInterval);
  sseBus.closeAllConnections();
});

export default sseBus;