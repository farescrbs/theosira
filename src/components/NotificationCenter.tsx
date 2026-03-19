/**
 * Notification Center - Alerts pour transactions et événements
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, CheckCircle, AlertTriangle, Info, Settings } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface NotificationCenterProps {
  web3: any;
  GCard: any;
  STitle: any;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  txHash?: string;
}

export default function NotificationCenter({ web3, GCard, STitle }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Transaction confirmée',
      message: '0.1 ETH envoyé vers 0x742d...bEb6',
      timestamp: Date.now() - 300000,
      read: false,
      txHash: '0xabc123...',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Gas élevé détecté',
      message: 'Le gas actuel est 25% plus élevé que la moyenne',
      timestamp: Date.now() - 600000,
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouvelle approval détectée',
      message: 'Uniswap V3 Router peut maintenant dépenser vos USDC',
      timestamp: Date.now() - 900000,
      read: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    enableTransactionAlerts: true,
    enablePriceAlerts: false,
    enableGasAlerts: true,
    soundEnabled: false,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification supprimée");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("Toutes les notifications supprimées");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Toutes les notifications marquées comme lues");
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return 'À l\'instant';
  };

  // Simulate new notification on transaction
  useEffect(() => {
    if (web3.recentTransactions && web3.recentTransactions.length > 0) {
      const latestTx = web3.recentTransactions[0];
      
      if (latestTx.status === 'success' && settings.enableTransactionAlerts) {
        const exists = notifications.some(n => n.txHash === latestTx.hash);
        
        if (!exists) {
          const newNotif: Notification = {
            id: Date.now().toString(),
            type: 'success',
            title: 'Transaction confirmée',
            message: `${latestTx.value} ETH envoyé`,
            timestamp: Date.now(),
            read: false,
            txHash: latestTx.hash,
          };
          
          setNotifications(prev => [newNotif, ...prev]);
          
          if (settings.soundEnabled) {
            // Play notification sound
            console.log('🔔 Notification sound');
          }
        }
      }
    }
  }, [web3.recentTransactions]);

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-all"
      >
        <Bell className="w-5 h-5 text-white/70" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          >
            {unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-0 w-96 max-h-[600px] z-50"
          >
            <GCard>
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="text-sm font-bold text-white">
                    Notifications ({notifications.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={markAllAsRead}
                    className="flex-1 px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-[10px]"
                  >
                    Tout marquer lu
                  </button>
                  <button
                    onClick={clearAll}
                    className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm hover:bg-red-500/30 transition-all text-[10px]"
                  >
                    Tout supprimer
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-white/20" />
                    <p className="text-sm text-white/50">Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        notif.read
                          ? 'bg-black/20 border-white/5 opacity-60'
                          : 'bg-black/30 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getIcon(notif.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-xs font-semibold text-white">
                              {notif.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <X className="w-3 h-3 text-white/40" />
                            </button>
                          </div>
                          
                          <p className="text-[11px] text-white/60 mb-2">
                            {notif.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-white/40">
                              {formatTime(notif.timestamp)}
                            </span>
                            {notif.txHash && (
                              <a
                                href={`https://etherscan.io/tx/${notif.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[9px] text-[#d4af37] hover:text-yellow-300 underline"
                              >
                                Voir TX ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Settings */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <details className="group">
                  <summary className="flex items-center gap-2 text-xs text-white/70 cursor-pointer hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </summary>
                  
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                      <span>Alertes transactions</span>
                      <input
                        type="checkbox"
                        checked={settings.enableTransactionAlerts}
                        onChange={(e) => setSettings({ ...settings, enableTransactionAlerts: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                      <span>Alertes prix</span>
                      <input
                        type="checkbox"
                        checked={settings.enablePriceAlerts}
                        onChange={(e) => setSettings({ ...settings, enablePriceAlerts: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                      <span>Alertes gas</span>
                      <input
                        type="checkbox"
                        checked={settings.enableGasAlerts}
                        onChange={(e) => setSettings({ ...settings, enableGasAlerts: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs text-white/60 cursor-pointer">
                      <span>Son</span>
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                        className="w-4 h-4"
                      />
                    </label>
                  </div>
                </details>
              </div>
            </GCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
