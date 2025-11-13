import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'portfolio-backend',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Sanitize sensitive data from logs
const sanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
};

// Enhanced logging methods
export const logInfo = (message, meta = {}) => {
  logger.info(message, sanitize(meta));
};

export const logError = (message, error = null, meta = {}) => {
  const errorMeta = error ? { 
    error: error.message, 
    stack: error.stack,
    ...meta 
  } : meta;
  
  logger.error(message, sanitize(errorMeta));
};

export const logWarn = (message, meta = {}) => {
  logger.warn(message, sanitize(meta));
};

export const logDebug = (message, meta = {}) => {
  logger.debug(message, sanitize(meta));
};

export default logger;