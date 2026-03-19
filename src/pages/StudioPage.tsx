import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code2, Sparkles, Zap, Shield, CheckCircle, 
  FileCode, Download, Copy, Play, Settings,
  Rocket, Lock, Users, Building2, RefreshCw,
  AlertCircle, ExternalLink
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

const CONTRACT_TEMPLATES = [
  {
    id: "erc3643",
    name: "ERC-3643 Security Token",
    description: "Token immobilier conforme T-REX avec KYC/AML intégré",
    icon: Shield,
    features: ["KYC Required", "Transfer Restrictions", "Compliance Module", "OnChainID"],
    color: "#d4af37"
  },
  {
    id: "erc20",
    name: "ERC-20 Standard Token",
    description: "Token standard fongible avec mint/burn",
    icon: Code2,
    features: ["Mintable", "Burnable", "Pausable", "Ownable"],
    color: "#3b82f6"
  },
  {
    id: "staking",
    name: "Staking Vault",
    description: "Contrat de staking avec rewards automatiques",
    icon: Lock,
    features: ["Auto-compound", "Flexible Periods", "Reward Distribution"],
    color: "#22c55e"
  },
  {
    id: "dao",
    name: "DAO Governance",
    description: "Gouvernance décentralisée avec votes on-chain",
    icon: Users,
    features: ["Voting", "Proposals", "Timelock", "Multi-sig"],
    color: "#a855f7"
  }
];

