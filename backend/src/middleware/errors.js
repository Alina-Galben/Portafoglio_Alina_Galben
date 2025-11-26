import { logError, logWarn } from '../utils/logger.js';

const ERROR_MAP = {
  ValidationError: { status: 422, message: 'Validation Error' },
  UnauthorizedError: { status: 401, message: 'Invalid credentials' },
  'entity.too.large': { status: 413, message: 'Payload exceeds limit' },
  'entity.parse.failed': { status: 400, message: 'Malformed JSON' }
};

export const errorHandler = (err, req, res, next) => {
  logError('Exception caught', err, { 
    path: req.path, 
    method: req.method,
    ip: req.ip 
  });

  if (res.headersSent) return next(err);

  const errorConfig = ERROR_MAP[err.name] || ERROR_MAP[err.type];
  
  if (errorConfig) {
    return res.status(errorConfig.status).json({
      error: errorConfig.message,
      details: err.details || err.message
    });
  }

  if (err.status === 401 || err.status === 403 || err.status === 404 || err.status === 429) {
    return res.status(err.status).json({
      error: err.name || 'Request Error',
      message: err.message
    });
  }

  if (err.message?.includes('CORS')) {
    return res.status(403).json({ error: 'CORS Error', message: 'Origin blocked' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.name,
    message: status === 500 ? 'Unexpected system failure' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res) => {
  logError('404 Not Found', null, { path: req.path });
  
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} unavailable`,
    timestamp: new Date().toISOString()
  });
};

export const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

export const timeoutHandler = (timeout = 30_000) => (req, res, next) => {
  res.setTimeout(timeout, () => {
    if (!res.headersSent) {
      logWarn('Request Timeout', { path: req.path, ip: req.ip });
      res.status(408).json({ error: 'Timeout', message: 'Processing limit exceeded' });
    }
  });
  next();
};