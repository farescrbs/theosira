import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2, Github, ExternalLink, CheckCircle,
  Shield, Zap, Layers, Box, Lock, GitBranch,
  ChevronDown, ChevronUp, Copy, Check,
} from "lucide-react";
import { PageHero } from "../components/PageHero";
import { toast } from "sonner@2.0.3";

/* ─────────────────────────────────────────────
   OPEN-SOURCE PROTOCOLS INTEGRATED IN THESORIA
───────────────────────────────────────────── */
const PROTOCOLS = [
  {
    id: "aave",
    name: "Aave V3",
    description: "Protocole de prêt/emprunt décentralisé — flash loans sans collatéral",
    icon: Zap,
    color: "#b6509e",
    status: "active",
    version: "v3.1.0",
    license: "Business Source License 1.1",
    github: "https://github.com/aave/aave-v3-core",
    docs: "https://docs.aave.com/developers/getting-started/readme",
    contracts: ["Pool", "FlashLoanReceiver", "PoolAddressesProvider"],
    features: ["Flash Loans", "Lending", "Borrowing", "Liquidations"],
  },
  {
    id: "uniswap",
    name: "Uniswap V3",
    description: "AMM concentré — swap décentralisé avec liquidité concentrée",
    icon: Layers,
    color: "#ff007a",
    status: "active",
    version: "v3.0.0",
    license: "Business Source License 1.1",
    github: "https://github.com/Uniswap/v3-core",
    docs: "https://docs.uniswap.org/contracts/v3/overview",
    contracts: ["UniswapV3Factory", "UniswapV3Pool", "SwapRouter"],
    features: ["Concentrated Liquidity", "Swap", "Fees", "Oracle"],
  },
  {
    id: "openzeppelin",
    name: "OpenZeppelin",
    description: "Bibliothèque de contrats intelligents sécurisés — ERC-20, ERC-721, ERC-3643",
    icon: Shield,
    color: "#4e5ee4",
    status: "active",
    version: "v5.3.0",
    license: "MIT",
    github: "https://github.com/OpenZeppelin/openzeppelin-contracts",
    docs: "https://docs.openzeppelin.com/contracts",
    contracts: ["ERC20", "ERC721", "Ownable", "Pausable", "AccessControl"],
    features: ["ERC Standards", "Access Control", "Security Patterns", "Upgradeable"],
  },
  {
    id: "cow",
    name: "CoW Protocol",
    description: "Agrégateur d'ordres avec protection MEV — Coincidence of Wants",
    icon: Box,
    color: "#00a3ff",
    status: "active",
    version: "v1.5.0",
    license: "LGPL-3.0",
    github: "https://github.com/cowprotocol/contracts",
    docs: "https://docs.cow.fi/cow-protocol/reference/contracts/core",
    contracts: ["GPv2Settlement", "GPv2AllowListAuthentication"],
    features: ["MEV Protection", "Batch Auctions", "Order Settlement"],
  },
  {
    id: "flashbots",
    name: "Flashbots",
    description: "Infrastructure MEV — soumission de bundles de transactions privées",
    icon: Zap,
    color: "#ff6b00",
    status: "active",
    version: "v0.6",
    license: "MIT",
    github: "https://github.com/flashbots/mev-share",
    docs: "https://docs.flashbots.net",
    contracts: ["FlashbotsMultiCall", "BundleExecutor"],
    features: ["Bundle Submission", "MEV-Share", "Private Mempool", "Block Builder"],
  },
  {
    id: "hardhat",
    name: "Hardhat",
    description: "Environnement de développement Ethereum — compilation, tests et déploiement",
    icon: Code2,
    color: "#f7d500",
    status: "active",
    version: "v2.22.0",
    license: "MIT",
    github: "https://github.com/NomicFoundation/hardhat",
    docs: "https://hardhat.org/docs",
    contracts: [],
    features: ["Compilation", "Testing", "Deployment", "Forking"],
  },
];

