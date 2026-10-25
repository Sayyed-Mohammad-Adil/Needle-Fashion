import { Request, Response, NextFunction } from 'express';

// Middleware to sanitize input data
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key] as string);
      }
    }
  }

  // Sanitize body parameters
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }

  // Sanitize URL parameters
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeString(req.params[key]);
      }
    }
  }

  next();
};

// Function to sanitize strings
const sanitizeString = (str: string): string => {
  // Remove potentially dangerous characters
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Middleware for brute-force protection on login
export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // This would typically be implemented with a more sophisticated rate limiting solution
  // that tracks failed login attempts per IP or user
  next();
};

// Middleware to prevent NoSQL injection
export const preventNoSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  // Check query parameters
  if (req.query) {
    for (const key in req.query) {
      if (hasNoSQLKeywords(req.query[key])) {
        return res.status(400).json({ message: 'Invalid input detected' });
      }
    }
  }

  // Check body parameters
  if (req.body) {
    for (const key in req.body) {
      if (hasNoSQLKeywords(req.body[key])) {
        return res.status(400).json({ message: 'Invalid input detected' });
      }
    }
  }

  next();
};

// Function to check for NoSQL injection keywords
const hasNoSQLKeywords = (value: any): boolean => {
  if (typeof value !== 'string') return false;
  
  const keywords = ['$where', '$map', '$group', '$union', '$eval', '$function'];
  const lowerValue = value.toLowerCase();
  
  return keywords.some(keyword => lowerValue.includes(keyword));
};

// Middleware to add security headers
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
};

// Middleware to log suspicious activities
export const logSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  // Log suspicious patterns
  const suspiciousPatterns = [
    '<script',
    'javascript:',
    'onload=',
    'onerror=',
    'eval(',
    'document.cookie',
    'document.location'
  ];

  const requestData = JSON.stringify({
    url: req.url,
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip || req.connection.remoteAddress
  });

  for (const pattern of suspiciousPatterns) {
    if (requestData.toLowerCase().includes(pattern)) {
      console.warn(`Suspicious activity detected: ${pattern}`, {
        url: req.url,
        method: req.method,
        ip: req.ip || req.connection.remoteAddress,
        timestamp: new Date().toISOString()
      });
      // In a production environment, you might want to store this in a database
      break;
    }
  }

  next();
};

export default {
  sanitizeInput,
  loginRateLimiter,
  preventNoSQLInjection,
  securityHeaders,
  logSuspiciousActivity
};