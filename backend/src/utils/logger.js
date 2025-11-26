import winston from 'winston';

const { 
  LOG_LEVEL = 'info', 
  NODE_ENV = 'development', 
  npm_package_version = '1.0.0' 
} = process.env;

const SENSITIVE_KEYS = new Set(['password', 'token', 'secret', 'key', 'authorization']);

const redact = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;
  
  return Object.entries(payload).reduce((acc, [key, val]) => ({
    ...acc,
    [key]: SENSITIVE_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : val
  }), {});
};

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'portfolio-backend', version: npm_package_version },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5_242_880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5_242_880, maxFiles: 5 }),
    ...(NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple())
      })
    ] : [])
  ]
});

export const logInfo = (msg, meta = {}) => logger.info(msg, redact(meta));

export const logWarn = (msg, meta = {}) => logger.warn(msg, redact(meta));

export const logDebug = (msg, meta = {}) => logger.debug(msg, redact(meta));

export const logError = (msg, err, meta = {}) => {
  const context = err instanceof Error 
    ? { ...meta, error: err.message, stack: err.stack }
    : { ...meta, ...err };
    
  logger.error(msg, redact(context));
};

export default logger;