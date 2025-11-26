import EventEmitter from 'node:events';
import { logInfo, logDebug } from '../utils/logger.js';

class SSEBus extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.setMaxListeners(0);
  }

  addClient(res, clientId) {
    const client = {
      id: clientId,
      response: res,
      connectedAt: new Date().toISOString()
    };

    this.clients.add(client);
    
    logInfo('SSE Connection', { clientId, totalClients: this.clients.size });

    this.sendToClient(client, {
      type: 'connected',
      timestamp: new Date().toISOString(),
      clientId
    });

    const cleanup = () => this.removeClient(clientId);
    res.on('close', cleanup);
    res.on('error', (err) => {
      logDebug('SSE Error', { clientId, error: err.message });
      cleanup();
    });

    return client;
  }

  removeClient(clientId) {
    const client = [...this.clients].find(c => c.id === clientId);
    if (!client) return;

    this.clients.delete(client);
    
    logInfo('SSE Disconnection', { 
      clientId, 
      durationMs: Date.now() - new Date(client.connectedAt).getTime() 
    });
  }

  sendToClient(client, payload) {
    try {
      client.response.write(`data: ${JSON.stringify(payload)}\n\n`);
      logDebug('SSE Push', { clientId: client.id, type: payload.type });
    } catch (error) {
      logDebug('SSE Push Failed', { clientId: client.id, error: error.message });
      this.removeClient(client.id);
    }
  }

  broadcast(topic, payload = {}) {
    const message = {
      type: topic,
      timestamp: new Date().toISOString(),
      data: payload
    };

    logInfo('SSE Broadcast', { topic, recipients: this.clients.size });

    this.clients.forEach(client => this.sendToClient(client, message));
    this.emit('broadcast', { topic, payload, clientCount: this.clients.size });
  }

  sendHeartbeat() {
    if (this.clients.size === 0) return;
    
    const beat = { type: 'heartbeat', timestamp: new Date().toISOString() };
    this.clients.forEach(client => this.sendToClient(client, beat));
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      clients: [...this.clients].map(({ id, connectedAt }) => ({
        id,
        connectedAt,
        uptime: Date.now() - new Date(connectedAt).getTime()
      }))
    };
  }

  closeAllConnections() {
    logInfo('SSE Shutdown', { count: this.clients.size });
    
    this.clients.forEach(client => {
      try { client.response.end(); } 
      catch (err) { logDebug('Close Error', { clientId: client.id, error: err.message }); }
    });
    
    this.clients.clear();
  }
}

const sseBus = new SSEBus();

const heartbeatInterval = setInterval(() => sseBus.sendHeartbeat(), 30_000);

const shutdown = () => {
  clearInterval(heartbeatInterval);
  sseBus.closeAllConnections();
};

['SIGTERM', 'SIGINT'].forEach(signal => process.on(signal, shutdown));

export default sseBus;