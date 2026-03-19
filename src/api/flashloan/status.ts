/**
 * Endpoint: GET /api/flashloan/status/:orderId
 * Récupère le statut d'un ordre flash loan
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { withApiHandler, validateApiKey } from '../_lib/util/with-api-handler';
import { ApiResponse, FlashLoanResponse } from '../_lib/types';

export default withApiHandler(async function (
  req: VercelRequest,
  res: VercelResponse
) {
  // Validation de la méthode
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'method_not_allowed',
        message: 'Only GET requests are allowed',
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

  const { orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'invalid_request',
        message: 'Order ID is required',
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // En production, ici on interrogerait l'API CoW Protocol
    // Pour l'instant, simulation de la réponse
    
    // Simuler un statut (90% de succès)
    const isSuccess = Math.random() > 0.1;
    const status = isSuccess ? 'confirmed' : 'failed';
    
    const orderStatus: FlashLoanResponse = {
      orderId,
      status,
      txHash: isSuccess ? `0x${Math.random().toString(16).substring(2)}` : undefined,
      estimatedProfit: '1500000000000000000', // 1.5 ETH
      flashLoanFee: '50000000000000000', // 0.05 ETH
      gasEstimate: '300000',
    };

    const response: ApiResponse<FlashLoanResponse> = {
      success: true,
      data: orderStatus,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching order status:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'fetch_failed',
        message: error instanceof Error ? error.message : 'Failed to fetch order status',
      },
      timestamp: new Date().toISOString(),
    });
  }
});
