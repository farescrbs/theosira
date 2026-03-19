/**
 * GOD MODE PANEL — THESORIA
 * Interface de contrôle MEV ultra-premium (simulation frontend haute fidélité)
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap, Activity, Shield, TrendingUp, Globe, Layers,
  Target, BarChart3, Cpu, Radio, Lock, Unlock,
  AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Network, Flame,
  Eye, EyeOff, Terminal, Wifi, WifiOff, ChevronRight,
  Power, Settings, Gauge, Clock, DollarSign, Hash,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line,
} from "recharts@2.15.2";
import { useSecureBlockchain } from "../hooks/useSecureBlockchain";

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function rnd(min: number, max: number) { return Math.random() * (max - min) + min; }
function rndInt(min: number, max: number) { return Math.floor(rnd(min, max)); }
function fmtUSD(v: number) { return v >= 1000 ? `$${(v / 1000).toFixed(2)}K` : `$${v.toFixed(2)}`; }
function fmtHash() { return "0x" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join(""); }
function timeNow() { return new Date().toLocaleTimeString("fr-FR"); }

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface MempoolTx {
  id: string;
  hash: string;
  type: "swap" | "liq" | "arb" | "loan";
  value: number;
  gas: number;
  from: string;
  dex: string;
  token: string;
  time: string;
  flagged: boolean;
}

interface OpportunityEvent {
  id: string;
  strategy: string;
  profit: number;
  confidence: number;
  status: "detected" | "simulating" | "executing" | "confirmed" | "failed";
  txHash: string;
  time: string;
  chain: string;
  dexPair: string;
}

interface ChainNode {
  id: string;
  name: string;
  symbol: string;
  color: string;
  active: boolean;
  block: number;
  gas: number;
  tvl: string;
}

interface Strategy {
  id: string;
  name: string;
  icon: typeof Zap;
  active: boolean;
  profit: number;
  trades: number;
  winRate: number;
  color: string;
  risk: "LOW" | "MED" | "HIGH";
}

/* ══════════════════════════════════════════════
   DONNÉES STATIQUES
══════════════════════════════════════════════ */
const DEXS = ["Uniswap V3", "SushiSwap", "Curve", "Balancer", "PancakeSwap", "DODO", "1inch", "GMX"];
const TOKENS = ["ETH/USDC", "WBTC/ETH", "MATIC/USDC", "ARB/ETH", "OP/USDC", "LINK/ETH", "CRV/USDC", "GRT/ETH"];
const CHAINS: ChainNode[] = [
  { id: "eth",  name: "Ethereum",  symbol: "ETH",  color: "#627eea", active: true,  block: 21847320, gas: 14, tvl: "$48.2B" },
  { id: "arb",  name: "Arbitrum",  symbol: "ETH",  color: "#28a0f0", active: true,  block: 289431210, gas: 0.1, tvl: "$8.4B" },
  { id: "poly", name: "Polygon",   symbol: "MATIC", color: "#8247e5", active: true,  block: 64821043, gas: 32, tvl: "$1.2B" },
  { id: "opt",  name: "Optimism",  symbol: "ETH",  color: "#ff0420", active: true,  block: 128943201, gas: 0.2, tvl: "$3.1B" },
  { id: "base", name: "Base",      symbol: "ETH",  color: "#0052ff", active: true,  block: 21843201, gas: 0.3, tvl: "$6.7B" },
  { id: "bnb",  name: "BNB Chain", symbol: "BNB",  color: "#f0b90b", active: false, block: 38421043, gas: 3, tvl: "$4.9B" },
];

const INIT_STRATEGIES: Strategy[] = [
  { id: "fl",   name: "Flash Loans",        icon: Zap,         active: true,  profit: 0, trades: 0, winRate: 97.4, color: "#d4af37", risk: "LOW" },
  { id: "arb",  name: "DEX Arbitrage",      icon: TrendingUp,  active: true,  profit: 0, trades: 0, winRate: 94.2, color: "#22d3ee", risk: "LOW" },
  { id: "mev",  name: "MEV Front-run",      icon: Flame,       active: true,  profit: 0, trades: 0, winRate: 89.1, color: "#f87171", risk: "HIGH" },
  { id: "xch",  name: "Cross-Chain Arb",    icon: Network,     active: true,  profit: 0, trades: 0, winRate: 91.8, color: "#a78bfa", risk: "MED" },
  { id: "liq",  name: "Liquidation Hunt",   icon: Target,      active: true,  profit: 0, trades: 0, winRate: 99.1, color: "#34d399", risk: "LOW" },
  { id: "jit",  name: "JIT Liquidity",      icon: Gauge,       active: false, profit: 0, trades: 0, winRate: 86.3, color: "#fb923c", risk: "HIGH" },
  { id: "sand", name: "Sandwich Detect",    icon: Eye,         active: true,  profit: 0, trades: 0, winRate: 92.7, color: "#f472b6", risk: "MED" },
  { id: "stk",  name: "Staking Optimizer",  icon: Layers,      active: false, profit: 0, trades: 0, winRate: 100,  color: "#4ade80", risk: "LOW" },
];

