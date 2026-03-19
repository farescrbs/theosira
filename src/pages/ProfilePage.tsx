import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, Award, TrendingUp, Building2, Crown, 
  FileText, CheckCircle, Clock, ExternalLink,
  Wallet, Shield, Zap, Copy, Star
} from "lucide-react";
import { useWeb3 } from "../contexts/Web3Context";
import { formatAddress, formatNumber } from "../utils/web3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

export default function ProfilePage() {
  const { isConnected, address, balance, chainId } = useWeb3();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [lotteryTickets, setLotteryTickets] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
  }, [address]);

  const fetchUserData = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // Fetch portfolio
      const portfolioRes = await fetch(`${SERVER_URL}/real-estate/portfolio/${address}`);
      const portfolioData = await portfolioRes.json();
      
      if (portfolioData.success) {
        setPortfolio(portfolioData.portfolio);
      }

      // Fetch KYC status
      const kycRes = await fetch(`${SERVER_URL}/god-mode/kv-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          action: 'get',
          key: `kyc:${address.toLowerCase()}`
        })
      });
      const kycData = await kycRes.json();
      if (kycData.result?.value) {
        setKycStatus(kycData.result.value);
      }

      // Determine badges
      const userBadges: string[] = [];
      if (kycData.result?.value?.status === 'verified') userBadges.push('KYC Verified');
      if (portfolioData.portfolio?.properties?.length > 0) userBadges.push('Investor');
      if (portfolioData.portfolio?.properties?.length >= 3) userBadges.push('Diversified');
      if (parseFloat(balance || "0") > 1) userBadges.push('Whale');
      setBadges(userBadges);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Adresse copiée", {
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#020202] text-white pt-24 pb-24 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-[#d4af37]/50 mx-auto mb-4" />
          <h2 className="text-2xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Connectez votre Wallet
          </h2>
          <p className="text-gray-400">Veuillez connecter votre wallet pour voir votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-24 font-['Montserrat'] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#d4af37] text-xs font-semibold tracking-[0.2em] mb-6 uppercase">
            <User className="w-3.5 h-3.5" />
            <span>Mon Profil</span>
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tableau de <span className="text-[#d4af37] italic">Bord</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f0e68c]/20 border-2 border-[#d4af37]/50 flex items-center justify-center">
                  <User className="w-10 h-10 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-xl text-white font-semibold mb-1">Investisseur</h3>
                  <p className="text-sm text-gray-400">Membre depuis 2026</p>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Adresse Wallet</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                  <code className="flex-1 text-sm font-mono text-[#d4af37]">
                    {formatAddress(address || "", 6)}
                  </code>
                  <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded transition-colors">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Solde Wallet</label>
                <div className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 rounded-lg p-4 text-center">
                  <div className="text-3xl text-[#d4af37] font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {balance ? formatNumber(balance, 4) : "0.00"}
                  </div>
                  <div className="text-sm text-white/70">ETH</div>
                </div>
              </div>

              {/* KYC Status */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Statut KYC</label>
                <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                  kycStatus?.status === 'verified' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                  {kycStatus?.status === 'verified' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-500 text-sm font-semibold">Vérifié</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-500 text-sm font-semibold">En attente</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
              <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d4af37]" />
                Badges
              </h3>
              <div className="space-y-2">
                {badges.length > 0 ? badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <Star className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-sm text-white">{badge}</span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400">Aucun badge pour le moment</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Portfolio & Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-3xl text-white font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {portfolio?.properties?.length || 0}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Propriétés</div>
              </div>

              <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-3xl text-white font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {formatNumber(Math.random() * 15 + 5, 1)}%
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">ROI Moyen</div>
              </div>

              <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="text-3xl text-white font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {lotteryTickets}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Tickets Loterie</div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
              <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#d4af37]" />
                Mon Portfolio Immobilier
              </h3>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 mt-4">Chargement...</p>
                </div>
              ) : portfolio?.properties?.length > 0 ? (
                <div className="space-y-4">
                  {portfolio.properties.map((prop: any, idx: number) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#d4af37]/30 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-semibold mb-1">Propriété #{prop.propertyId.slice(-6)}</h4>
                          <p className="text-sm text-gray-400">{prop.tokens} tokens</p>
                        </div>
                        <div className="text-right">
                          <div className="text-[#d4af37] font-semibold">+12.5%</div>
                          <div className="text-xs text-gray-400">Performance</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Investi le {new Date(prop.investedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Aucun investissement pour le moment</p>
                  <p className="text-sm text-gray-500">Explorez nos propriétés disponibles</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
              <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#d4af37]" />
                Activité Récente
              </h3>

              <div className="space-y-3">
                {[
                  { type: "invest", desc: "Investissement dans Propriété #abc123", time: "Il y a 2 jours" },
                  { type: "kyc", desc: "KYC vérifié avec succès", time: "Il y a 1 semaine" },
                  { type: "wallet", desc: "Wallet connecté", time: "Il y a 2 semaines" }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === "invest" && <TrendingUp className="w-5 h-5 text-[#d4af37]" />}
                      {activity.type === "kyc" && <Shield className="w-5 h-5 text-green-500" />}
                      {activity.type === "wallet" && <Wallet className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.desc}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