export default function StudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(CONTRACT_TEMPLATES[0]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContracts, setDeployedContracts] = useState<any[]>([]);
  
  // Form states for ERC-3643
  const [tokenName, setTokenName] = useState("THESORIA Property Token");
  const [tokenSymbol, setTokenSymbol] = useState("TPT");
  const [decimals, setDecimals] = useState("18");
  const [initialSupply, setInitialSupply] = useState("1000000");
  const [kycRequired, setKycRequired] = useState(true);
  const [transferWhitelist, setTransferWhitelist] = useState(true);

  // Fetch deployed contracts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/studio/contracts`);
        const data = await response.json();
        
        if (data.success) {
          setDeployedContracts(data.contracts.map((c: any) => c.value));
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchContracts();
    const interval = setInterval(fetchContracts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      const response = await fetch(`${SERVER_URL}/studio/deploy-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          name: tokenName,
          symbol: tokenSymbol,
          decimals: parseInt(decimals),
          initialSupply,
          compliance: {
            kycRequired,
            transferWhitelist
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      toast.success("Contrat déployé avec succès!", {
        description: `${data.contract.name} (${data.contract.symbol}) déployé à ${data.contract.address.slice(0, 10)}...`,
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });

      // Refresh contracts list
      setTimeout(() => {
        fetchContracts();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du déploiement", {
        style: { background: "#3f0000", border: "1px solid #ff0000", color: "#ff8888" }
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/studio/contracts`);
      const data = await response.json();
      
      if (data.success) {
        setDeployedContracts(data.contracts.map((c: any) => c.value));
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const generateSolidityCode = () => {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${tokenSymbol} is ERC20, Ownable {
    mapping(address => bool) private _kycVerified;
    
    constructor() ERC20("${tokenName}", "${tokenSymbol}") {
        _mint(msg.sender, ${initialSupply} * 10 ** decimals());
    }
    
    function verifyKYC(address account) external onlyOwner {
        _kycVerified[account] = true;
    }
    
    function isKYCVerified(address account) public view returns (bool) {
        return _kycVerified[account];
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        ${kycRequired ? `require(_kycVerified[from] && _kycVerified[to], "KYC required");` : '// No KYC required'}
        super._beforeTokenTransfer(from, to, amount);
    }
}`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateSolidityCode());
    toast.success("Code copié dans le presse-papiers", {
      style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
    });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-24 font-['Montserrat'] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#d4af37] text-xs font-semibold tracking-[0.2em] mb-6 uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>No-Code Smart Contracts</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl mb-6 text-white tracking-tight" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contract <span className="text-[#d4af37] italic">Studio</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed text-lg"
          >
            Déployez des smart contracts ERC-3643 et ERC-20 sans écrire une ligne de code. Interface visuelle, déploiement instantané sur Ethereum Mainnet.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          
          {/* Template Selector */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-4"
          >
            <h2 className="text-xl font-semibold text-[#d4af37] mb-6 uppercase tracking-wider">Templates</h2>
            {CONTRACT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full text-left p-6 border transition-all group ${
                  selectedTemplate.id === template.id
                    ? "border-[#d4af37] bg-[#d4af37]/5"
                    : "border-white/10 bg-black/60 hover:border-white/30 hover:bg-black/80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className={`p-3 rounded-lg ${
                      selectedTemplate.id === template.id ? 'bg-[#d4af37]/20' : 'bg-white/5 group-hover:bg-white/10'
                    }`}
                    style={{ color: template.color }}
                  >
                    <template.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Configuration Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8"
          >
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-[#d4af37]" />
                Configuration du Contrat
              </h2>

              <div className="space-y-6">
                {/* Token Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                    Nom du Token
                  </label>
                  <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="THESORIA Property Token"
                  />
                </div>

                {/* Token Symbol */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                      Symbole
                    </label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-white/10 px-4 py-3 text-white font-mono focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="TPT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                      Decimals
                    </label>
                    <input
                      type="number"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                      className="w-full bg-black border border-white/10 px-4 py-3 text-white font-mono focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Initial Supply */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">
                    Supply Initial
                  </label>
                  <input
                    type="text"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(e.target.value)}
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white font-mono focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="1000000"
                  />
                </div>

                {/* Compliance Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#d4af37]" />
                    Options de Conformité
                  </h3>
                  
                  <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                    <div>
                      <div className="text-white font-medium">KYC Requis</div>
                      <div className="text-sm text-gray-400">Les transferts nécessitent une vérification KYC</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={kycRequired}
                      onChange={(e) => setKycRequired(e.target.checked)}
                      className="w-5 h-5 accent-[#d4af37]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                    <div>
                      <div className="text-white font-medium">Whitelist de Transfert</div>
                      <div className="text-sm text-gray-400">Seules les adresses whitelistées peuvent recevoir</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={transferWhitelist}
                      onChange={(e) => setTransferWhitelist(e.target.checked)}
                      className="w-5 h-5 accent-[#d4af37]"
                    />
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <button
                    onClick={copyCode}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white hover:bg-white/5 transition-all uppercase tracking-wider text-sm font-semibold"
                  >
                    <Copy className="w-4 h-4" />
                    Copier le Code
                  </button>
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c4a027] text-black transition-all uppercase tracking-wider text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Déploiement...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        Déployer sur Mainnet
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Generated Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <FileCode className="w-6 h-6 text-[#d4af37]" />
            Code Généré (Solidity)
          </h2>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              {generateSolidityCode()}
            </pre>
          </div>
        </motion.div>

        {/* Deployed Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#d4af37]" />
            Contrats Déployés
          </h2>

          {deployedContracts.length === 0 ? (
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucun contrat déployé pour le moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {deployedContracts.map((contract, idx) => (
                <div key={idx} className="bg-black/60 border border-white/10 backdrop-blur-md p-6 hover:border-[#d4af37]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{contract.name}</h3>
                      <p className="text-sm text-gray-400">{contract.symbol}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      contract.status === 'deployed' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {contract.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="text-white font-mono">{contract.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white font-mono">{contract.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Supply</span>
                      <span className="text-white font-mono">{contract.initialSupply}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span className="font-mono">Contract Address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs font-mono text-[#d4af37] bg-white/5 px-3 py-2 rounded">
                        {contract.address}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(contract.address);
                          toast.success("Adresse copiée");
                        }}
                        className="p-2 hover:bg-white/10 transition-all"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
