/**
 * Endpoint: GET /api/flashloan/opportunities
 * Récupère les opportunités d'arbitrage disponibles
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { withApiHandler, validateApiKey } from '../_lib/util/with-api-handler';
import { ApiResponse, OpportunityRequest, Opportunity } from '../_lib/types';

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
  const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : undefined;
  const minProfitBps = req.query.minProfitBps ? parseInt(req.query.minProfitBps as string) : 50;
  const strategies = req.query.strategies 
    ? (req.query.strategies as string).split(',') 
    : ['dex', 'liquidation', 'triangular', 'mev'];

  try {
    // En production, ici on scannerait vraiment les DEX et protocoles
    // Pour l'instant, génération d'opportunités simulées
    
    const opportunities: Opportunity[] = [];
    const tokens = [
      { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'WETH' },
      { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USDC' },
      { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'DAI' },
      { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'USDT' },
    ];

    const dexes = ['Uniswap V3', 'SushiSwap', 'Curve', 'Balancer'];
    
    // Générer 5-10 opportunités aléatoires
    const numOpportunities = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < numOpportunities; i++) {
      const fromToken = tokens[Math.floor(Math.random() * tokens.length)];
      let toToken = tokens[Math.floor(Math.random() * tokens.length)];
      
      // Assurer que from !== to
      while (toToken.address === fromToken.address) {
        toToken = tokens[Math.floor(Math.random() * tokens.length)];
      }
      
      const strategy = strategies[Math.floor(Math.random() * strategies.length)] as any;
      const profitPercentage = Math.random() * 3 + 0.3; // 0.3% - 3.3%
      
      // Filtrer par minProfitBps
      if ((profitPercentage * 100) < (minProfitBps / 100)) {
        continue;
      }
      
      const fromDex = dexes[Math.floor(Math.random() * dexes.length)];
      let toDex = dexes[Math.floor(Math.random() * dexes.length)];
      while (toDex === fromDex) {
        toDex = dexes[Math.floor(Math.random() * dexes.length)];
      }
      
      opportunities.push({
        id: `opp-${Date.now()}-${i}`,
        type: strategy,
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromDex,
        toDex,
        profitPercentage,
        estimatedProfit: Math.floor(Math.random() * 5000) + 500,
        flashLoanRequired: profitPercentage > 1.5,
        chainId: chainId || 1,
        timestamp: Date.now(),
      });
    }

    // Trier par profit décroissant
    opportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);

    const response: ApiResponse<Opportunity[]> = {
      success: true,
      data: opportunities,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'fetch_failed',
        message: error instanceof Error ? error.message : 'Failed to fetch opportunities',
      },
      timestamp: new Date().toISOString(),
    });
  }
});
