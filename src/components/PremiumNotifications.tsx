import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X, TrendingUp, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'profit' | 'trade';
  title: string;
  message: string;
  timestamp: Date;
  value?: string;
}

export function PremiumNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simuler des notifications en temps réel
    const notificationTypes: Omit<Notification, 'id' | 'timestamp'>[] = [
      {
        type: 'profit',
        title: 'Flash Loan Exécuté',
        message: 'Arbitrage DEX réussi sur Uniswap/Sushiswap',
        value: '+$2,847.32',
      },
      {
        type: 'trade',
        title: 'Nouveau Trade',
        message: 'Position ouverte ETH/USDT avec ratio optimal',
        value: '$15,000',
      },
      {
        type: 'success',
        title: 'Opportunité Détectée',
        message: 'MEV front-running identifié sur transaction haute valeur',
      },
      {
        type: 'info',
        title: 'Mise à Jour Stratégie',
        message: 'IA Maître a optimisé les paramètres de trading',
      },
      {
        type: 'warning',
        title: 'Alerte Gas',
        message: 'Prix du gas élevé - Ajustement automatique activé',
      },
    ];

    const interval = setInterval(() => {
      const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const newNotification: Notification = {
        ...randomNotif,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 8000);

    // Ajouter une notification initiale
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'success',
          title: 'Système Activé',
          message: 'IA Maître THESORIA opérationnelle',
          timestamp: new Date(),
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      case 'profit':
        return TrendingUp;
      case 'trade':
        return Zap;
      default:
        return Info;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: 'text-green-400',
          glow: '0 0 20px rgba(34, 197, 94, 0.3)',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: 'text-yellow-400',
          glow: '0 0 20px rgba(234, 179, 8, 0.3)',
        };
      case 'profit':
        return {
          bg: 'bg-[#d4af37]/10',
          border: 'border-[#d4af37]/30',
          icon: 'text-[#d4af37]',
          glow: '0 0 20px rgba(212, 175, 55, 0.4)',
        };
      case 'trade':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
          glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        };
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/10',
          icon: 'text-white',
          glow: '0 0 20px rgba(255, 255, 255, 0.2)',
        };
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9998] w-96 max-w-[calc(100vw-2rem)] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => {
          const Icon = getIcon(notification.type);
          const colors = getColors(notification.type);

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                boxShadow: colors.glow,
              }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 40,
              }}
              className={`
                mb-3 backdrop-blur-xl rounded-xl p-4
                ${colors.bg} border ${colors.border}
                pointer-events-auto
              `}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icône animée */}
                <motion.div
                  className={`flex-shrink-0 ${colors.icon}`}
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-white" style={{ fontSize: '0.875rem' }}>
                      {notification.title}
                    </p>
                    
                    {notification.value && (
                      <motion.span
                        className="text-[#d4af37] ml-2"
                        style={{ fontSize: '0.875rem' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {notification.value}
                      </motion.span>
                    )}
                  </div>

                  <p className="text-white/60 mb-2" style={{ fontSize: '0.75rem' }}>
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-white/40" style={{ fontSize: '0.65rem' }}>
                      {notification.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* Barre de progression pour auto-dismiss */}
                    <div className="flex-1 mx-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${colors.icon.replace('text-', 'bg-')}`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 8, ease: "linear" }}
                        onAnimationComplete={() => removeNotification(notification.id)}
                      />
                    </div>
                  </div>
                </div>

                {/* Bouton fermer */}
                <motion.button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 text-white/40 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Effet de brillance au survol */}
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-xl"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default PremiumNotifications;
