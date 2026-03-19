import { useState, useEffect } from "react";
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Badge } from "./ui/badge";

interface RiskMetrics {
  gasRisk: number;
  liquidityRisk: number;
  competitionLevel: number;
  slippageRisk: number;
  overallRisk: number;
  recommendation: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface MEVRiskAnalyzerProps {
  currentOpportunity?: any;
  gasPrice?: number;
  networkCongestion?: number;
}

export function MEVRiskAnalyzer({ currentOpportunity, gasPrice = 50, networkCongestion = 50 }: MEVRiskAnalyzerProps) {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    gasRisk: 0,
    liquidityRisk: 0,
    competitionLevel: 0,
    slippageRisk: 0,
    overallRisk: 0,
    recommendation: 'LOW'
  });

  useEffect(() => {
    calculateRisk();
  }, [currentOpportunity, gasPrice, networkCongestion]);

  const calculateRisk = () => {
    // Calcul du risque gas (basé sur prix gas actuel)
    const gasRisk = Math.min(100, (gasPrice / 300) * 100);
    
    // Calcul du risque liquidité (basé sur montant de l'opportunité)
    const liquidityRisk = currentOpportunity 
      ? Math.min(100, (1 / (currentOpportunity.amount || 1)) * 1000)
      : 50;
    
    // Niveau de compétition (basé sur congestion réseau)
    const competitionLevel = Math.min(100, networkCongestion);
    
    // Risque de slippage (basé sur spread)
    const slippageRisk = currentOpportunity
      ? Math.max(0, 100 - (currentOpportunity.spread_pct || 0) * 10)
      : 50;
    
    // Risque global (moyenne pondérée)
    const overallRisk = (
      gasRisk * 0.3 +
      liquidityRisk * 0.2 +
      competitionLevel * 0.25 +
      slippageRisk * 0.25
    );

    let recommendation: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (overallRisk < 25) recommendation = 'LOW';
    else if (overallRisk < 50) recommendation = 'MEDIUM';
    else if (overallRisk < 75) recommendation = 'HIGH';
    else recommendation = 'CRITICAL';

    setRiskMetrics({
      gasRisk,
      liquidityRisk,
      competitionLevel,
      slippageRisk,
      overallRisk,
      recommendation
    });
  };

  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'text-green-400';
    if (risk < 50) return 'text-yellow-400';
    if (risk < 75) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRecommendationStyle = () => {
    switch (riskMetrics.recommendation) {
      case 'LOW':
        return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'MEDIUM':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'HIGH':
        return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'CRITICAL':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
    }
  };

  return (
    <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
            <Shield className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Analyse de Risque
            </h3>
            <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Évaluation en temps réel
            </p>
          </div>
        </div>
        
        <Badge className={`px-6 py-2 text-base ${getRecommendationStyle()}`}>
          {riskMetrics.recommendation}
        </Badge>
      </div>

      {/* Risk Metrics */}
      <div className="space-y-6">
        {/* Gas Risk */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Risque Gas
            </span>
            <span className={`${getRiskColor(riskMetrics.gasRisk)}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {riskMetrics.gasRisk.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                riskMetrics.gasRisk < 25 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                riskMetrics.gasRisk < 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                riskMetrics.gasRisk < 75 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${riskMetrics.gasRisk}%` }}
            />
          </div>
        </div>

        {/* Liquidity Risk */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Risque Liquidité
            </span>
            <span className={`${getRiskColor(riskMetrics.liquidityRisk)}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {riskMetrics.liquidityRisk.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                riskMetrics.liquidityRisk < 25 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                riskMetrics.liquidityRisk < 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                riskMetrics.liquidityRisk < 75 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${riskMetrics.liquidityRisk}%` }}
            />
          </div>
        </div>

        {/* Competition Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Niveau de Compétition
            </span>
            <span className={`${getRiskColor(riskMetrics.competitionLevel)}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {riskMetrics.competitionLevel.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                riskMetrics.competitionLevel < 25 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                riskMetrics.competitionLevel < 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                riskMetrics.competitionLevel < 75 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${riskMetrics.competitionLevel}%` }}
            />
          </div>
        </div>

        {/* Slippage Risk */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Risque de Slippage
            </span>
            <span className={`${getRiskColor(riskMetrics.slippageRisk)}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {riskMetrics.slippageRisk.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                riskMetrics.slippageRisk < 25 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                riskMetrics.slippageRisk < 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                riskMetrics.slippageRisk < 75 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${riskMetrics.slippageRisk}%` }}
            />
          </div>
        </div>

        {/* Overall Risk - Plus grand */}
        <div className="pt-6 mt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Risque Global
            </span>
            <span className={`text-2xl ${getRiskColor(riskMetrics.overallRisk)}`} style={{ fontFamily: 'Playfair Display, serif' }}>
              {riskMetrics.overallRisk.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                riskMetrics.overallRisk < 25 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                riskMetrics.overallRisk < 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                riskMetrics.overallRisk < 75 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${riskMetrics.overallRisk}%` }}
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="pt-6 space-y-3">
          {riskMetrics.recommendation === 'LOW' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Conditions optimales pour l'exécution
                </p>
                <p className="text-xs text-green-400/60 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Risque minimal détecté - Opportunité recommandée
                </p>
              </div>
            </div>
          )}
          
          {riskMetrics.recommendation === 'MEDIUM' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <Activity className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Conditions acceptables - Surveillance recommandée
                </p>
                <p className="text-xs text-yellow-400/60 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Exécution possible avec attention accrue
                </p>
              </div>
            </div>
          )}
          
          {riskMetrics.recommendation === 'HIGH' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-orange-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Risque élevé - Prudence requise
                </p>
                <p className="text-xs text-orange-400/60 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Évaluer soigneusement avant exécution
                </p>
              </div>
            </div>
          )}
          
          {riskMetrics.recommendation === 'CRITICAL' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <TrendingDown className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Risque critique - Exécution déconseillée
                </p>
                <p className="text-xs text-red-400/60 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Attendre des conditions plus favorables
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