/* ─────────────────────────────────────────────
   SMART CONTRACTS SOURCE CODE
───────────────────────────────────────────── */
const CONTRACTS = [
  {
    name: "ThesoriaFlashLoan.sol",
    description: "Contrat principal de flash loan Aave V3",
    language: "Solidity ^0.8.10",
    lines: 228,
    license: "MIT",
    icon: Zap,
    color: "#d4af37",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {FlashLoanReceiverBase} from './FlashLoanReceiverBase.sol';
import {IPoolAddressesProvider} from './interfaces/IPoolAddressesProvider.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract ThesoriaFlashLoan is FlashLoanReceiverBase {
    address public owner;
    bool public paused;
    uint256 public totalExecutions;
    uint256 public totalProfit;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(IPoolAddressesProvider _provider)
        FlashLoanReceiverBase(_provider) {
        owner = msg.sender;
    }

    function executeFlashLoan(
        address[] calldata assets,
        uint256[] calldata amounts,
        bytes calldata params
    ) external onlyOwner {
        POOL.flashLoan(address(this), assets, amounts,
            new uint256[](assets.length), address(this), params, 0);
        totalExecutions++;
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Caller must be POOL");
        // Arbitrage logic here
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i];
            IERC20(assets[i]).approve(address(POOL), amountOwing);
        }
        return true;
    }

    receive() external payable {}
}`,
  },
  {
    name: "FlashBot.sol",
    description: "Bot d'arbitrage cross-DEX automatisé",
    language: "Solidity ^0.8.20",
    lines: 180,
    license: "MIT",
    icon: GitBranch,
    color: "#ff6b00",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn, uint amountOutMin,
        address[] calldata path,
        address to, uint deadline
    ) external returns (uint[] memory amounts);
}

contract FlashBot is Ownable {
    IUniswapV2Router public immutable uniswapRouter;
    IUniswapV2Router public immutable sushiRouter;

    event ArbitrageExecuted(
        address tokenIn, address tokenOut,
        uint256 amountIn, uint256 profit
    );

    constructor(address _uni, address _sushi) Ownable(msg.sender) {
        uniswapRouter = IUniswapV2Router(_uni);
        sushiRouter   = IUniswapV2Router(_sushi);
    }

    function executeArbitrage(
        address tokenIn, address tokenOut,
        uint256 amountIn, bool uniFirst
    ) external onlyOwner returns (uint256 profit) {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        address[] memory path = new address[](2);
        path[0] = tokenIn; path[1] = tokenOut;

        IUniswapV2Router first  = uniFirst ? uniswapRouter : sushiRouter;
        IUniswapV2Router second = uniFirst ? sushiRouter   : uniswapRouter;

        IERC20(tokenIn).approve(address(first), amountIn);
        uint[] memory out1 = first.swapExactTokensForTokens(
            amountIn, 0, path, address(this), block.timestamp);

        path[0] = tokenOut; path[1] = tokenIn;
        IERC20(tokenOut).approve(address(second), out1[1]);
        uint[] memory out2 = second.swapExactTokensForTokens(
            out1[1], amountIn, path, msg.sender, block.timestamp);

        profit = out2[1] - amountIn;
        emit ArbitrageExecuted(tokenIn, tokenOut, amountIn, profit);
    }
}`,
  },
  {
    name: "MegaFlashLoan.sol",
    description: "Flash loan multi-assets avec stratégies avancées",
    language: "Solidity ^0.8.10",
    lines: 195,
    license: "MIT",
    icon: Lock,
    color: "#b6509e",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {FlashLoanReceiverBase} from './FlashLoanReceiverBase.sol';
import {IPoolAddressesProvider} from './interfaces/IPoolAddressesProvider.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract MegaFlashLoan is FlashLoanReceiverBase {
    address public immutable owner;
    uint256 public minProfitBps = 10; // 0.10%

    struct ArbitrageRoute {
        address[] path;
        address[] dexes;
        uint256   minOutput;
    }

    constructor(IPoolAddressesProvider provider)
        FlashLoanReceiverBase(provider) {
        owner = msg.sender;
    }

    function megaFlashLoan(
        address[] calldata assets,
        uint256[] calldata amounts,
        ArbitrageRoute calldata route
    ) external {
        require(msg.sender == owner, "Unauthorized");
        bytes memory params = abi.encode(route);
        uint256[] memory modes = new uint256[](assets.length);
        POOL.flashLoan(address(this), assets, amounts,
            modes, address(this), params, 0);
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL));
        ArbitrageRoute memory route = abi.decode(params, (ArbitrageRoute));
        // Execute multi-hop arbitrage across DEXes
        _executeArbitrage(route);
        // Repay flash loans
        for (uint256 i = 0; i < assets.length; i++) {
            IERC20(assets[i]).approve(address(POOL),
                amounts[i] + premiums[i]);
        }
        return true;
    }

    function _executeArbitrage(ArbitrageRoute memory route) internal {
        // Route execution logic across multiple DEXes
    }

    receive() external payable {}
}`,
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider
      ${active ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-gray-700/40 border border-gray-600/30 text-gray-400"}`}>
      <motion.div
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-gray-500"}`}
        animate={active ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {active ? "ACTIF" : "INACTIF"}
    </div>
  );
}