/* ══════════════════════════════════════════════
   SOUS-COMPOSANTS VISUELS
══════════════════════════════════════════════ */

/* Barre de titre section */
function SectionTitle({ icon: Icon, title, color = "#d4af37", children }: {
  icon: typeof Zap; title: string; color?: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color }} />
        <span style={{
          fontFamily: "'Montserrat',sans-serif",
          fontSize: 10.5, letterSpacing: "0.3em", fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* Card glassmorphism */
function GCard({ children, className = "", style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl p-5 relative overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(212,175,55,0.12)",
        backdropFilter: "blur(20px)",
        ...style,
      }}
    >
      {/* Coin HUD top-left */}
      <div className="absolute top-2 left-2 w-3 h-3 pointer-events-none opacity-40">
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M0 6 L0 0 L6 0" stroke="#d4af37" strokeWidth="1"/>
        </svg>
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 pointer-events-none opacity-40">
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M12 6 L12 12 L6 12" stroke="#d4af37" strokeWidth="1"/>
        </svg>
      </div>
      {children}
    </div>
  );
}

/* Neurone animé */
function NeuralPulse({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <>
          {[1, 1.8, 2.6].map((scale, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ border: "1px solid rgba(212,175,55,0.35)", width: 12 * scale, height: 12 * scale }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, delay: i * 0.6, repeat: Infinity }}
            />
          ))}
        </>
      )}
      <motion.div
        className="w-3 h-3 rounded-full"
        style={{ background: active ? "#d4af37" : "rgba(255,255,255,0.15)", boxShadow: active ? "0 0 12px #d4af37" : "none" }}
        animate={active ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 1.5, ...(active ? { repeat: Infinity } : {}) }}
      />
    </div>
  );
}

