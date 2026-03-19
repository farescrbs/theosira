/**
 * Hook pour récupérer les statistiques du Flash Loan Bot en temps réel
 * Affiche les profits générés dans le Hero
 */

import { useState, useEffect } from 'react';

interface FlashLoanStats {
  totalProfit: number;
  totalTrades: number;
  successRate: number;
  lastUpdate: string;
}

// Configuration API (à configurer via variables d'environnement en production)
const API_BASE = 'https://thesoria.vercel.app/api';
const API_KEY = '';

// Données simulées pour l'affichage (remplacées par l'API en production)
const SIMULATED_STATS: FlashLoanStats = {
  totalProfit: 13275.50,
  totalTrades: 847,
  successRate: 75.3,
  lastUpdate: new Date().toISOString(),
};

export function useFlashLoanStats(enableAPI = false) {
  const [stats, setStats] = useState<FlashLoanStats>(SIMULATED_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Incrémenter le profit de manière fluide (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalProfit: prev.totalProfit + (Math.random() * 50 + 10), // +10 à +60 par minute
        totalTrades: prev.totalTrades + (Math.random() > 0.7 ? 1 : 0), // Trade aléatoire
        lastUpdate: new Date().toISOString(),
      }));
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, []);

  // Récupérer les stats de l'API (si activé)
  useEffect(() => {
    if (!enableAPI) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/metrics/bot`, {
          headers: {
            'X-API-Key': API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setStats({
            totalProfit: data.data.totalProfit,
            totalTrades: data.data.totalTrades,
            successRate: data.data.successRate,
            lastUpdate: data.timestamp,
          });
        }
      } catch (err) {
        console.error('Error fetching flash loan stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Première récupération
    fetchStats();

    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [enableAPI]);

  return {
    stats,
    loading,
    error,
  };
}

/**
 * Formatte un nombre en devise avec séparateurs
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatte un nombre avec séparateurs de milliers
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.floor(num));
}