import { logError } from '../utils/logger.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logError('Unhandled error', err, {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get('User-Agent'),
    body: req.body
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || []
    });
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authentication credentials'
    });
  }

  if (err.status === 403) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied'
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found'
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Request Too Large',
      message: 'Request body exceeds size limit'
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON in request body'
    });
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Cross-origin request blocked'
    });
  }

  // Rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: err.message || 'Rate limit exceeded'
    });
  }

  // Default server error
  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Server Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  logError('Route not found', null, {
    ip: req.ip,
    method: req.method,
    path: req.path,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Async error wrapper to catch async/await errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Request timeout middleware
 */
export const timeoutHandler = (timeout = 30000) => {
  return (req, res, next) => {
    res.setTimeout(timeout, () => {
      if (!res.headersSent) {
        logWarn('Request timeout', {
          ip: req.ip,
          method: req.method,
          path: req.path,
          timeout
        });

        res.status(408).json({
          error: 'Request Timeout',
          message: 'Request took too long to process'
        });
      }
    });

    next();
  };
};