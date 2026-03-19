/**
 * Analyseur de Sentiment du Marché IA
 * 
 * Analyse en temps réel du sentiment sur Twitter, Reddit, Discord
 * pour prédire les mouvements de marché
 */

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Twitter, MessageCircle, Hash, AlertCircle } from "lucide-react"

interface SentimentData {
  platform: 'twitter' | 'reddit' | 'discord' | 'telegram'
  token: string
  sentiment: number // -100 to +100
  volume: number
  trending: boolean
  keywords: string[]
  prediction: 'bullish' | 'bearish' | 'neutral'
  confidence: number
}

interface TrendingTopic {
  topic: string
  mentions: number
  sentiment: number
  change24h: number
}

export function AIMarketSentiment({ aiActive }: { aiActive: boolean }) {
  const [sentiments, setSentiments] = useState<SentimentData[]>([])
  const [trending, setTrending] = useState<TrendingTopic[]>([])
  const [overallSentiment, setOverallSentiment] = useState(0)

  useEffect(() => {
    if (!aiActive) return

    // Initialiser avec des données
    const initialSentiments: SentimentData[] = [
      {
        platform: 'twitter',
        token: 'ETH',
        sentiment: 72,
        volume: 45230,
        trending: true,
        keywords: ['bullish', 'ATH soon', 'accumulation'],
        prediction: 'bullish',
        confidence: 87,
      },
      {
        platform: 'reddit',
        token: 'BTC',
        sentiment: 65,
        volume: 32100,
        trending: true,
        keywords: ['hodl', 'institutional', 'halving'],
        prediction: 'bullish',
        confidence: 82,
      },
      {
        platform: 'discord',
        token: 'ARB',
        sentiment: -23,
        volume: 12400,
        trending: false,
        keywords: ['dump', 'whale move', 'concern'],
        prediction: 'bearish',
        confidence: 76,
      },
      {
        platform: 'telegram',
        token: 'MATIC',
        sentiment: 15,
        volume: 8900,
        trending: false,
        keywords: ['upgrade', 'zkEVM', 'partnership'],
        prediction: 'neutral',
        confidence: 71,
      },
      {
        platform: 'twitter',
        token: 'SOL',
        sentiment: 83,
        volume: 52100,
        trending: true,
        keywords: ['breakout', 'DeFi summer', 'explosive'],
        prediction: 'bullish',
        confidence: 91,
      },
      {
        platform: 'reddit',
        token: 'LINK',
        sentiment: 48,
        volume: 15200,
        trending: false,
        keywords: ['staking', 'oracles', 'adoption'],
        prediction: 'neutral',
        confidence: 68,
      },
    ]

    const initialTrending: TrendingTopic[] = [
      { topic: 'ETF Bitcoin', mentions: 12400, sentiment: 78, change24h: 245 },
      { topic: 'Layer 2 Scaling', mentions: 8900, sentiment: 82, change24h: 134 },
      { topic: 'DeFi Protocol Hack', mentions: 6700, sentiment: -45, change24h: 890 },
      { topic: 'NFT Revival', mentions: 5200, sentiment: 34, change24h: -23 },
      { topic: 'Crypto Regulation', mentions: 4100, sentiment: -12, change24h: 67 },
    ]

    setSentiments(initialSentiments)
    setTrending(initialTrending)

    // Calculer sentiment global
    const avg = initialSentiments.reduce((sum, s) => sum + s.sentiment, 0) / initialSentiments.length
    setOverallSentiment(avg)

    // Mettre à jour régulièrement
    const interval = setInterval(() => {
      setSentiments(prev => prev.map(s => ({
        ...s,
        sentiment: Math.max(-100, Math.min(100, s.sentiment + (Math.random() - 0.5) * 10)),
        volume: Math.max(0, s.volume + Math.floor((Math.random() - 0.5) * 1000)),
        confidence: Math.max(60, Math.min(95, s.confidence + (Math.random() - 0.5) * 5)),
      })))

      setTrending(prev => prev.map(t => ({
        ...t,
        mentions: Math.max(0, t.mentions + Math.floor((Math.random() - 0.5) * 200)),
        sentiment: Math.max(-100, Math.min(100, t.sentiment + (Math.random() - 0.5) * 8)),
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [aiActive])

  // Recalculer le sentiment global
  useEffect(() => {
    if (sentiments.length > 0) {
      const avg = sentiments.reduce((sum, s) => sum + s.sentiment, 0) / sentiments.length
      setOverallSentiment(avg)
    }
  }, [sentiments])

  return (
    <div className="space-y-6">
      {/* Sentiment Global */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
        <h3 className="text-xl mb-6 flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#d4af37]" />
          Sentiment Global du Marché
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-4xl mb-2">
              {overallSentiment > 20 ? (
                <span className="text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-8 h-8" />
                  Bullish
                </span>
              ) : overallSentiment < -20 ? (
                <span className="text-red-400 flex items-center gap-2">
                  <TrendingDown className="w-8 h-8" />
                  Bearish
                </span>
              ) : (
                <span className="text-yellow-400 flex items-center gap-2">
                  <AlertCircle className="w-8 h-8" />
                  Neutral
                </span>
              )}
            </div>
            <div className="text-sm text-gray-400">
              Score: {overallSentiment.toFixed(1)} / 100
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl text-[#d4af37]">
              {sentiments.reduce((sum, s) => sum + s.volume, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Mentions totales</div>
          </div>
        </div>

        {/* Barre de sentiment */}
        <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full transition-all duration-1000"
            style={{
              width: `${((overallSentiment + 100) / 200) * 100}%`,
              background: overallSentiment > 0 
                ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.8))'
                : 'linear-gradient(90deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.3))',
            }}
          />
          <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-white/50 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Très Bearish</span>
          <span>Neutre</span>
          <span>Très Bullish</span>
        </div>
      </div>

      {/* Analyses par Token */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
        <h3 className="text-xl mb-6">Sentiment par Token</h3>

        <div className="space-y-4">
          {sentiments.map((sent, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={sent.platform} />
                  <div>
                    <div className="text-base text-white flex items-center gap-2">
                      {sent.token}
                      {sent.trending && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[#d4af37]/20 text-[#d4af37]">
                          🔥 Trending
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {sent.volume.toLocaleString()} mentions
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <PredictionBadge prediction={sent.prediction} />
                  <div className="text-xs text-gray-400 mt-1">
                    {sent.confidence.toFixed(0)}% confiance
                  </div>
                </div>
              </div>

              {/* Barre de sentiment */}
              <div className="relative h-2 bg-black/50 rounded-full overflow-hidden mb-3">
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-500"
                  style={{
                    width: `${((sent.sentiment + 100) / 200) * 100}%`,
                    background: sent.sentiment > 0 
                      ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 1))'
                      : 'linear-gradient(90deg, rgba(239, 68, 68, 1), rgba(239, 68, 68, 0.5))',
                  }}
                />
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2">
                {sent.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400 border border-white/10"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sujets Tendances */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl">
        <h3 className="text-xl mb-6">Sujets en Tendance</h3>

        <div className="space-y-3">
          {trending.map((topic, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{topic.topic}</div>
                  <div className="text-xs text-gray-400">
                    {topic.mentions.toLocaleString()} mentions
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`text-sm ${topic.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {topic.change24h > 0 ? '+' : ''}{topic.change24h}
                  </div>
                  <SentimentIndicator sentiment={topic.sentiment} />
                </div>
              </div>

              <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${((topic.sentiment + 100) / 200) * 100}%`,
                    background: topic.sentiment > 0 ? '#22c55e' : '#ef4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: string }) {
  const config = {
    twitter: { icon: Twitter, color: 'text-blue-400 bg-blue-500/20' },
    reddit: { icon: MessageCircle, color: 'text-orange-400 bg-orange-500/20' },
    discord: { icon: Hash, color: 'text-indigo-400 bg-indigo-500/20' },
    telegram: { icon: MessageCircle, color: 'text-cyan-400 bg-cyan-500/20' },
  }[platform]

  const Icon = config.icon

  return (
    <div className={`p-2 rounded-lg ${config.color}`}>
      <Icon className="w-4 h-4" />
    </div>
  )
}

function PredictionBadge({ prediction }: { prediction: string }) {
  const config = {
    bullish: { label: '📈 Bullish', color: 'bg-green-500/20 text-green-400' },
    bearish: { label: '📉 Bearish', color: 'bg-red-500/20 text-red-400' },
    neutral: { label: '➡️ Neutral', color: 'bg-yellow-500/20 text-yellow-400' },
  }[prediction]

  return (
    <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
      {config.label}
    </span>
  )
}

function SentimentIndicator({ sentiment }: { sentiment: number }) {
  if (sentiment > 20) {
    return <span className="text-xs text-green-400">😊 Positif</span>
  } else if (sentiment < -20) {
    return <span className="text-xs text-red-400">😟 Négatif</span>
  } else {
    return <span className="text-xs text-yellow-400">😐 Neutre</span>
  }
}
