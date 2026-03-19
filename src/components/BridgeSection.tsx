import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRightLeft, Sparkles, Zap, Clock, CheckCircle, XCircle, TrendingUp, Shield, Layers, ArrowRight, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BRIDGE_CHAINS, 
  bridgeNFT, 
  bridgeToken, 
  getBridgeRoutes, 
  getBridgeHistory, 
  getBridgeStats 
} from "../services/bridgeAPI";

const rarityColors = {
  'Common': 'text-gray-400 border-gray-400/30',
  'Rare': 'text-blue-400 border-blue-400/30',
  'Epic': 'text-purple-400 border-purple-400/30',
  'Legendary': 'text-[#d4af37] border-[#d4af37]/30',
};

export function BridgeSection() {
  const [activeTab, setActiveTab] = useState("bridge");
  const [fromChain, setFromChain] = useState("Ethereum");
  const [toChain, setToChain] = useState("Polygon");
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("ETH");
  const [showBridgeDialog, setShowBridgeDialog] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  
  const stats = getBridgeStats();
  const routes = getBridgeRoutes();
  const history = getBridgeHistory();
  
  const currentRoute = routes.find(
    r => r.fromChain === fromChain && r.toChain === toChain
  );

  const handleBridge = async () => {
    setIsBridging(true);
    
    try {
      await bridgeToken(selectedAsset, parseFloat(amount), fromChain, toChain);
      
      setTimeout(() => {
        setIsBridging(false);
        setShowBridgeDialog(false);
        setAmount("");
      }, 2500);
    } catch (error) {
      setIsBridging(false);
    }
  };

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Failed': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            opacity: [0.04, 0.1, 0.04],
            scale: [1, 1.4, 1],
            x: [0, 120, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[950px] h-[950px] bg-[#d4af37]/25 rounded-full blur-[200px]"
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.12, 0.05],
            scale: [1.4, 1, 1.4],
            x: [0, -100, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[850px] h-[850px] bg-[#f0e68c]/20 rounded-full blur-[200px]"
        />

        {/* Floating Sparkles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -150],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-sm">
              <span className="text-[#d4af37] tracking-[0.3em] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                CROSS-CHAIN BRIDGE
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Pont Multi-Chaînes
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Transférez vos NFTs et tokens entre {BRIDGE_CHAINS.length} blockchains instantanément. Marketplace cross-chain intégré.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ${(stats.totalVolume / 1000).toFixed(0)}K
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Volume Total
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Layers className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(stats.transactionCount / 1000).toFixed(1)}K
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Transactions
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Shield className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {stats.supportedChains}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Blockchains
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Zap className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {stats.activeRoutes}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Routes Actives
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="bridge"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Bridge
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Clock className="w-4 h-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Bridge Tab */}
          <TabsContent value="bridge" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              {/* Bridge Interface */}
              <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8">
                {/* From Chain */}
                <div className="mb-4">
                  <label 
                    className="text-white/60 text-sm mb-2 block"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    De
                  </label>
                  <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.03] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <select
                        value={fromChain}
                        onChange={(e) => setFromChain(e.target.value)}
                        className="bg-transparent text-white text-xl outline-none cursor-pointer"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {BRIDGE_CHAINS.map((chain) => (
                          <option key={chain.id} value={chain.name} className="bg-black">
                            {chain.icon} {chain.name}
                          </option>
                        ))}
                      </select>
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                        {BRIDGE_CHAINS.find(c => c.name === fromChain)?.symbol}
                      </Badge>
                    </div>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent border-0 text-3xl text-white p-0 h-auto focus-visible:ring-0"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    onClick={swapChains}
                    className="w-12 h-12 rounded-full border-2 border-[#d4af37]/30 bg-black hover:bg-[#d4af37]/10 transition-all flex items-center justify-center group"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-[#d4af37] group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                </div>

                {/* To Chain */}
                <div className="mb-6">
                  <label 
                    className="text-white/60 text-sm mb-2 block"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Vers
                  </label>
                  <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.03] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <select
                        value={toChain}
                        onChange={(e) => setToChain(e.target.value)}
                        className="bg-transparent text-white text-xl outline-none cursor-pointer"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {BRIDGE_CHAINS.map((chain) => (
                          <option key={chain.id} value={chain.name} className="bg-black">
                            {chain.icon} {chain.name}
                          </option>
                        ))}
                      </select>
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                        {BRIDGE_CHAINS.find(c => c.name === toChain)?.symbol}
                      </Badge>
                    </div>
                    <p 
                      className="text-3xl text-white/40"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {amount || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Route Info */}
                {currentRoute && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6 mb-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p 
                          className="text-white/60 text-sm mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Temps Estimé
                        </p>
                        <p 
                          className="text-white flex items-center gap-2"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          <Clock className="w-4 h-4 text-[#d4af37]" />
                          {currentRoute.estimatedTime}
                        </p>
                      </div>
                      <div>
                        <p 
                          className="text-white/60 text-sm mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Frais de Bridge
                        </p>
                        <p 
                          className="text-[#d4af37]"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {currentRoute.fee} {currentRoute.feeCurrency}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bridge Button */}
                <Button
                  onClick={() => setShowBridgeDialog(true)}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  <ArrowRightLeft className="mr-2 w-5 h-5" />
                  Transférer
                </Button>
              </div>

              {/* Supported Chains */}
              <div className="mt-8">
                <h3 
                  className="text-white text-lg mb-4 text-center"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Blockchains Supportées
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {BRIDGE_CHAINS.map((chain) => (
                    <div
                      key={chain.id}
                      className="px-4 py-2 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-sm hover:border-[#d4af37]/40 transition-all"
                    >
                      <span className="text-white text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {chain.icon} {chain.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {history.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${getStatusColor(tx.status)} flex items-center gap-1`}>
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </Badge>
                      <Badge variant="outline" className="text-white/60 border-white/20">
                        {tx.type}
                      </Badge>
                    </div>

                    <h4 
                      className="text-white text-lg mb-2"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {tx.asset} {tx.type === 'Token' && `(${tx.amount.toLocaleString()})`}
                    </h4>

                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      <span>{tx.fromChain}</span>
                      <ArrowRight className="w-4 h-4 text-[#d4af37]" />
                      <span>{tx.toChain}</span>
                    </div>

                    <p className="text-white/40 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p 
                      className="text-white/60 text-sm mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Frais
                    </p>
                    <p 
                      className="text-[#d4af37] text-lg mb-2"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {tx.fee}
                    </p>

                    <button
                      className="flex items-center gap-1 text-white/60 hover:text-[#d4af37] transition-colors text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <span>{tx.txHash}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bridge Confirmation Dialog */}
      <Dialog open={showBridgeDialog} onOpenChange={setShowBridgeDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Confirmer le Transfer
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Vérifiez les détails avant de confirmer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Montant:
                  </span>
                  <span className="text-white text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    {amount} {selectedAsset}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    De:
                  </span>
                  <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    {fromChain}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Vers:
                  </span>
                  <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    {toChain}
                  </span>
                </div>

                {currentRoute && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Temps estimé:
                      </span>
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {currentRoute.estimatedTime}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Frais de bridge:
                      </span>
                      <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {currentRoute.fee} {currentRoute.feeCurrency}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button
              onClick={handleBridge}
              disabled={isBridging}
              className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isBridging ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                  Transfer en cours...
                </>
              ) : (
                <>
                  <Zap className="mr-2 w-5 h-5" />
                  Confirmer le Transfer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default BridgeSection;