/* Badge status */
function StatusBadge({ status }: { status: OpportunityEvent["status"] }) {
  const cfg = {
    detected:   { color: "#67e8f9", label: "DÉTECTÉ",    icon: Eye },
    simulating: { color: "#fb923c", label: "SIMULATION",  icon: RefreshCw },
    executing:  { color: "#d4af37", label: "EXÉCUTION",   icon: Zap },
    confirmed:  { color: "#4ade80", label: "CONFIRMÉ",    icon: CheckCircle2 },
    failed:     { color: "#f87171", label: "ÉCHOUÉ",      icon: XCircle },
  };
  const { color, label, icon: Icon } = cfg[status];
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{
      background: `${color}18`, border: `1px solid ${color}40`,
    }}>
      <Icon size={9} style={{ color }} />
      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.2em", fontWeight: 700, color }}>
        {label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════ */
export function GodModePanel() {
  const { proxyRpcCall } = useSecureBlockchain();

  /* ── État principal ── */
  const [godActive, setGodActive]     = useState(false);
  const [emergencyStop, setEmergency] = useState(false);
  const [riskLevel, setRiskLevel]     = useState<"conservative" | "balanced" | "aggressive">("balanced");
  const [showSecret, setShowSecret]   = useState(false);
  const [tab, setTab]                 = useState<"control" | "mempool" | "strategies" | "neural" | "log">("control");

  /* ── Stratégies ── */
  const [strategies, setStrategies]   = useState<Strategy[]>(INIT_STRATEGIES);

  /* ── Métriques globales ── */
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [profitHistory, setProfitHistory] = useState<{ t: string; v: number; cum: number }[]>([]);
  const [gasSpent, setGasSpent]       = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  /* ── Mempool ── */
  const [mempoolTxs, setMempoolTxs]   = useState<MempoolTx[]>([]);
  const [mempoolRate, setMempoolRate] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  /* ── Opportunités ── */
  const [opportunities, setOpportunities] = useState<OpportunityEvent[]>([]);

  /* ── Chaînes ── */
  const [chains, setChains]           = useState<ChainNode[]>(CHAINS);

  /* ── Log terminal ── */
  const [logs, setLogs]               = useState<{ t: string; msg: string; level: "info" | "ok" | "warn" | "err" }[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((msg: string, level: "info" | "ok" | "warn" | "err" = "info") => {
    setLogs(prev => [...prev.slice(-80), { t: timeNow(), msg, level }]);
  }, []);

  /* ══ SIMULATION MOTEUR ══ */
  useEffect(() => {
    if (!godActive || emergencyStop) return;

    addLog("🌌 GOD MODE activé — tous systèmes opérationnels", "ok");
    addLog("🔍 Scanner mempool démarré sur 5 chains", "info");
    addLog("⚡ 8 stratégies chargées et prêtes", "info");

    /* --- Mempool scanner --- */
    const mempoolId = setInterval(() => {
      const count = rndInt(3, 12);
      const newTxs: MempoolTx[] = Array.from({ length: count }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        hash: fmtHash(),
        type: ["swap", "liq", "arb", "loan"][rndInt(0, 4)] as MempoolTx["type"],
        value: rnd(1000, 2000000),
        gas: rndInt(12, 380),
        from: fmtHash().slice(0, 10),
        dex: DEXS[rndInt(0, DEXS.length)],
        token: TOKENS[rndInt(0, TOKENS.length)],
        time: timeNow(),
        flagged: Math.random() < 0.18,
      }));
      setMempoolTxs(prev => [...prev.slice(-50), ...newTxs]);
      setMempoolRate(rndInt(280, 1400));
      setPendingCount(rndInt(12000, 48000));
    }, 800);

    /* --- Détection d'opportunités --- */
    const oppId = setInterval(() => {
      if (Math.random() < 0.65) {
        const strat = strategies.filter(s => s.active)[rndInt(0, strategies.filter(s => s.active).length)];
        if (!strat) return;
        const profit = rnd(80, 8400);
        const opp: OpportunityEvent = {
          id: `${Date.now()}`,
          strategy: strat.name,
          profit,
          confidence: rnd(72, 99.8),
          status: "detected",
          txHash: fmtHash(),
          time: timeNow(),
          chain: CHAINS[rndInt(0, 5)].name,
          dexPair: `${DEXS[rndInt(0, DEXS.length)]} → ${DEXS[rndInt(0, DEXS.length)]}`,
        };

        addLog(`📡 Opportunité détectée: ${strat.name} | ${fmtUSD(profit)} | ${opp.chain}`, "info");
        setOpportunities(prev => [opp, ...prev].slice(0, 30));

        /* Progression de status */
        const steps: OpportunityEvent["status"][] = ["simulating", "executing", "confirmed"];
        steps.forEach((s, idx) => {
          setTimeout(() => {
            setOpportunities(prev =>
              prev.map(o => o.id === opp.id ? { ...o, status: s } : o)
            );
            if (s === "executing") addLog(`⚡ Exécution TX ${opp.txHash}`, "info");
            if (s === "confirmed") {
              addLog(`✅ TX confirmée — profit: ${fmtUSD(profit)}`, "ok");
              /* Mettre à jour métriques */
              setTotalProfit(p => p + profit);
              setTotalTrades(p => p + 1);
              setGasSpent(p => p + rnd(0.002, 0.04));
              setSuccessRate(rnd(88, 99.5));
              setProfitHistory(prev => [
                ...prev.slice(-30),
                { t: timeNow(), v: profit, cum: (prev[prev.length - 1]?.cum ?? 0) + profit },
              ]);
              /* Mettre à jour stratégie */
              setStrategies(prev =>
                prev.map(s2 => s2.id === strat.id
                  ? { ...s2, profit: s2.profit + profit, trades: s2.trades + 1 }
                  : s2
                )
              );
            }
          }, (idx + 1) * rndInt(600, 1800));
        });
      }
    }, 2500);

    /* --- Mise à jour des blocs/gas chains --- */
    const chainId = setInterval(async () => {
      // 1) Mise à jour simulée
      setChains(prev => prev.map(c => ({
        ...c,
        block: c.block + (c.active ? rndInt(1, 3) : 0),
        gas: Math.max(1, c.gas + rnd(-2, 2)),
      })));

      // 2) Intégration mode réel Ethereum via Alchemy Proxy
      try {
        const response = await proxyRpcCall("alchemy", "eth_blockNumber", []);
        if (response && response.result) {
          const realBlockNumber = parseInt(response.result, 16);
          setChains(prev => prev.map(c => 
            c.id === "eth" ? { ...c, block: realBlockNumber } : c
          ));
        }
      } catch (err) {
        // En cas d'erreur (ex: clé non configurée), on ignore silencieusement pour garder la pureté visuelle (ou on log dans le terminal)
        // console.warn("Erreur RPC mode réel", err);
      }
    }, 5000);

    return () => {
      clearInterval(mempoolId);
      clearInterval(oppId);
      clearInterval(chainId);
    };
  }, [godActive, emergencyStop, strategies, proxyRpcCall]);

  /* ── Scroll terminal auto ── */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const handleToggleGod = () => {
    if (emergencyStop) {
      setEmergency(false);
      addLog("🔓 Arrêt d'urgence levé — redémarrage...", "warn");
      return;
    }
    const next = !godActive;
    setGodActive(next);
    if (next) {
      addLog("🚀 Initialisation GOD MODE...", "info");
    } else {
      addLog("⏹��� GOD MODE arrêté", "warn");
    }
  };

  const handleEmergency = () => {
    setGodActive(false);
    setEmergency(true);
    addLog("🚨 ARRÊT D'URGENCE ACTIVÉ — toutes stratégies stoppées", "err");
  };

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const activeStrats = strategies.filter(s => s.active).length;

  /* ══ COULEUR RISQUE ══ */
  const riskColors = { conservative: "#4ade80", balanced: "#d4af37", aggressive: "#f87171" };
  const riskColor  = riskColors[riskLevel];

  /* ══ RENDER ══ */
  return (
    <section className="relative py-20 bg-[#000008]">
      {/* Fond spatial léger */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)",
      }} />

      <div className="max-w-[1400px] mx-auto px-6">

        {/* ══ HEADER GOD MODE ══ */}
        <div className="mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)" }}
              animate={{ boxShadow: godActive ? ["0 0 0px rgba(212,175,55,0)", "0 0 20px rgba(212,175,55,0.25)", "0 0 0px rgba(212,175,55,0)"] : "none" }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: emergencyStop ? "#f87171" : godActive ? "#4ade80" : "rgba(255,255,255,0.2)" }}
                animate={godActive && !emergencyStop ? { scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.35em", fontWeight: 700, color: "rgba(212,175,55,0.8)" }}>
                {emergencyStop ? "CIRCUIT BREAKER · ARRÊT D'URGENCE" : godActive ? "GOD MODE · ACTIF" : "GOD MODE · STANDBY"}
              </span>
            </motion.div>
            <h2 className="text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
              Panneau de{" "}
              <motion.span
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f0e68c, #d4af37)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Contrôle Ultime
              </motion.span>
            </h2>
            <p className="text-white/40 max-w-xl" style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12 }}>
              Scanner MEV temps réel · Flash Loans autonomes · Arbitrage cross-chain · Neural engine
            </p>
          </div>

          {/* Boutons principaux */}
          <div className="flex items-center gap-3">
            {/* Niveau de risque */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.15)" }}>
              {(["conservative", "balanced", "aggressive"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRiskLevel(r)}
                  className="px-3 py-2 transition-all duration-200"
                  style={{
                    background: riskLevel === r ? `${riskColors[r]}18` : "transparent",
                    borderRight: r !== "aggressive" ? "1px solid rgba(212,175,55,0.1)" : "none",
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 8.5, letterSpacing: "0.2em", fontWeight: 600,
                    color: riskLevel === r ? riskColors[r] : "rgba(255,255,255,0.35)",
                  }}
                >
                  {r === "conservative" ? "CONSER." : r === "balanced" ? "ÉQUIL." : "AGRESS."}
                </button>
              ))}
            </div>

            {/* EMERGENCY STOP */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleEmergency}
              disabled={!godActive}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{
                background: godActive ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.03)",
                border: godActive ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.08)",
                opacity: godActive ? 1 : 0.4,
                fontFamily: "'Montserrat',sans-serif", fontSize: 9.5, letterSpacing: "0.2em", fontWeight: 700,
                color: godActive ? "#f87171" : "rgba(255,255,255,0.3)",
              }}
            >
              <AlertTriangle size={13} />
              STOP
            </motion.button>

            {/* ON / OFF */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              onClick={handleToggleGod}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl relative overflow-hidden"
              style={{
                background: emergencyStop
                  ? "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(248,113,113,0.1))"
                  : godActive
                  ? "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(212,175,55,0.1))"
                  : "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.08))",
                border: emergencyStop
                  ? "1px solid rgba(248,113,113,0.5)"
                  : godActive
                  ? "1px solid rgba(74,222,128,0.4)"
                  : "1px solid rgba(212,175,55,0.38)",
                fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: "0.25em", fontWeight: 700,
                color: emergencyStop ? "#f87171" : godActive ? "#4ade80" : "#d4af37",
                boxShadow: godActive && !emergencyStop ? "0 0 20px rgba(74,222,128,0.15)" : "none",
              }}
            >
              {emergencyStop ? <Unlock size={14} /> : godActive ? <Power size={14} /> : <Power size={14} />}
              {emergencyStop ? "RÉARMER" : godActive ? "DÉSACTIVER" : "ACTIVER"}
              {godActive && !emergencyStop && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.1), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* ══ KPI ROW ══ */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "PROFIT TOTAL", value: fmtUSD(totalProfit), sub: godActive ? "+live" : "—", icon: DollarSign, color: "#d4af37" },
            { label: "TRADES",       value: totalTrades.toLocaleString(), sub: `${successRate.toFixed(1)}% win`, icon: Activity, color: "#4ade80" },
            { label: "STRATÉGIES",   value: `${activeStrats}/8`, sub: godActive ? "actives" : "inactives", icon: Target, color: "#a78bfa" },
            { label: "MEMPOOL TX",   value: pendingCount > 0 ? pendingCount.toLocaleString() : "—", sub: `${mempoolRate} tx/s`, icon: Hash, color: "#22d3ee" },
            { label: "GAS UTILISÉ",  value: gasSpent > 0 ? `${gasSpent.toFixed(4)} ETH` : "—", sub: "optimisé", icon: Gauge, color: "#fb923c" },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl p-4 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${godActive ? `${kpi.color}25` : "rgba(255,255,255,0.07)"}`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <kpi.icon size={11} style={{ color: kpi.color, opacity: 0.8 }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7, letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                  {kpi.label}
                </span>
              </div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 18, fontWeight: 700, color: godActive ? kpi.color : "rgba(255,255,255,0.5)" }}>
                {kpi.value}
              </div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8.5, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {kpi.sub}
              </div>
              {godActive && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }}
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* ══ TABS ══ */}
        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {([
            { id: "control",    label: "CONTRÔLE",   icon: Settings },
            { id: "mempool",    label: "MEMPOOL",     icon: Hash },
            { id: "strategies", label: "STRATÉGIES",  icon: Target },
            { id: "neural",     label: "RÉSEAU NEURAL", icon: Cpu },
            { id: "log",        label: "TERMINAL",    icon: Terminal },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200"
              style={{
                background: tab === t.id ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === t.id ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.06)"}`,
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 9, letterSpacing: "0.25em", fontWeight: 600,
                color: tab === t.id ? "#d4af37" : "rgba(255,255,255,0.4)",
              }}
            >
              <t.icon size={11} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ CONTENU TABS ══ */}
        <AnimatePresence mode="wait">

          {/* ── TAB CONTRÔLE ── */}
          {tab === "control" && (
            <motion.div
              key="control"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-5"
            >
              {/* Graphe profit */}
              <GCard className="lg:col-span-2">
                <SectionTitle icon={BarChart3} title="PROFIT CUMULÉ EN TEMPS RÉEL">
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>
                    {profitHistory.length > 0 ? `${profitHistory.length} points` : "En attente..."}
                  </span>
                </SectionTitle>
                <div className="w-full" style={{ height: 200, minHeight: 200 }}>
                  {profitHistory.length < 2 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={godActive ? { scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Activity size={32} style={{ color: "rgba(212,175,55,0.25)", margin: "0 auto 8px" }} />
                        </motion.div>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)" }}>
                          {godActive ? "SCAN EN COURS..." : "ACTIVER GOD MODE"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={profitHistory}>
                        <defs key="defs">
                          <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop key="stop1" offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                            <stop key="stop2" offset="100%" stopColor="#d4af37" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid key="grid" stroke="rgba(212,175,55,0.05)" />
                        <XAxis key="xaxis" dataKey="t" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8 }} />
                        <YAxis key="yaxis" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 8 }} tickFormatter={v => `$${v.toFixed(0)}`} />
                        <Tooltip
                          key="tooltip"
                          contentStyle={{ background: "rgba(5,5,20,0.95)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8 }}
                          labelStyle={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Montserrat',sans-serif", fontSize: 8 }}
                          itemStyle={{ color: "#d4af37" }}
                          formatter={(v: number) => [`$${v.toFixed(2)}`, "Profit"]}
                        />
                        <Area key="area" type="monotone" dataKey="cum" stroke="#d4af37" strokeWidth={1.5} fill="url(#gProfit)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </GCard>

              {/* Statut chains */}
              <GCard>
                <SectionTitle icon={Globe} title="CHAINS ACTIVES" />
                <div className="space-y-2.5">
                  {chains.map(c => (
                    <div key={c.id} className="flex items-center gap-3">
                      <motion.div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: c.active ? c.color : "rgba(255,255,255,0.15)" }}
                        animate={c.active && godActive ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
                        transition={{ duration: 1.8 + Math.random(), repeat: Infinity }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9.5, fontWeight: 600, color: c.active ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}>
                            {c.name}
                          </span>
                          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: c.active ? c.color : "rgba(255,255,255,0.2)" }}>
                            {c.gas.toFixed(1)} gwei
                          </span>
                        </div>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, color: "rgba(255,255,255,0.25)" }}>
                          #{c.block.toLocaleString()} · TVL {c.tvl}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GCard>

              {/* Dernières opportunités */}
              <GCard className="lg:col-span-3">
                <SectionTitle icon={Zap} title={`OPPORTUNITÉS DÉTECTÉES — ${opportunities.length}`} />
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(212,175,55,0.2) transparent" }}>
                  {opportunities.length === 0 ? (
                    <div className="text-center py-8">
                      <Radio size={24} style={{ color: "rgba(212,175,55,0.2)", margin: "0 auto 8px" }} />
                      <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)" }}>
                        {godActive ? "SCAN EN COURS..." : "ACTIVER GOD MODE POUR SCANNER"}
                      </p>
                    </div>
                  ) : (
                    opportunities.map(opp => (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <StatusBadge status={opp.status} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9.5, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                              {opp.strategy}
                            </span>
                            <ChevronRight size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8.5, color: "rgba(255,255,255,0.35)" }}>
                              {opp.dexPair}
                            </span>
                          </div>
                          <div style={{ fontFamily: "monospace", fontSize: 7.5, color: "rgba(255,255,255,0.2)" }}>
                            {opp.txHash} · {opp.chain} · {opp.time}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 700, color: opp.status === "confirmed" ? "#4ade80" : "#d4af37" }}>
                            {opp.status === "confirmed" ? "+" : "~"}{fmtUSD(opp.profit)}
                          </div>
                          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: "rgba(255,255,255,0.25)" }}>
                            {opp.confidence.toFixed(1)}% conf.
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GCard>
            </motion.div>
          )}

          {/* ── TAB MEMPOOL ── */}
          {tab === "mempool" && (
            <motion.div
              key="mempool"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GCard>
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle icon={Hash} title="SCANNER MEMPOOL TEMPS RÉEL" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      {godActive ? <Wifi size={11} className="text-emerald-400" /> : <WifiOff size={11} style={{ color: "rgba(255,255,255,0.3)" }} />}
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, letterSpacing: "0.2em", color: godActive ? "rgba(74,222,128,0.8)" : "rgba(255,255,255,0.3)" }}>
                        {mempoolRate > 0 ? `${mempoolRate} TX/S` : "INACTIF"}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>
                      {pendingCount.toLocaleString()} en attente
                    </span>
                  </div>
                </div>

                {/* Headers */}
                <div className="grid grid-cols-6 gap-2 px-3 pb-2 mb-2" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                  {["HASH", "TYPE", "VALEUR", "GAS", "DEX", "TEMPS"].map(h => (
                    <span key={h} style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.3em", color: "rgba(212,175,55,0.4)", fontWeight: 600 }}>
                      {h}
                    </span>
                  ))}
                </div>

                <div className="space-y-1 max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(212,175,55,0.15) transparent" }}>
                  <AnimatePresence>
                    {mempoolTxs.slice().reverse().map(tx => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-6 gap-2 px-3 py-2 rounded-lg items-center"
                        style={{
                          background: tx.flagged ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.015)",
                          border: tx.flagged ? "1px solid rgba(212,175,55,0.18)" : "1px solid transparent",
                        }}
                      >
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: tx.flagged ? "#d4af37" : "rgba(255,255,255,0.35)" }}>
                          {tx.hash.slice(0, 10)}…
                        </span>
                        <span style={{
                          fontFamily: "'Montserrat',sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: "0.15em",
                          color: tx.type === "loan" ? "#d4af37" : tx.type === "arb" ? "#22d3ee" : tx.type === "liq" ? "#4ade80" : "rgba(255,255,255,0.5)",
                        }}>
                          {tx.type.toUpperCase()}
                        </span>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                          ${tx.value >= 1000000 ? `${(tx.value / 1000000).toFixed(1)}M` : tx.value >= 1000 ? `${(tx.value / 1000).toFixed(0)}K` : tx.value.toFixed(0)}
                        </span>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, color: tx.gas > 200 ? "#f87171" : "rgba(255,255,255,0.4)" }}>
                          {tx.gas} gwei
                        </span>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: "rgba(255,255,255,0.35)" }}>
                          {tx.dex.split(" ")[0]}
                        </span>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: "rgba(255,255,255,0.25)" }}>
                          {tx.time}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {mempoolTxs.length === 0 && (
                    <div className="text-center py-16">
                      <Hash size={28} style={{ color: "rgba(212,175,55,0.15)", margin: "0 auto 8px" }} />
                      <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.15)" }}>
                        ACTIVER GOD MODE POUR SCANNER
                      </p>
                    </div>
                  )}
                </div>
              </GCard>
            </motion.div>
          )}

          {/* ── TAB STRATÉGIES ── */}
          {tab === "strategies" && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {strategies.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GCard style={{ borderColor: s.active && godActive ? `${s.color}30` : "rgba(255,255,255,0.07)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                          <s.icon size={16} style={{ color: s.color }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)" }}>
                            {s.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span style={{
                              fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, fontWeight: 600, letterSpacing: "0.2em",
                              color: s.risk === "LOW" ? "#4ade80" : s.risk === "MED" ? "#fb923c" : "#f87171",
                            }}>
                              RISQUE {s.risk}
                            </span>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, color: "rgba(255,255,255,0.25)" }}>
                              {s.winRate}% win rate
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle switch */}
                      <button
                        onClick={() => toggleStrategy(s.id)}
                        className="relative w-12 h-6 rounded-full transition-all duration-300"
                        style={{
                          background: s.active ? `${s.color}30` : "rgba(255,255,255,0.08)",
                          border: `1px solid ${s.active ? `${s.color}50` : "rgba(255,255,255,0.12)"}`,
                        }}
                      >
                        <motion.div
                          className="absolute top-0.5 w-5 h-5 rounded-full"
                          animate={{ left: s.active ? "calc(100% - 22px)" : "2px" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          style={{ background: s.active ? s.color : "rgba(255,255,255,0.25)", boxShadow: s.active ? `0 0 8px ${s.color}60` : "none" }}
                        />
                      </button>
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.025)" }}>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7, letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>PROFIT</div>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 700, color: s.active && s.profit > 0 ? "#4ade80" : "rgba(255,255,255,0.4)" }}>
                          {s.profit > 0 ? `+${fmtUSD(s.profit)}` : "—"}
                        </div>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.025)" }}>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7, letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>TRADES</div>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
                          {s.trades}
                        </div>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.025)" }}>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7, letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>STATUS</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: s.active && godActive ? s.color : "rgba(255,255,255,0.2)" }}
                            animate={s.active && godActive ? { scale: [1, 1.4, 1] } : {}}
                            transition={{ duration: 1.6, repeat: Infinity }}
                          />
                          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, color: s.active ? s.color : "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                            {s.active ? (godActive ? "ACTIF" : "PRÊT") : "INACTIF"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barre de progression profit */}
                    {s.profit > 0 && (
                      <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: s.color, width: `${Math.min(100, (s.profit / 5000) * 100)}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (s.profit / 5000) * 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    )}
                  </GCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── TAB NEURAL ── */}
          {tab === "neural" && (
            <motion.div
              key="neural"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
              <GCard>
                <SectionTitle icon={Cpu} title="RÉSEAU NEURONAL MEV" />
                <div className="grid grid-cols-6 gap-3 py-4">
                  {/* Visualisation simplifiée du réseau */}
                  {[
                    [5, "INPUT"],
                    [8, "L1"],
                    [8, "L2"],
                    [6, "L3"],
                    [4, "OUTPUT"],
                    [2, "ACT"],
                  ].map(([count, label], layerIdx) => (
                    <div key={layerIdx} className="flex flex-col items-center gap-2">
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 6.5, letterSpacing: "0.2em", color: "rgba(212,175,55,0.35)" }}>
                        {label}
                      </span>
                      {Array.from({ length: count as number }, (_, ni) => (
                        <motion.div
                          key={ni}
                          className="relative"
                          animate={godActive ? {
                            opacity: [0.4, 0.9, 0.4],
                          } : {}}
                          transition={{ duration: 1.5 + Math.random() * 2, delay: layerIdx * 0.15 + ni * 0.1, repeat: Infinity }}
                        >
                          <NeuralPulse active={godActive && Math.random() > 0.3} />
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "PRÉCISION", value: godActive ? "97.8%" : "—", color: "#4ade80" },
                    { label: "LATENCE",   value: godActive ? "< 8ms" : "—", color: "#d4af37" },
                    { label: "PRÉDICTIONS", value: godActive ? totalTrades.toLocaleString() : "—", color: "#a78bfa" },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7, letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
                        {m.label}
                      </div>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 14, fontWeight: 700, color: m.color }}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </GCard>

              <GCard>
                <SectionTitle icon={BarChart3} title="PERFORMANCE PAR STRATÉGIE" />
                <div className="w-full" style={{ height: 280, minHeight: 280 }}>
                  {strategies.some(s => s.profit > 0) ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={strategies.filter(s => s.profit > 0).map(s => ({ name: s.id, profit: s.profit, trades: s.trades }))}>
                        <CartesianGrid key="grid" stroke="rgba(212,175,55,0.05)" />
                        <XAxis key="xaxis" dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
                        <YAxis key="yaxis" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
                        <Tooltip
                          key="tooltip"
                          contentStyle={{ background: "rgba(5,5,20,0.95)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8 }}
                          labelStyle={{ color: "#d4af37", fontFamily: "'Montserrat',sans-serif", fontSize: 9 }}
                        />
                        <Line key="line1" type="monotone" dataKey="profit" stroke="#d4af37" strokeWidth={2} dot={{ fill: "#d4af37", r: 3 }} />
                        <Line key="line2" type="monotone" dataKey="trades" stroke="#4ade80" strokeWidth={1.5} dot={{ fill: "#4ade80", r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Cpu size={32} style={{ color: "rgba(212,175,55,0.15)", margin: "0 auto 8px" }} />
                        <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.15)" }}>
                          DONNÉES INSUFFISANTES
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GCard>
            </motion.div>
          )}

          {/* ── TAB TERMINAL ── */}
          {tab === "log" && (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GCard>
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle icon={Terminal} title="TERMINAL GOD MODE" />
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
                  </div>
                </div>
                <div
                  ref={logRef}
                  className="rounded-xl p-4 space-y-1 h-[500px] overflow-y-auto"
                  style={{ background: "rgba(0,0,0,0.6)", fontFamily: "monospace", fontSize: 11, scrollbarWidth: "thin", scrollbarColor: "rgba(212,175,55,0.15) transparent" }}
                >
                  {/* Ligne d'en-tête */}
                  <div style={{ color: "rgba(212,175,55,0.5)", marginBottom: 8 }}>
                    ══ THESORIA GOD MODE TERMINAL v3.0 ══
                  </div>
                  {logs.length === 0 && (
                    <div style={{ color: "rgba(255,255,255,0.2)" }}>
                      <span style={{ color: "rgba(212,175,55,0.4)" }}>thesoria@godmode</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>:~$ </span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ color: "#d4af37" }}
                      >_</motion.span>
                    </div>
                  )}
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-3 items-start"
                    >
                      <span style={{ color: "rgba(212,175,55,0.35)", flexShrink: 0 }}>[{log.t}]</span>
                      <span style={{
                        color: log.level === "ok" ? "#4ade80" : log.level === "warn" ? "#fb923c" : log.level === "err" ? "#f87171" : "rgba(255,255,255,0.65)",
                        wordBreak: "break-all",
                      }}>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))}
                  {godActive && (
                    <div style={{ color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                      <span style={{ color: "rgba(212,175,55,0.4)" }}>thesoria@godmode</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>:~$ </span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ color: "#d4af37" }}
                      >_</motion.span>
                    </div>
                  )}
                </div>
              </GCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ EMERGENCY OVERLAY ══ */}
        <AnimatePresence>
          {emergencyStop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
              style={{ background: "rgba(248,113,113,0.04)" }}
            >
              <motion.div
                animate={{ opacity: [0, 0.06, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0"
                style={{ background: "rgba(248,113,113,0.08)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default GodModePanel;
