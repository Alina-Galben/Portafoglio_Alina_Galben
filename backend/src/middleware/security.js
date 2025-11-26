import helmet from 'helmet';
import cors from 'cors';
import { logInfo, logWarn } from '../utils/logger.js';

const CSP_CONFIG = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};

const HSTS_CONFIG = {
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
};

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173', 'http://localhost:4173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000', 'http://localhost:3020',
  'http://127.0.0.1:5173', 'http://127.0.0.1:4173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176', 'http://127.0.0.1:3000', 'http://127.0.0.1:3020'
];

const isOriginAllowed = (origin) => {
  const whitelist = process.env.CORS_ORIGINS?.split(',') ?? DEFAULT_ALLOWED_ORIGINS;
  return whitelist.includes(origin);
};

export const configureSecurity = (app) => {
  app.use(helmet({
    contentSecurityPolicy: CSP_CONFIG,
    crossOriginEmbedderPolicy: false,
    hsts: HSTS_CONFIG
  }));

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        return callback(null, true);
      }
      
      logWarn('CORS Blocked', { origin });
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400
  }));

  app.use((_, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    });
    next();
  });

  logInfo('Security stack initialized');
};