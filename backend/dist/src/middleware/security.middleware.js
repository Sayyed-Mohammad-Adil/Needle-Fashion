"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSuspiciousActivity = exports.securityHeaders = exports.preventNoSQLInjection = exports.loginRateLimiter = exports.sanitizeInput = void 0;
// Middleware to sanitize input data
const sanitizeInput = (req, res, next) => {
    // Sanitize query parameters
    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeString(req.query[key]);
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
exports.sanitizeInput = sanitizeInput;
// Function to sanitize strings
const sanitizeString = (str) => {
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
const loginRateLimiter = (req, res, next) => {
    // This would typically be implemented with a more sophisticated rate limiting solution
    // that tracks failed login attempts per IP or user
    next();
};
exports.loginRateLimiter = loginRateLimiter;
// Middleware to prevent NoSQL injection
const preventNoSQLInjection = (req, res, next) => {
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
exports.preventNoSQLInjection = preventNoSQLInjection;
// Function to check for NoSQL injection keywords
const hasNoSQLKeywords = (value) => {
    if (typeof value !== 'string')
        return false;
    const keywords = ['$where', '$map', '$group', '$union', '$eval', '$function'];
    const lowerValue = value.toLowerCase();
    return keywords.some(keyword => lowerValue.includes(keyword));
};
// Middleware to add security headers
const securityHeaders = (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
};
exports.securityHeaders = securityHeaders;
// Middleware to log suspicious activities
const logSuspiciousActivity = (req, res, next) => {
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
exports.logSuspiciousActivity = logSuspiciousActivity;
exports.default = {
    sanitizeInput: exports.sanitizeInput,
    loginRateLimiter: exports.loginRateLimiter,
    preventNoSQLInjection: exports.preventNoSQLInjection,
    securityHeaders: exports.securityHeaders,
    logSuspiciousActivity: exports.logSuspiciousActivity
};
//# sourceMappingURL=security.middleware.js.map