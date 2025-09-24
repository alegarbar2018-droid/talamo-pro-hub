/**
 * Security Headers Middleware
 * 
 * Apply security headers to all responses.
 * Usage: Import and apply in your server/adapter configuration.
 */

export const SECURITY_HEADERS = {
  // Content Security Policy - Restrictive but functional
  'Content-Security-Policy': [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "script-src 'self' 'unsafe-inline' https://supabase.co https://*.supabase.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://supabase.co https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),

  // Frame protection
  'X-Frame-Options': 'DENY',
  
  // MIME type sniffing protection
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // XSS Protection (legacy but good defense in depth)
  'X-XSS-Protection': '1; mode=block',
  
  // Permissions Policy (restrict features)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()', 
    'geolocation=()',
    'payment=()',
    'usb=()'
  ].join(', ')
};

// HSTS - Only enable if you have stable HTTPS
export const HSTS_HEADER = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(response, options = {}) {
  const headers = new Headers(response.headers);
  
  // Apply all security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Apply HSTS only if HTTPS is confirmed
  if (options.httpsOnly) {
    headers.set('Strict-Transport-Security', HSTS_HEADER['Strict-Transport-Security']);
  }
  
  // Add request tracking headers
  if (options.requestId) {
    headers.set('X-Request-ID', options.requestId);
  }
  
  if (options.correlationId) {
    headers.set('X-Correlation-ID', options.correlationId);
  }
  
  // Vary header for CORS
  headers.set('Vary', 'Origin, Accept-Encoding');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

/**
 * Middleware for Express-like servers
 */
export function securityHeadersMiddleware(req, res, next) {
  // Generate request ID
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  
  // Apply headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('Vary', 'Origin, Accept-Encoding');
  
  // Only add HSTS if HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', HSTS_HEADER['Strict-Transport-Security']);
  }
  
  next();
}

/**
 * CORS configuration with security
 */
export function createSecureCORS(allowedOrigins = []) {
  return {
    origin: function(origin, callback) {
      // Allow same-origin requests (origin will be undefined)
      if (!origin) return callback(null, true);
      
      // Check against allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Reject with security error
      const err = new Error(`CORS: Origin ${origin} not allowed`);
      err.status = 403;
      callback(err, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 
      'Authorization', 'X-Idempotency-Key', 'X-Request-ID'
    ],
    exposedHeaders: ['X-Request-ID', 'X-Correlation-ID', 'Retry-After'],
    maxAge: 86400 // 24 hours
  };
}

/**
 * Secure cookie configuration
 */
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // Only over HTTPS
  sameSite: 'Lax', // or 'Strict' for higher security
  maxAge: 3600000, // 1 hour
  path: '/'
};

/**
 * Example usage in Vite dev server
 */
export function viteSecurityPlugin() {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Skip for HMR and dev assets
        if (req.url?.includes('/@vite/') || req.url?.includes('/__vite')) {
          return next();
        }
        
        securityHeadersMiddleware(req, res, next);
      });
    }
  };
}