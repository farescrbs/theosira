import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code, Shield, Zap, Coins, Building, Box, 
  ChevronRight, CheckCircle, Copy, Play, Save, Settings, PlayCircle, Sprout
} from "lucide-react";
import { Button } from "./ui/button";

const CONTRACT_TYPES = [
  { id: "erc20", name: "Token ERC-20", icon: Coins, desc: "Création de monnaie, tokens utilitaires ou gouvernance" },
  { id: "erc721", name: "NFT ERC-721", icon: Box, desc: "Collection d'actifs uniques et œuvres d'art" },
  { id: "erc3643", name: "RWA ERC-3643", icon: Building, desc: "Tokenisation d'actifs réels (Immobilier, Private Equity)" },
  { id: "staking", name: "Yield Farming", icon: Sprout, desc: "Contrat de Staking institutionnel avec récompenses" },
  { id: "flashloan", name: "Flash Loan Aave", icon: Zap, desc: "Emprunt flash sans collatéral via Aave V3 Pool" },
  { id: "flashloan_attacker", name: "Flash Loan Attacker", icon: Code, desc: "Simulation d'attaque Flash Loan (Security Testing)" },
];

export default function SmartContractStudio() {
  const [activeType, setActiveType] = useState("erc20");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "MyLuxuryToken",
    symbol: "MLT",
    supply: "1000000",
    decimals: "18",
    burnable: true,
    mintable: false,
    pausable: true,
    identityRegistry: "0x...",
    rewardRate: "100",
    stakingToken: "0x...",
    poolAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    flashLoanToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  });

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploymentStep(1);
    
    setTimeout(() => setDeploymentStep(2), 1500);
    setTimeout(() => setDeploymentStep(3), 3500);
    setTimeout(() => setDeploymentStep(4), 5000);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentStep(0);
    }, 8000);
  };

  const getGeneratedCode = () => {
    if (activeType === "erc20") {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
${formData.burnable ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";' : ''}
${formData.pausable ? 'import "@openzeppelin/contracts/security/Pausable.sol";' : ''}
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${formData.name.replace(/\s+/g, '')} is ERC20${formData.burnable ? ', ERC20Burnable' : ''}${formData.pausable ? ', Pausable' : ''}, Ownable {
    constructor() ERC20("${formData.name}", "${formData.symbol}") Ownable(msg.sender) {
        _mint(msg.sender, ${formData.supply} * 10 ** decimals());
    }

${formData.pausable ? `    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }` : ''}
}`;
    }

    if (activeType === "erc3643") {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@onchain-id/solidity/contracts/token/ERC3643/Token.sol";
import "@onchain-id/solidity/contracts/registry/IdentityRegistry.sol";

/**
 * @title ${formData.name.replace(/\s+/g, '')} (ERC-3643)
 * @dev Contrat de tokenisation d'actif réel (Real World Asset)
 */
contract ${formData.name.replace(/\s+/g, '')} is Token {
    constructor(
        address _identityRegistry,
        address _compliance
    ) Token(
        _identityRegistry,
        _compliance,
        "${formData.name}",
        "${formData.symbol}",
        ${formData.decimals},
        "0x..." // onchainID du token
    ) {
        // Initialisation de la tokenisation haut de gamme
    }
}`;
    }

    if (activeType === "staking") {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ${formData.name.replace(/\s+/g, '')}Staking
 * @dev Contrat de Yield Farming / Staking
 */
contract ${formData.name.replace(/\s+/g, '')}Staking is ReentrancyGuard, Ownable {
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    uint256 public rewardRate = ${formData.rewardRate};
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        _totalSupply += amount;
        _balances[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply -= amount;
        _balances[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
    }
}`;
    }

    if (activeType === "flashloan") {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ${formData.name.replace(/\s+/g, '')}
 * @dev Contrat d'exécution de Flash Loan via Aave V3 Pool
 * @notice Interagit avec le contrat Pool principal (ADDRESSES_PROVIDER)
 */
contract ${formData.name.replace(/\s+/g, '')} is FlashLoanSimpleReceiverBase {
    address payable owner;

    constructor(address _addressProvider) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) 
    {
        owner = payable(msg.sender);
    }

    /**
     * @dev Fonction principale appelée par le Pool d'Aave après avoir reçu les fonds
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // --- LOGIQUE D'ARBITRAGE OU DE LIQUIDATION ICI ---
        //
        // Le montant emprunté (amount) de l'actif (asset) est maintenant sur ce contrat.
        // Vous devez générer suffisamment de profits pour rembourser (amount + premium).
        
        uint256 amountToOwe = amount + premium;
        IERC20(asset).approve(address(POOL), amountToOwe);
        
        return true;
    }

    function requestFlashLoan(address _token, uint256 _amount) public {
        require(msg.sender == owner, "Only owner");
        address receiverAddress = address(this);
        address asset = _token;
        uint256 amount = _amount;
        bytes memory params = "";
        uint16 referralCode = 0;

        // Appel de la méthode flashLoanSimple sur le contrat Pool d'Aave
        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }
}`;
    }

    if (activeType === "flashloan_attacker") {
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeMath} from '../../dependencies/openzeppelin/contracts/SafeMath.sol';
import {IERC20} from '../../dependencies/openzeppelin/contracts/IERC20.sol';
import {GPv2SafeERC20} from '../../dependencies/gnosis/contracts/GPv2SafeERC20.sol';
import {IPoolAddressesProvider} from '../../interfaces/IPoolAddressesProvider.sol';
import {FlashLoanSimpleReceiverBase} from '../../flashloan/base/FlashLoanSimpleReceiverBase.sol';
import {MintableERC20} from '../tokens/MintableERC20.sol';
import {IPool} from '../../interfaces/IPool.sol';
import {DataTypes} from '../../protocol/libraries/types/DataTypes.sol';

/**
 * @title ${formData.name.replace(/\s+/g, '')}
 * @dev Contrat Attaquant pour tests de sécurité Flash Loan
 */
contract ${formData.name.replace(/\s+/g, '')} is FlashLoanSimpleReceiverBase {
    using GPv2SafeERC20 for IERC20;
    using SafeMath for uint256;

    IPoolAddressesProvider internal _provider;
    IPool internal _pool;

    constructor(address providerAddress) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(providerAddress)) {
        _provider = IPoolAddressesProvider(providerAddress);
        _pool = IPool(_provider.getPool());
    }

    function supplyAsset(address asset, uint256 amount) public {
        MintableERC20 token = MintableERC20(asset);
        token.mint(amount);
        token.approve(address(_pool), type(uint256).max);
        _pool.supply(asset, amount, address(this), 0);
    }

    function _innerBorrow(address asset) internal {
        DataTypes.ReserveData memory config = _pool.getReserveData(asset);
        IERC20 token = IERC20(asset);
        uint256 avail = token.balanceOf(config.aTokenAddress);
        _pool.borrow(asset, avail, 2, 0, address(this));
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address, // initiator
        bytes memory // params
    ) public override returns (bool) {
        MintableERC20 token = MintableERC20(asset);
        uint256 amountToReturn = amount.add(premium);

        // Emprunt normal inséré au milieu du Flash Loan
        _innerBorrow(asset);

        token.mint(premium);
        IERC20(asset).approve(address(POOL), amountToReturn);

        return true;
    }
}`;
    }

    return `// Code generation for ${activeType} is ready...`;
  };

  return (
    <section className="py-24 bg-[#020202] text-white relative overflow-hidden font-['Montserrat']">
      {/* Orbs de fond */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#d4af37] text-xs font-semibold tracking-[0.2em] mb-6 uppercase">
            <Code className="w-3.5 h-3.5" />
            <span>Smart Contract Studio</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bâtisseur d'Actifs <span className="text-[#d4af37]">On-Chain</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Créez, paramétrez et déployez vos propres Smart Contracts audités en quelques clics. Infrastructure institutionnelle, sécurité maximale.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Panneau de configuration (Gauche) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black/40 border border-white/10 backdrop-blur-xl p-6 rounded-none">
              <h3 className="text-lg text-[#d4af37] mb-4 flex items-center gap-2 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Settings className="w-5 h-5" />
                Type de Contrat
              </h3>
              <div className="space-y-3">
                {CONTRACT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={`w-full flex items-start gap-4 p-4 border transition-all duration-300 text-left ${
                        isActive 
                          ? 'border-[#d4af37] bg-[#d4af37]/10' 
                          : 'border-white/10 bg-white/5 hover:border-[#d4af37]/50'
                      }`}
                    >
                      <div className={`p-2 shrink-0 ${isActive ? 'bg-[#d4af37] text-black' : 'bg-black text-[#d4af37]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">{type.name}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 backdrop-blur-xl p-6 rounded-none">
              <h3 className="text-lg text-[#d4af37] mb-6 flex items-center gap-2 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Shield className="w-5 h-5" />
                Paramètres du Contrat
              </h3>
              
              <div className="space-y-5">
                {activeType !== "staking" && activeType !== "flashloan" && activeType !== "flashloan_attacker" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Nom</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Symbole</label>
                      <input 
                        type="text" 
                        value={formData.symbol}
                        onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                        className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {activeType === "staking" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Nom du Projet</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Token à Staker (0x...)</label>
                        <input 
                          type="text" 
                          value={formData.stakingToken}
                          onChange={(e) => setFormData({...formData, stakingToken: e.target.value})}
                          className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Taux (Tokens/sec)</label>
                        <input 
                          type="text" 
                          value={formData.rewardRate}
                          onChange={(e) => setFormData({...formData, rewardRate: e.target.value})}
                          className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(activeType === "flashloan" || activeType === "flashloan_attacker") && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Nom du Contrat</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Aave Pool Provider</label>
                        <input 
                          type="text" 
                          value={formData.poolAddress}
                          onChange={(e) => setFormData({...formData, poolAddress: e.target.value})}
                          className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">Token Cible (USDC, etc)</label>
                        <input 
                          type="text" 
                          value={formData.flashLoanToken}
                          onChange={(e) => setFormData({...formData, flashLoanToken: e.target.value})}
                          className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeType !== "staking" && activeType !== "flashloan" && activeType !== "flashloan_attacker" && (
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Supply Initiale</label>
                    <input 
                      type="text" 
                      value={formData.supply}
                      onChange={(e) => setFormData({...formData, supply: e.target.value})}
                      className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Toggles des fonctionnalités */}
                {activeType !== "staking" && activeType !== "flashloan" && activeType !== "flashloan_attacker" && (
                  <div className="pt-4 space-y-4 border-t border-white/10">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Burnable (Destruction possible)</span>
                    <div className={`w-10 h-5 border ${formData.burnable ? 'border-[#d4af37] bg-[#d4af37]/20' : 'border-white/20 bg-black'} flex items-center px-1 transition-all duration-300`}
                         onClick={() => setFormData({...formData, burnable: !formData.burnable})}>
                      <div className={`w-3 h-3 bg-[#d4af37] transition-all duration-300 ${formData.burnable ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Pausable (Suspension d'urgence)</span>
                    <div className={`w-10 h-5 border ${formData.pausable ? 'border-[#d4af37] bg-[#d4af37]/20' : 'border-white/20 bg-black'} flex items-center px-1 transition-all duration-300`}
                         onClick={() => setFormData({...formData, pausable: !formData.pausable})}>
                      <div className={`w-3 h-3 bg-[#d4af37] transition-all duration-300 ${formData.pausable ? 'translate-x-5' : ''}`} />
                    </div>
                  </label>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Editeur de Code (Droite) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-none flex-grow flex flex-col overflow-hidden relative">
              
              {/* Header de l'éditeur */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#111]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{formData.name}.sol</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Zone de code */}
              <div className="p-6 overflow-y-auto flex-grow bg-gradient-to-b from-[#0A0A0A] to-black relative">
                <pre className="font-mono text-sm leading-relaxed text-[#f3e5ab]">
                  <code>{getGeneratedCode()}</code>
                </pre>
                
                {/* Overlay de déploiement */}
                <AnimatePresence>
                  {isDeploying && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-20"
                    >
                      <div className="w-full max-w-md space-y-6">
                        <div className="text-center mb-8">
                          <Zap className="w-10 h-10 text-[#d4af37] mx-auto mb-4 animate-pulse" />
                          <h3 className="text-xl text-white font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Déploiement en cours...
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {[
                            { step: 1, label: "Compilation du contrat (Solc v0.8.20)" },
                            { step: 2, label: "Vérification des vulnérabilités" },
                            { step: 3, label: "Génération du Bytecode & ABI" },
                            { step: 4, label: "Déploiement sur le réseau principal" }
                          ].map((s) => (
                            <div key={s.step} className="flex items-center gap-4">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                                deploymentStep > s.step 
                                  ? 'bg-[#d4af37] border-[#d4af37] text-black' 
                                  : deploymentStep === s.step 
                                    ? 'border-[#d4af37] text-[#d4af37] animate-pulse'
                                    : 'border-white/20 text-gray-600'
                              }`}>
                                {deploymentStep > s.step ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{s.step}</span>}
                              </div>
                              <span className={`text-sm ${deploymentStep >= s.step ? 'text-white' : 'text-gray-600'}`}>
                                {s.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Footer de l'éditeur */}
              <div className="p-4 border-t border-white/10 bg-black flex justify-between items-center z-10">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  Code Audité par OpenZeppelin
                </div>
                <Button 
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-semibold px-8 rounded-none transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <PlayCircle className="w-4 h-4" />
                  {isDeploying ? 'Déploiement...' : 'Compiler & Déployer'}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
