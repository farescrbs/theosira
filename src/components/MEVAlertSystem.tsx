import { useState, useEffect } from "react";
import { Bell, TrendingUp, AlertTriangle, DollarSign, Zap, X, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface Alert {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface MEVAlertSystemProps {
  currentOpportunity?: any;
  recentTrades?: any[];
}

export function MEVAlertSystem({ currentOpportunity, recentTrades = [] }: MEVAlertSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Créer une alerte quand une nouvelle opportunité arrive
    if (currentOpportunity) {
      addAlert({
        type: 'opportunity',
        title: 'Nouvelle Opportunité Détectée',
        message: `${currentOpportunity.buy_dex} → ${currentOpportunity.sell_dex}`,
        amount: currentOpportunity.profit_usd,
        priority: currentOpportunity.profit_usd > 200 ? 'critical' : currentOpportunity.profit_usd > 100 ? 'high' : 'medium'
      });
    }
  }, [currentOpportunity]);

  useEffect(() => {
    // Créer des alertes pour les trades réussis
    if (recentTrades.length > 0) {
      const latestTrade = recentTrades[0];
      if (latestTrade.success && latestTrade.profit) {
        addAlert({
          type: 'success',
          title: 'Trade Exécuté avec Succès',
          message: `Profit réalisé: $${latestTrade.profit.toFixed(2)}`,
          amount: latestTrade.profit,
          priority: latestTrade.profit > 500 ? 'critical' : latestTrade.profit > 200 ? 'high' : 'medium'
        });
      } else if (!latestTrade.success) {
        addAlert({
          type: 'warning',
          title: 'Trade Échoué',
          message: latestTrade.error || 'Erreur inconnue',
          priority: 'medium'
        });
      }
    }
  }, [recentTrades.length]);

  useEffect(() => {
    // Générer des alertes de démonstration
    const demoAlerts: Partial<Alert>[] = [
      {
        type: 'opportunity',
        title: 'Arbitrage Uniswap-Sushiswap',
        message: 'Spread de 2.4% détecté sur WETH/USDC',
        amount: 185,
        priority: 'high'
      },
      {
        type: 'info',
        title: 'Connexion Backend Établie',
        message: 'Orchestrateur MEV opérationnel',
        priority: 'low'
      },
      {
        type: 'warning',
        title: 'Gas Price Élevé',
        message: 'Gas actuel: 250 gwei - Attente recommandée',
        priority: 'medium'
      }
    ];

    const initialAlerts = demoAlerts.map((alert, index) => ({
      id: `demo-${index}`,
      type: alert.type as Alert['type'],
      title: alert.title!,
      message: alert.message!,
      amount: alert.amount,
      timestamp: new Date(Date.now() - index * 300000),
      read: false,
      priority: alert.priority as Alert['priority']
    }));

    setAlerts(initialAlerts);
  }, []);

  useEffect(() => {
    setUnreadCount(alerts.filter(a => !a.read).length);
  }, [alerts]);

  const addAlert = (alertData: Partial<Alert>) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: alertData.type || 'info',
      title: alertData.title || '',
      message: alertData.message || '',
      amount: alertData.amount,
      timestamp: new Date(),
      read: false,
      priority: alertData.priority || 'low'
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Garder max 50 alertes
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'warning': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'success': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="border-red-500/30 bg-red-500/10 text-red-400 text-xs">CRITIQUE</Badge>;
      case 'high':
        return <Badge className="border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs">HAUTE</Badge>;
      case 'medium':
        return <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs">MOYENNE</Badge>;
      default:
        return <Badge className="border-white/20 bg-white/5 text-white/60 text-xs">BASSE</Badge>;
    }
  };

  return (
    <div className="relative">
      {/* Alert Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
          >
            <span className="text-xs text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Alert Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-[480px] max-h-[600px] rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20">
                    <Bell className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Alertes MEV
                    </h3>
                    <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Tout marquer comme lu
                </Button>
                <Button
                  size="sm"
                  onClick={clearAll}
                  disabled={alerts.length === 0}
                  className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Tout effacer
                </Button>
              </div>
            </div>

            {/* Alerts List */}
            <div className="overflow-y-auto max-h-[450px]">
              {alerts.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Aucune alerte
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-white/5 transition-all cursor-pointer ${
                          !alert.read ? 'bg-white/5' : ''
                        }`}
                        onClick={() => markAsRead(alert.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg border ${getAlertColor(alert.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-sm text-white truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {alert.title}
                              </h4>
                              {getPriorityBadge(alert.priority)}
                            </div>
                            
                            <p className="text-sm text-white/60 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {alert.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {alert.timestamp.toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              
                              {alert.amount && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3 text-green-400" />
                                  <span className="text-sm text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    ${alert.amount.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAlert(alert.id);
                            }}
                            className="p-1 rounded hover:bg-white/10 transition-all"
                          >
                            <X className="w-4 h-4 text-white/40" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
