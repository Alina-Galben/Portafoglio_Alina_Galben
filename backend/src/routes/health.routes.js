import { Router } from 'express';
import { loadavg, freemem, totalmem, cpus } from 'node:os';
import sseBus from '../services/sse-bus.js';
import { logInfo, logError } from '../utils/logger.js';

const router = Router();
const toMB = (bytes) => Math.round(bytes / 1024 / 1024);

const formatUptime = (sec) => {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m ${Math.floor(sec % 60)}s`;
};

router.get('/', (_, res) => {
  const start = process.hrtime();

  try {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();
    const { totalClients } = sseBus.getStats();
    const uptime = process.uptime();
    
    const [s, ns] = process.hrtime(start);
    const latency = Math.round(s * 1000 + ns / 1e6);

    const payload = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptime),
      metrics: {
        memoryMB: { rss: toMB(rss), heap: toMB(heapUsed), total: toMB(heapTotal) },
        sseClients: totalClients,
        latency: `${latency}ms`
      },
      env: {
        mode: process.env.NODE_ENV ?? 'dev',
        version: process.env.npm_package_version ?? '0.0.0',
        integrations: {
          mailer: !!process.env.RESEND_API_KEY,
          contentful: !!process.env.CONTENTFUL_WEBHOOK_SECRET
        }
      }
    };

    if (process.env.NODE_ENV === 'development') {
      logInfo('Health Probe', { latency, clients: totalClients });
    }

    res.json(payload);
  } catch (error) {
    logError('Health Check Failed', error);
    res.status(503).json({ status: 'down', error: error.message });
  }
});

router.get('/detailed', (_, res) => {
  try {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        platform: process.platform,
        version: process.version,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      sse: sseBus.getStats(),
      config: {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        features: {
          resend: !!process.env.RESEND_API_KEY,
          webhooks: !!process.env.CONTENTFUL_WEBHOOK_SECRET,
          corsOrigins: process.env.CORS_ORIGINS?.split(',').length ?? 0
        }
      },
      system: {
        load: loadavg(),
        mem: { free: freemem(), total: totalmem() },
        cpus: cpus().length
      }
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

export default router;