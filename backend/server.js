import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from 'contentful';

// Load environment variables FIRST
dotenv.config({ path: './.env' });

// Import utilities
import { logInfo, logError } from './src/utils/logger.js';

// Import middleware
import { configureSecurity } from './src/middleware/security.js';
import { generalLimiter } from './src/middleware/rateLimit.js';
import { errorHandler, notFoundHandler, timeoutHandler } from './src/middleware/errors.js';

// Import routes
import contactRoutes from './src/routes/contact.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import projectsRoutes from './src/routes/projects.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';
import eventsRoutes from './src/routes/events.routes.js';
import healthRoutes from './src/routes/health.routes.js';

// Import controllers for generic endpoints
import * as blogController from './src/controllers/blog.controller.js';

// Debug environment variables
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
  HAS_CONTENTFUL_SECRET: !!process.env.CONTENTFUL_WEBHOOK_SECRET,
  HAS_CONTENTFUL_SPACE_ID: !!process.env.CONTENTFUL_SPACE_ID,
  HAS_CONTENTFUL_ACCESS_TOKEN: !!process.env.CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID?.substring(0, 8) + '...',
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN?.substring(0, 8) + '...'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const server = createServer(app);

// Server configuration
const PORT = process.env.PORT || 3020;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Request timeout
app.use(timeoutHandler(30000)); // 30 seconds

// Security middleware
configureSecurity(app);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook signature verification
    if (req.url === '/api/contentful-webhook') {
      req.rawBody = buf.toString('utf8');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// General rate limiting
app.use('/api', generalLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Only log in development or for errors
    if (NODE_ENV === 'development' || res.statusCode >= 400) {
      logInfo('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    }
  });
  
  next();
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contentful-webhook', webhookRoutes);
app.use('/api/events', eventsRoutes);
app.use('/health', healthRoutes);

// Generic Contentful entries endpoint (used by frontend components)
app.get('/api/contentful/entries', async (req, res) => {
  try {
    const contentType = req.query.content_type;
    console.log('Fetching Contentful entries for content_type:', contentType);
    
    // Route to specific controller based on content_type
    if (contentType === 'blogPost') {
      // Use blog controller
      return blogController.getAllBlogPosts(req, res);
    } else {
      // Generic fallback for projects and other content types
      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      });
      
      console.log('Contentful client config:', {
        space: process.env.CONTENTFUL_SPACE_ID,
        hasToken: !!process.env.CONTENTFUL_ACCESS_TOKEN
      });
      
      const response = await client.getEntries(req.query);
      console.log('Contentful response received, items count:', response.items.length);
      res.json(response);
    }
  } catch (error) {
    console.error('Contentful entries error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Unable to fetch entries from Contentful',
      details: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    version: process.env.npm_package_version || '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      contact: '/api/contact',
      webhook: '/api/contentful-webhook',
      events: '/api/events (SSE)'
    },
    documentation: 'https://github.com/alinaGalben/portfolio-backend'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Portfolio Backend API',
    version: process.env.npm_package_version || '1.0.0',
    endpoints: [
      {
        path: '/api/contact',
        method: 'POST',
        description: 'Submit contact form',
        rateLimit: '3 requests per 10 minutes'
      },
      {
        path: '/api/contentful-webhook',
        method: 'POST',
        description: 'Contentful webhook receiver',
        authentication: 'HMAC signature required'
      },
      {
        path: '/api/events',
        method: 'GET',
        description: 'Server-Sent Events for real-time updates',
        type: 'text/event-stream'
      },
      {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint'
      }
    ]
  });
});

// 404 handler - catch all routes not matched above
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logInfo(`Received ${signal}, starting graceful shutdown`);
  
  server.close((err) => {
    if (err) {
      logError('Error during server shutdown', err);
      process.exit(1);
    }
    
    logInfo('Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logError('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection', reason, { promise });
  process.exit(1);
});

// Start server
server.listen(PORT, () => {
  logInfo('Portfolio Backend Server started', {
    port: PORT,
    environment: NODE_ENV,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
  
  // Log configuration status
  const configStatus = {
    resend: !!process.env.RESEND_API_KEY,
    contentful: !!process.env.CONTENTFUL_WEBHOOK_SECRET,
    cors: !!process.env.CORS_ORIGINS,
    email: {
      from: process.env.EMAIL_FROM || 'not configured',
      to: process.env.EMAIL_TO || 'not configured'
    }
  };
  
  logInfo('Configuration status', configStatus);
  
  if (!process.env.RESEND_API_KEY) {
    logError('RESEND_API_KEY not configured - contact form will not work');
  }
  
  if (!process.env.CONTENTFUL_WEBHOOK_SECRET) {
    logError('CONTENTFUL_WEBHOOK_SECRET not configured - webhooks will not work');
  }
});

export default app;