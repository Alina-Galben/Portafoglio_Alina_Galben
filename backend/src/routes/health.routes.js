import express from 'express';
import { logInfo } from '../utils/logger.js';
import sseBus from '../services/sse-bus.js';

const router = express.Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  const startTime = process.hrtime();
  
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const sseStats = sseBus.getStats();
    
    // Convert memory usage to MB
    const memoryMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };

    const endTime = process.hrtime(startTime);
    const responseTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.round(uptime),
        human: formatUptime(uptime)
      },
      memory: memoryMB,
      sse: {
        totalClients: sseStats.totalClients,
        status: sseStats.totalClients >= 0 ? 'operational' : 'error'
      },
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      responseTime: `${responseTime}ms`,
      services: {
        mailer: process.env.RESEND_API_KEY ? 'configured' : 'not configured',
        contentful: process.env.CONTENTFUL_WEBHOOK_SECRET ? 'configured' : 'not configured',
        cors: process.env.CORS_ORIGINS ? 'configured' : 'default'
      }
    };

    // Log health check (only in development to avoid spam)
    if (process.env.NODE_ENV === 'development') {
      logInfo('Health check performed', {
        responseTime: `${responseTime}ms`,
        sseClients: sseStats.totalClients
      });
    }

    res.status(200).json(healthData);

  } catch (error) {
    logError('Health check failed', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error.message
    });
  }
});

/**
 * GET /health/detailed
 * Detailed health check with more diagnostics
 */
router.get('/detailed', (req, res) => {
  try {
    const cpuUsage = process.cpuUsage();
    const sseStats = sseBus.getStats();
    
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: cpuUsage
      },
      sse: sseStats,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasContentfulSecret: !!process.env.CONTENTFUL_WEBHOOK_SECRET,
        corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').length : 0
      },
      system: {
        loadAverage: process.platform !== 'win32' ? require('os').loadavg() : null,
        freeMemory: require('os').freemem(),
        totalMemory: require('os').totalmem(),
        cpus: require('os').cpus().length
      }
    };

    res.status(200).json(detailedHealth);

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Format uptime in human readable format
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export default router;