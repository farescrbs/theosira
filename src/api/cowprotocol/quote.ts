/**
 * Endpoint: POST /api/cowprotocol/quote
 * Obtenir un quote CoW Protocol
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { withApiHandler, validateApiKey } from '../_lib/util/with-api-handler';
import { ApiResponse } from '../_lib/types';

interface QuoteRequest {
  sellToken: string;
  buyToken: string;
  kind: 'sell' | 'buy';
  amount: string;
  validFor?: number;
  slippageBps?: number;
}

interface QuoteResponse {
  sellAmount: string;
  buyAmount: string;
  fee: string;
  validTo: number;
  quoteId: number;
}

export default withApiHandler(async function (
  req: VercelRequest,
  res: VercelResponse
) {
  // Validation de la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'method_not_allowed',
        message: 'Only POST requests are allowed',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Validation de l'API key
  if (!validateApiKey(req)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'unauthorized',
        message: 'Invalid API key',
      },
      timestamp: new Date().toISOString(),
    });
  }

  const body = req.body as QuoteRequest;

  // Validation du body
  if (!body.sellToken || !body.buyToken || !body.kind || !body.amount) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'invalid_request',
        message: 'Missing required fields: sellToken, buyToken, kind, amount',
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // En production, appel réel à l'API CoW Protocol
    // https://api.cow.fi/mainnet/api/v1/quote
    
    const COW_API_BASE = process.env.COW_API_BASE || 'https://api.cow.fi/mainnet';
    
    // Simuler un quote pour l'instant
    const amountBigInt = BigInt(body.amount);
    const slippageBps = body.slippageBps || 50; // 0.5% par défaut
    const slippage = (amountBigInt * BigInt(slippageBps)) / BigInt(10000);
    
    const quote: QuoteResponse = {
      sellAmount: body.kind === 'sell' ? body.amount : (amountBigInt + slippage).toString(),
      buyAmount: body.kind === 'buy' ? body.amount : (amountBigInt - slippage).toString(),
      fee: '10000000000000000', // 0.01 ETH
      validTo: Math.floor(Date.now() / 1000) + (body.validFor || 1800), // 30 min par défaut
      quoteId: Math.floor(Math.random() * 1000000),
    };

    const response: ApiResponse<QuoteResponse> = {
      success: true,
      data: quote,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error getting quote:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'quote_failed',
        message: error instanceof Error ? error.message : 'Failed to get quote',
      },
      timestamp: new Date().toISOString(),
    });
  }
});
