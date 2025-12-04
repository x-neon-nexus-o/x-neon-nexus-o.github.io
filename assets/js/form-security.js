// CSRF Token Management
class CSRFProtection {
    constructor() {
        this.token = this.generateToken();
        this.tokenName = '_csrf';
        this.tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours
        this.storageKey = 'csrf_token';
        
        // Initialize CSRF token in localStorage if not exists or expired
        this.initToken();
    }

    generateToken() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    initToken() {
        const storedToken = localStorage.getItem(this.storageKey);
        const storedTime = localStorage.getItem(`${this.storageKey}_time`);
        const now = Date.now();
        
        if (!storedToken || !storedTime || (now - parseInt(storedTime, 10)) > this.tokenExpiry) {
            // Generate new token if none exists or if expired
            this.token = this.generateToken();
            localStorage.setItem(this.storageKey, this.token);
            localStorage.setItem(`${this.storageKey}_time`, now.toString());
        } else {
            this.token = storedToken;
        }
    }

    getToken() {
        return this.token;
    }

    validateToken(token) {
        const storedToken = localStorage.getItem(this.storageKey);
        const storedTime = localStorage.getItem(`${this.storageKey}_time`);
        
        if (!storedToken || !storedTime) return false;
        
        // Check if token is expired
        if ((Date.now() - parseInt(storedTime, 10)) > this.tokenExpiry) {
            this.initToken(); // Refresh token if expired
            return false;
        }
        
        return token === storedToken;
    }
}

// Rate Limiting
class RateLimiter {
    constructor(limit, windowMs) {
        this.limit = limit || 5; // Default: 5 requests
        this.windowMs = windowMs || 15 * 60 * 1000; // Default: 15 minutes
        this.requests = new Map();
    }

    checkLimit(ip) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        
        // Clean up old entries
        for (const [key, entry] of this.requests.entries()) {
            if (entry.timestamp < windowStart) {
                this.requests.delete(key);
            }
        }

        // Get or create rate limit entry
        let entry = this.requests.get(ip) || { count: 0, timestamp: now };
        
        // Check if window has passed, reset if it has
        if (now - entry.timestamp > this.windowMs) {
            entry = { count: 0, timestamp: now };
        }

        // Increment and update the entry
        entry.count++;
        entry.timestamp = now;
        this.requests.set(ip, entry);

        // Check if limit exceeded
        if (entry.count > this.limit) {
            return {
                allowed: false,
                remaining: 0,
                reset: entry.timestamp + this.windowMs,
                retryAfter: Math.ceil((entry.timestamp + this.windowMs - now) / 1000)
            };
        }

        return {
            allowed: true,
            remaining: Math.max(0, this.limit - entry.count),
            reset: entry.timestamp + this.windowMs
        };
    }
}

// Initialize CSRF protection and rate limiting
const csrf = new CSRFProtection();
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes

// Add CSRF token to all forms
document.addEventListener('DOMContentLoaded', () => {
    // Add CSRF token to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrf.getToken();
        form.appendChild(csrfInput);

        // Add rate limiting to form submissions
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get client IP (this is a simple method, in production use a proper IP detection)
            const ip = await fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => data.ip)
                .catch(() => 'unknown');
            
            // Check rate limit
            const rateLimit = rateLimiter.checkLimit(ip);
            if (!rateLimit.allowed) {
                alert(`Too many requests. Please try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes.`);
                return false;
            }
            
            // Validate CSRF token
            const formData = new FormData(form);
            const formToken = formData.get('_csrf');
            
            if (!csrf.validateToken(formToken)) {
                alert('Invalid request. Please refresh the page and try again.');
                return false;
            }
            
            // If all validations pass, submit the form
            form.submit();
        });
    });
});

// Expose for testing
window.CSRFProtection = CSRFProtection;
window.RateLimiter = RateLimiter;
