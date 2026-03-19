/**
 * Endpoint: GET /api/metrics/analytics
 * Récupère les analytics détaillées
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { withApiHandler, validateApiKey } from '../_lib/util/with-api-handler';
import { ApiResponse, MetricsRequest, MetricsResponse } from '../_lib/types';

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

  // Paramètres de la requête
  const timeframe = (req.query.timeframe as string) || '24h';
  const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : undefined;

  if (!['1h', '24h', '7d', '30d'].includes(timeframe)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'invalid_timeframe',
        message: 'Timeframe must be one of: 1h, 24h, 7d, 30d',
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // En production, ici on interrogerait une base de données
    // Pour l'instant, génération de métriques simulées
    
    const metrics: MetricsResponse = {
      timeframe,
      totalVolume: '5420000000000000000000', // 5,420 ETH
      totalProfit: '13275500000000000000', // 13.275 ETH
      totalTrades: 847,
      successRate: 75.3,
      averageGasUsed: '285000',
      topStrategies: [
        {
          name: 'Arbitrage DEX Multi-Chaînes',
          trades: 412,
          profit: '7850000000000000000', // 7.85 ETH
        },
        {
          name: 'Liquidation Automatique Aave',
          trades: 285,
          profit: '3920000000000000000', // 3.92 ETH
        },
        {
          name: 'Arbitrage Tri-Angular',
          trades: 150,
          profit: '1505500000000000000', // 1.505 ETH
        },
      ],
    };

    const response: ApiResponse<MetricsResponse> = {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'fetch_failed',
        message: error instanceof Error ? error.message : 'Failed to fetch analytics',
      },
      timestamp: new Date().toISOString(),
    });
  }
});
