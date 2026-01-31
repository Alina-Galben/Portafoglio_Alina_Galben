import { createServer } from 'node:http';
import express from 'express';
import dotenv from 'dotenv';
import { createClient } from 'contentful';

import { logInfo, logError } from './src/utils/logger.js';
import { configureSecurity } from './src/middleware/security.js';
import { generalLimiter } from './src/middleware/rateLimit.js';
import { errorHandler, notFoundHandler, timeoutHandler } from './src/middleware/errors.js';

import contactRoutes from './src/routes/contact.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import projectsRoutes from './src/routes/projects.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';
import eventsRoutes from './src/routes/events.routes.js';
import healthRoutes from './src/routes/health.routes.js';
import * as blogController from './src/controllers/blog.controller.js';

dotenv.config();

const app = express();
const server = createServer(app);

const { PORT = 3020, NODE_ENV = 'development' } = process.env;

app.set('trust proxy', 1);
app.use(timeoutHandler(30_000));
configureSecurity(app);

app.use(express.json({ 
  limit: '10mb',
  verify: (req, _, buf) => {
    if (req.url === '/api/contentful-webhook') req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', generalLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (NODE_ENV === 'development' || res.statusCode >= 400) {
      logInfo('Request processed', { 
        method: req.method, 
        path: req.path, 
        status: res.statusCode, 
        duration: `${Date.now() - start}ms` 
      });
    }
  });
  next();
});

app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contentful-webhook', webhookRoutes);
app.use('/api/events', eventsRoutes);
app.use('/health', healthRoutes);

app.get('/api/contentful/entries', async (req, res, next) => {
  const { content_type } = req.query;
  if (content_type === 'blogPost') return blogController.getAllBlogPosts(req, res);

  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
    const entries = await client.getEntries(req.query);
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

app.get(['/', '/api'], (_, res) => res.json({
  service: 'Portfolio Backend API',
  version: process.env.npm_package_version ?? '1.0.0',
  env: NODE_ENV,
  timestamp: new Date().toISOString()
}));

app.use(notFoundHandler);
app.use(errorHandler);

const shutdown = (signal) => {
  logInfo(`${signal} received. Closing server...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

['SIGTERM', 'SIGINT'].forEach(s => process.on(s, () => shutdown(s)));

process.on('uncaughtException', (err) => {
  logError('Uncaught Exception', err);
  process.exit(1);
});

server.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`, { env: NODE_ENV });
});

export default app;