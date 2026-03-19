import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Shield, Lock, CheckCircle, TrendingUp, 
  AlertTriangle, FileSignature, ArrowRight,
  Info, Loader2, Key, MapPin
} from "lucide-react";
import { Button } from "./ui/button";

interface PropertyInvestModalProps {
  property: {
    id: number;
    title: string;
    location: string;
    image: string;
    valuation: string;
    tokenPrice: string;
    apy: string;
    progress: number;
  };
  onClose: () => void;
}

export default function PropertyInvestModal({ property, onClose }: PropertyInvestModalProps) {
  const [step, setStep] = useState<"simulator" | "kyc" | "sign" | "success">("simulator");
  const [tokenAmount, setTokenAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  // Derived calculations
  const tokenPriceNum = parseInt(property.tokenPrice.replace(/[^0-9]/g, ''), 10);
  const totalInvestment = tokenAmount * tokenPriceNum;
  const apyNum = parseFloat(property.apy.replace(/[^0-9.]/g, ''));
  const annualYield = (totalInvestment * (apyNum / 100)).toFixed(2);

  const handleNextStep = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (step === "simulator") setStep("kyc");
      else if (step === "kyc") setStep("sign");
      else if (step === "sign") setStep("success");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#050505] border border-[#d4af37]/30 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
      >
        {/* Left Side: Property & Contract Details */}
        <div className="w-full md:w-2/5 relative bg-black hidden md:flex flex-col">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <img 
            src={property.image} 
            alt={property.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 p-8 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white uppercase tracking-widest mb-4">
                <Shield className="w-3 h-3 text-[#d4af37]" />
                Smart Contract
              </div>
              <h2 className="text-3xl text-white mb-2 font-light leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {property.title}
              </h2>
              <p className="text-[#d4af37] flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" /> {property.location}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Standard de Token</span>
                  <span className="text-white text-sm font-medium">ERC-3643 (T-REX)</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Réseau</span>
                  <span className="text-white text-sm font-medium">Ethereum Mainnet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Contrat</span>
                  <span className="text-[#d4af37] text-sm font-mono truncate max-w-[120px]">0x7F4a...b9C2</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-light flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <p>Ce contrat gère la distribution des dividendes (loyers) en USDC automatiquement.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Flow */}
        <div className="w-full md:w-3/5 p-8 relative flex flex-col overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-8">
            <h3 className="text-2xl text-white font-light mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {step === "simulator" ? "Simulation d'Investissement" : 
               step === "kyc" ? "Vérification d'Identité" :
               step === "sign" ? "Signature Web3" : "Félicitations"}
            </h3>
            <div className="flex gap-2 mt-4">
              <div className={`h-1 flex-1 ${step === "simulator" ? "bg-[#d4af37]" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 ${step === "kyc" ? "bg-[#d4af37]" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 ${step === "sign" ? "bg-[#d4af37]" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 ${step === "success" ? "bg-[#d4af37]" : "bg-white/10"}`} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "simulator" && (
              <motion.div 
                key="sim"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow flex flex-col"
              >
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Prix par Fraction</p>
                    <p className="text-white text-xl font-light">{property.tokenPrice}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Rendement (APY)</p>
                    <p className="text-[#d4af37] text-xl font-light">{property.apy}</p>
                  </div>
                </div>

                <div className="mb-8 flex-grow">
                  <label className="text-sm text-gray-300 mb-4 block">Nombre de fractions à acquérir : <span className="text-[#d4af37] font-semibold text-lg ml-2">{tokenAmount}</span></label>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={tokenAmount} 
                    onChange={(e) => setTokenAmount(Number(e.target.value))}
                    className="w-full accent-[#d4af37] mb-6 h-1 bg-white/10 appearance-none rounded-none"
                  />
                  
                  <div className="space-y-3 bg-[#0a0a0a] border border-[#d4af37]/20 p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-light">Investissement Total</span>
                      <span className="text-2xl text-white font-medium">{totalInvestment.toLocaleString()} USDC</span>
                    </div>
                    <div className="h-px w-full bg-white/10" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-light">Revenus Annuels Estimés</span>
                      <span className="text-xl text-[#d4af37] font-medium">~ {annualYield} USDC</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-semibold py-6 rounded-none mt-auto"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continuer"}
                </Button>
              </motion.div>
            )}

            {step === "kyc" && (
              <motion.div 
                key="kyc"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-20 h-20 rounded-full border border-[#d4af37] flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h4 className="text-xl text-white mb-4">Vérification ONCHAINID</h4>
                <p className="text-gray-400 text-sm font-light mb-8 max-w-sm mx-auto">
                  Le standard ERC-3643 requiert une vérification d'identité pour détenir ces tokens. Connectez votre ONCHAINID pour valider votre éligibilité (KYC/AML).
                </p>
                <Button 
                  onClick={handleNextStep}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-transparent border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black py-6 rounded-none"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Vérifier l'Identité"}
                </Button>
              </motion.div>
            )}

            {step === "sign" && (
              <motion.div 
                key="sign"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center mb-6 bg-white/5">
                  <FileSignature className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl text-white mb-4">Autorisation & Signature</h4>
                <p className="text-gray-400 text-sm font-light mb-8 max-w-sm mx-auto">
                  Approuvez la transaction de <span className="text-white">{totalInvestment.toLocaleString()} USDC</span> pour acquérir <span className="text-[#d4af37]">{tokenAmount} fractions</span> de {property.title}.
                </p>
                
                <div className="bg-black/40 border border-[#d4af37]/20 p-4 w-full mb-8 text-left">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Frais de gas est.</span>
                    <span>~0.0012 ETH</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Contrat cible</span>
                    <span className="font-mono text-[#d4af37]">0x7F4a...b9C2</span>
                  </div>
                </div>

                <Button 
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-semibold py-6 rounded-none"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Signer la Transaction"}
                </Button>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-grow flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-24 h-24 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border border-[#d4af37] animate-ping opacity-20" />
                  <CheckCircle className="w-12 h-12 text-[#d4af37]" />
                </div>
                <h4 className="text-3xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Investissement Confirmé</h4>
                <p className="text-gray-400 font-light mb-8">
                  Bienvenue parmi les co-propriétaires de <span className="text-white font-medium">{property.title}</span>. Vos tokens ont été mintés vers votre wallet.
                </p>
                <Button 
                  onClick={onClose}
                  className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 py-6 rounded-none"
                >
                  Fermer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}