// Security middleware for the portfolio site

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map();

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS, or TRACE methods
    if (['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(req.method)) {
        return next();
    }

    // Get CSRF token from headers or body
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    
    // Verify CSRF token
    if (!csrfToken || !verifyCsrfToken(csrfToken, req.session.csrfSecret)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    
    next();
};

// Rate limiting middleware
const rateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // limit each IP to 100 requests per windowMs
        message = 'Too many requests, please try again later.',
        statusCode = 429
    } = options;

    return (req, res, next) => {
        const now = Date.now();
        const ip = req.ip || req.connection.remoteAddress;
        const windowStart = now - windowMs;

        // Clean up old entries
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.timestamp < windowStart) {
                rateLimitStore.delete(key);
            }
        }

        // Get or create rate limit entry
        let entry = rateLimitStore.get(ip) || { count: 0, timestamp: now };
        
        // Check if window has passed, reset if it has
        if (now - entry.timestamp > windowMs) {
            entry = { count: 0, timestamp: now };
        }

        // Check rate limit
        if (entry.count >= max) {
            const retryAfter = Math.ceil((entry.timestamp + windowMs - now) / 1000);
            res.set('Retry-After', String(retryAfter));
            return res.status(statusCode).json({ error: message });
        }

        // Increment and update the entry
        entry.count++;
        entry.timestamp = now;
        rateLimitStore.set(ip, entry);

        // Set rate limit headers
        res.set({
            'X-RateLimit-Limit': max,
            'X-RateLimit-Remaining': Math.max(0, max - entry.count),
            'X-RateLimit-Reset': Math.ceil((entry.timestamp + windowMs) / 1000)
        });

        next();
    };
};

// Helper function to verify CSRF token
function verifyCsrfToken(token, secret) {
    // In a real application, you would verify the token against the secret
    // This is a simplified example
    return token && secret && token === secret;
}

// Generate CSRF token
function generateCsrfToken(secret) {
    // In a real application, use a proper token generation method
    // This is a simplified example
    return require('crypto').createHash('sha256')
        .update(secret + Date.now())
        .digest('hex');
}

module.exports = {
    csrfProtection,
    rateLimiter,
    generateCsrfToken
};
