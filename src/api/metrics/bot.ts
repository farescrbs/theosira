/**
 * Endpoint: GET /api/metrics/bot
 * Récupère les métriques du bot flash loan
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { withApiHandler, validateApiKey } from '../_lib/util/with-api-handler';
import { ApiResponse, BotStats } from '../_lib/types';

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

  try {
    // En production, ici on interrogerait une base de données
    // Pour l'instant, génération de métriques simulées
    
    const stats: BotStats = {
      totalProfit: 13275.50, // $13,275.50
      successRate: 75.3, // 75.3%
      totalTrades: 847,
      activeTrades: 2,
      uptime: 99.8, // 99.8%
      lastExecution: new Date().toISOString(),
    };

    const response: ApiResponse<BotStats> = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching bot metrics:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'fetch_failed',
        message: error instanceof Error ? error.message : 'Failed to fetch metrics',
      },
      timestamp: new Date().toISOString(),
    });
  }
});