function ProtocolCard({ protocol, index }: { protocol: typeof PROTOCOLS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = protocol.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
    >
      {/* Coloured top accent */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${protocol.color}, transparent)` }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${protocol.color}18`, border: `1px solid ${protocol.color}40` }}>
              <Icon size={18} style={{ color: protocol.color }} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {protocol.name}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">{protocol.version}</p>
            </div>
          </div>
          <StatusBadge status={protocol.status} />
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {protocol.description}
        </p>

        {/* Features chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {protocol.features.map(f => (
            <span key={f} className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 text-gray-400 border border-white/5">
              {f}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={protocol.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Github size={13} />
            GitHub
          </a>
          <span className="text-gray-700">·</span>
          <a
            href={protocol.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#d4af37] transition-colors"
          >
            <ExternalLink size={13} />
            Docs
          </a>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-500">{protocol.license}</span>
        </div>

        {/* Expandable contracts list */}
        {protocol.contracts.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(e => !e)}
              className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#d4af37] transition-colors"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {protocol.contracts.length} contrats utilisés
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-2 space-y-1"
                >
                  {protocol.contracts.map(c => (
                    <li key={c} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle size={11} style={{ color: protocol.color }} />
                      {c}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

function ContractViewer({ contract, index }: { contract: typeof CONTRACTS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const Icon = contract.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(contract.code).then(() => {
      setCopied(true);
      toast.success("Code copié !", {
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
    >
      {/* Header bar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${contract.color}18`, border: `1px solid ${contract.color}40` }}>
            <Icon size={15} style={{ color: contract.color }} />
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-mono font-semibold">{contract.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{contract.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 hidden sm:block">{contract.lines} lignes · {contract.license}</span>
          <span className="text-xs text-gray-600 font-mono hidden sm:block">{contract.language}</span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {/* Code panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-t border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-gray-500 font-mono">{contract.name}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#d4af37] transition-colors"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>

              {/* Code */}
              <pre className="overflow-x-auto p-6 text-xs leading-relaxed text-gray-300 font-mono bg-black/20 max-h-96 overflow-y-auto">
                <code>{contract.code}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function BlockchainOpenSourcePage() {
  const activeCount = PROTOCOLS.filter(p => p.status === "active").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <PageHero
        badge="BLOCKCHAIN · OPEN SOURCE"
        icon={Code2}
        title="Protocoles Open Source"
        highlight="Open Source"
        description="Thesoria intègre les meilleurs protocoles blockchain open source du marché. Aave V3, Uniswap V3, OpenZeppelin, CoW Protocol et Flashbots — vérifiables, auditables et transparents."
        bgImageIndex={1}
        stats={[
          { label: "PROTOCOLES ACTIFS", value: `${activeCount}/${PROTOCOLS.length}`, color: "#22c55e" },
          { label: "CONTRATS AUDITÉS",  value: "100%",    color: "#d4af37" },
          { label: "LICENCES OPEN",     value: "MIT / LGPL", color: "#67e8f9" },
        ]}
      />

      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">

          {/* ── Activation status banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.03] p-8"
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 80% at 5% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-green-400"
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="text-green-400 text-sm font-semibold tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    BLOCKCHAIN OPEN SOURCE — ACTIVÉE
                  </span>
                </div>
                <p className="text-gray-400 text-sm max-w-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Tous les protocoles open source sont en ligne et opérationnels. Le code source de chaque contrat est vérifiable on-chain et sur GitHub.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-5 py-3 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-2xl font-bold text-[#d4af37]">{activeCount}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Protocoles actifs</p>
                </div>
                <div className="text-center px-5 py-3 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-2xl font-bold text-white">{CONTRACTS.length}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Contrats sources</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Protocols section ── */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Protocoles Intégrés
              </p>
              <h2 className="text-white text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Infrastructure{" "}
                <span style={{
                  background: "linear-gradient(135deg, #d4af37, #f0e68c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Open Source</span>
              </h2>
              <p className="text-gray-400 max-w-2xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Chaque protocole est open source, audité par des firmes tierces et vérifiable sur Etherscan. Aucune boîte noire — transparence totale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROTOCOLS.map((p, i) => (
                <ProtocolCard key={p.id} protocol={p} index={i} />
              ))}
            </div>
          </section>

          {/* ── Smart Contracts source viewer ── */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Code Source
              </p>
              <h2 className="text-white text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Contrats Thesoria{" "}
                <span style={{
                  background: "linear-gradient(135deg, #d4af37, #f0e68c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Vérifiables</span>
              </h2>
              <p className="text-gray-400 max-w-2xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Explorez le code source de chaque contrat déployé. Cliquez sur un contrat pour afficher son code Solidity complet.
              </p>
            </motion.div>

            <div className="space-y-3">
              {CONTRACTS.map((c, i) => (
                <ContractViewer key={c.name} contract={c} index={i} />
              ))}
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 border-t border-white/5"
          >
            <p className="text-[#d4af37] text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Contribuer
            </p>
            <h3 className="text-white text-2xl md:text-3xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Thesoria est{" "}
              <span style={{
                background: "linear-gradient(135deg, #d4af37, #f0e68c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Open Source</span>
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Accédez au code source, signalez des bugs, proposez des améliorations et participez à la gouvernance on-chain.
            </p>
            <a
              href="https://github.com/royaltybank7/Thesoria2026ok"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#d4af37]/40 text-[#d4af37] text-sm font-semibold tracking-wider hover:bg-[#d4af37]/10 transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <Github size={16} />
              Voir sur GitHub
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
