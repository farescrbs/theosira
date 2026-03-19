// ═══════════════════════════════════════════════════════════════════════════
// 🌐 SECTION WEB3 COMPLÈTE - THESORIA
// Hub central pour toutes les fonctionnalités Web3
// ═══════════════════════════════════════════════════════════════════════════

import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Wallet, Globe, BarChart3, Zap, ArrowDownUp, Image, Gauge } from "lucide-react";
import RealTimePortfolio from "./RealTimePortfolio";
import MultiChainDashboard from "./MultiChainDashboard";
import DEXSwapInterface from "./DEXSwapInterface";
import NFTGallery from "./NFTGallery";
import GasTracker from "./GasTracker";

export default function Web3Section() {
  return (
    <section id="web3-hub" className="relative py-32 overflow-hidden">
      {/* Fond avec effet de grille */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Gradient radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* En-tête de Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 backdrop-blur-xl mb-6"
          >
            <Zap className="w-5 h-5 text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              ÉCOSYSTÈME WEB3 COMPLET
            </span>
          </motion.div>

          <h2 
            className="text-white text-5xl md:text-7xl mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hub{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#d4af37]">
              DeFi
            </span>
            {" "}Complet
          </h2>
          
          <p 
            className="text-white/70 text-xl max-w-3xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Portfolio • Swap • NFTs • Gas Tracker • Multi-Chain
            <br />
            Tout ce dont vous avez besoin pour dominer le Web3.
          </p>
        </motion.div>

        {/* Onglets Web3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 mb-12 bg-white/[0.03] border border-[#d4af37]/20 p-1 rounded-xl backdrop-blur-xl">
              <TabsTrigger 
                value="portfolio"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#f0e68c] data-[state=active]:text-black text-white rounded-lg transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="swap"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#f0e68c] data-[state=active]:text-black text-white rounded-lg transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                <ArrowDownUp className="w-4 h-4 mr-2" />
                Swap
              </TabsTrigger>
              <TabsTrigger 
                value="nfts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#f0e68c] data-[state=active]:text-black text-white rounded-lg transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                <Image className="w-4 h-4 mr-2" />
                NFTs
              </TabsTrigger>
              <TabsTrigger 
                value="gas"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#f0e68c] data-[state=active]:text-black text-white rounded-lg transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                <Gauge className="w-4 h-4 mr-2" />
                Gas
              </TabsTrigger>
              <TabsTrigger 
                value="chains"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-[#f0e68c] data-[state=active]:text-black text-white rounded-lg transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Chains
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-0">
              <RealTimePortfolio />
            </TabsContent>

            <TabsContent value="swap" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DEXSwapInterface />
                </div>
                <div>
                  <GasTracker />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nfts" className="mt-0">
              <NFTGallery />
            </TabsContent>

            <TabsContent value="gas" className="mt-0">
              <GasTracker />
            </TabsContent>

            <TabsContent value="chains" className="mt-0">
              <MultiChainDashboard />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Stats en bas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: "Blockchains Supportées", value: "8", icon: Globe },
            { label: "Tokens Compatibles", value: "10,000+", icon: Zap },
            { label: "Sécurité", value: "Grade A+", icon: Wallet },
            { label: "Uptime", value: "99.99%", icon: BarChart3 },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center hover:border-[#d4af37]/40 transition-all group"
            >
              <stat.icon className="w-8 h-8 text-[#d4af37] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-3xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              Connexion sécurisée • Vos clés restent sur votre appareil
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}