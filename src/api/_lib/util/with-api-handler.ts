/**
 * API Handler Wrapper pour THESORIA
 * Gère les CORS, erreurs, et logging pour tous les endpoints
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<any>;

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export function withApiHandler(handler: Handler): Handler {
  return async (req: VercelRequest, res: VercelResponse) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Accept, Content-Type, X-API-Key'
    );

    // Handle OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(200).json({});
    }

    try {
      const startTime = Date.now();
      const result = await handler(req, res);
      const duration = Date.now() - startTime;

      // Log request
      console.log({
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        status: res.statusCode,
      });

      return result;
    } catch (error) {
      console.error('API Error:', error);

      const errorResponse: ErrorResponse = {
        error: {
          code: 'internal_error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
      };

      return res.status(500).json(errorResponse);
    }
  };
}

/**
 * Validate API Key
 */
export function validateApiKey(req: VercelRequest): boolean {
  const apiKey = req.headers['x-api-key'] as string;
  const validKey = process.env.API_KEY;

  if (!validKey) {
    console.warn('API_KEY not configured in environment');
    return true; // Allow in development
  }

  return apiKey === validKey;
}

/**
 * Rate Limiting (simple in-memory)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
