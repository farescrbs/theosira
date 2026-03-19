import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Activity, Zap, Target, Clock } from 'lucide-react';
import { CounterAnimation } from './CounterAnimation';

interface Stat {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: any;
  trend: number;
  color: string;
}

export function RealtimeStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      id: 'profit',
      label: 'Profit Total',
      value: 0,
      prefix: '$',
      icon: DollarSign,
      trend: 0,
      color: '#d4af37',
    },
    {
      id: 'trades',
      label: 'Trades Actifs',
      value: 0,
      icon: Activity,
      trend: 0,
      color: '#f0e68c',
    },
    {
      id: 'apy',
      label: 'APY Moyen',
      value: 0,
      suffix: '%',
      icon: TrendingUp,
      trend: 0,
      color: '#b8941e',
    },
    {
      id: 'flashloans',
      label: 'Flash Loans 24h',
      value: 0,
      icon: Zap,
      trend: 0,
      color: '#ffd700',
    },
    {
      id: 'success',
      label: 'Taux de Réussite',
      value: 0,
      suffix: '%',
      icon: Target,
      trend: 0,
      color: '#d4af37',
    },
    {
      id: 'uptime',
      label: 'Uptime',
      value: 99.9,
      suffix: '%',
      icon: Clock,
      trend: 0,
      color: '#f0e68c',
    },
  ]);

  useEffect(() => {
    // Simuler des mises à jour en temps réel
    const interval = setInterval(() => {
      setStats(prevStats =>
        prevStats.map(stat => {
          const change = (Math.random() - 0.5) * 10;
          const newValue = Math.max(0, stat.value + change);
          
          return {
            ...stat,
            value: newValue,
            trend: change,
          };
        })
      );
    }, 3000);

    // Initialiser avec des valeurs
    setTimeout(() => {
      setStats([
        {
          id: 'profit',
          label: 'Profit Total',
          value: 45678.92,
          prefix: '$',
          icon: DollarSign,
          trend: 12.5,
          color: '#d4af37',
        },
        {
          id: 'trades',
          label: 'Trades Actifs',
          value: 847,
          icon: Activity,
          trend: 8.3,
          color: '#f0e68c',
        },
        {
          id: 'apy',
          label: 'APY Moyen',
          value: 234.5,
          suffix: '%',
          icon: TrendingUp,
          trend: 15.2,
          color: '#b8941e',
        },
        {
          id: 'flashloans',
          label: 'Flash Loans 24h',
          value: 1547,
          icon: Zap,
          trend: 22.7,
          color: '#ffd700',
        },
        {
          id: 'success',
          label: 'Taux de Réussite',
          value: 94.8,
          suffix: '%',
          icon: Target,
          trend: 3.2,
          color: '#d4af37',
        },
        {
          id: 'uptime',
          label: 'Uptime',
          value: 99.9,
          suffix: '%',
          icon: Clock,
          trend: 0.1,
          color: '#f0e68c',
        },
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 gold-gradient-text">
            Statistiques en Temps Réel
          </h2>
          <p className="text-white/60">
            Performance de l'IA Maître THESORIA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="ultra-glass rounded-2xl p-6 group hover:scale-105 transition-transform duration-300"
              whileHover={{
                boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)`,
                    border: `1px solid ${stat.color}40`,
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>

                {stat.trend !== 0 && (
                  <motion.div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      stat.trend > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <TrendingUp
                      className={`w-3 h-3 ${
                        stat.trend > 0 ? 'text-green-400' : 'text-red-400 rotate-180'
                      }`}
                    />
                    <span
                      className={`${
                        stat.trend > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {Math.abs(stat.trend).toFixed(1)}%
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-white/60" style={{ fontSize: '0.875rem' }}>
                  {stat.label}
                </p>
                
                <div className="flex items-baseline gap-1">
                  <CounterAnimation
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.id === 'profit' ? 2 : stat.id === 'apy' || stat.id === 'success' || stat.id === 'uptime' ? 1 : 0}
                    className="gold-gradient-text"
                    style={{ fontSize: '2rem' }}
                  />
                </div>
              </div>

              {/* Barre de progression animée */}
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                  }}
                  initial={{ width: '0%' }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>

              {/* Indicateur de mise à jour en temps réel */}
              <div className="mt-4 flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-white/40" style={{ fontSize: '0.75rem' }}>
                  Mise à jour en direct
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Graphique de tendance global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 ultra-glass rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#d4af37] mb-2">Performance Globale</h3>
              <p className="text-white/60" style={{ fontSize: '0.875rem' }}>
                Évolution sur les dernières 24 heures
              </p>
            </div>
            <motion.div
              className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30"
              animate={{
                boxShadow: ['0 0 0px rgba(34, 197, 94, 0)', '0 0 20px rgba(34, 197, 94, 0.3)', '0 0 0px rgba(34, 197, 94, 0)'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-green-400">+24.8% aujourd'hui</span>
            </motion.div>
          </div>

          {/* Graphique simplifié */}
          <div className="h-32 flex items-end gap-2">
            {[...Array(24)].map((_, i) => {
              const height = 30 + Math.random() * 70;
              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-lg"
                  style={{
                    background: `linear-gradient(to top, #d4af37, #f0e68c)`,
                  }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  whileHover={{
                    background: 'linear-gradient(to top, #f0e68c, #ffd700)',
                    transition: { duration: 0.2 },
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RealtimeStats;
