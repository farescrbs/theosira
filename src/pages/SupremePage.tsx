/**
 * THESORIA — ULTRA-SUPREME AI FLASH LOAN INTERFACE
 *
 * Design: Ultra-minimal Apple-style
 *   · Black / white / SF Pro typography
 *   · Single page, no nav, no footer
 *   · Three states: Connect → Active → Profit
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { useAutonomousAI } from "../hooks/useAutonomousAI";
import type { Opportunity, AIAgent } from "../services/autonomousAIEngine";

// ─── Tiny helpers ──────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function agentColor(status: AIAgent["status"]) {
  switch (status) {
    case "scanning":    return "#ffffff";
    case "opportunity": return "#34d399"; // green
    case "executing":   return "#60a5fa"; // blue
    case "error":       return "#f87171"; // red
    default:            return "#4b5563"; // grey
  }
}

function agentLabel(status: AIAgent["status"]) {
  switch (status) {
    case "scanning":    return "SCANNING";
    case "opportunity": return "FOUND";
    case "executing":   return "EXEC";
    case "error":       return "ERROR";
    default:            return "IDLE";
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PulsingDot({ active }: { active: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      {active && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
          style={{ background: "#34d399" }}
        />
      )}
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ background: active ? "#34d399" : "#4b5563" }}
      />
    </span>
  );
}

function AgentRow({ agent }: { agent: AIAgent }) {
  const color = agentColor(agent.status);
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <PulsingDot active={agent.status === "scanning" || agent.status === "opportunity"} />
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
          {agent.name}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span style={{ color: "rgba(255,255,255,0.3)" }}>{agent.scansTotal} scans</span>
        <span
          className="font-mono tracking-widest px-1.5 py-0.5 rounded"
          style={{ color, background: `${color}18`, fontSize: "0.6rem" }}
        >
          {agentLabel(agent.status)}
        </span>
      </div>
    </div>
  );
}

function OppCard({ opp, onExecute }: { opp: Opportunity; onExecute: () => void }) {
  const typeLabel: Record<string, string> = {
    arbitrage: "ARB",
    liquidation: "LIQ",
    triangular: "TRI",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-xl p-4 border cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
      onClick={onExecute}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-mono tracking-widest px-2 py-0.5 rounded"
          style={{
            background: "rgba(52,211,153,0.12)",
            color: "#34d399",
          }}
        >
          {typeLabel[opp.type] ?? opp.type.toUpperCase()}
        </span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {opp.token} · conf {opp.confidence}%
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Net profit</p>
          <p className="text-lg font-semibold tabular-nums" style={{ color: "#34d399", letterSpacing: "-0.03em" }}>
            +${fmt(opp.netProfitUSD)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Loan</p>
          <p className="text-sm tabular-nums" style={{ color: "rgba(255,255,255,0.6)" }}>
            {parseInt(opp.amount).toLocaleString()} {opp.token}
          </p>
        </div>
      </div>
      <p className="text-xs mt-2 truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
        {opp.source}
      </p>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function SupremePage() {
  const {
    engineState,
    isConnected,
    walletAddress,
    walletBalance,
    connectWallet,
    startEngine,
    stopEngine,
    executeNow,
    bestOpportunity,
    lastEvent,
  } = useAutonomousAI();

  const [executing, setExecuting] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const prevEventRef = useRef<typeof lastEvent>(null);

  // React to engine events
  useEffect(() => {
    if (!lastEvent || lastEvent === prevEventRef.current) return;
    prevEventRef.current = lastEvent;

    if (lastEvent.type === "opportunity_detected") {
      const opp = lastEvent.data as Opportunity;
      toast.success(`Opportunité détectée · +$${fmt(opp.netProfitUSD)}`, {
        description: `${opp.token} · ${opp.source}`,
      });
    }

    if (lastEvent.type === "execution_success") {
      const { txHash, profitETH } = lastEvent.data;
      toast.success(`Flash loan exécuté · +${fmt(profitETH ?? 0, 6)} ETH`, {
        description: txHash ? `Tx: ${fmtAddr(txHash)}` : undefined,
      });
    }

    if (lastEvent.type === "execution_failed") {
      toast.error("Exécution échouée", {
        description: lastEvent.data?.error,
      });
    }
  }, [lastEvent]);

  const handleExecute = async (opp?: Opportunity) => {
    if (executing) return;
    setExecuting(true);
    try {
      const result = await executeNow();
      if (result.success && result.txHash) setLastTx(result.txHash);
    } finally {
      setExecuting(false);
    }
  };

  const handleToggleEngine = async () => {
    if (engineState.running) {
      stopEngine();
      toast.info("Agent IA arrêté");
    } else {
      await startEngine();
      toast.success("Agent IA activé — scan en cours…");
    }
  };

  const totalOppUSD = engineState.opportunities.reduce((s, o) => s + o.netProfitUSD, 0);
  const activeAgents = engineState.agents.filter((a) => a.status !== "idle").length;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#000000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-0">
        <a
          href="/"
          className="text-xs tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          ← Thesoria
        </a>
        {walletAddress && (
          <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fmtAddr(walletAddress)}
          </span>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-6 pt-16 pb-12 max-w-sm mx-auto w-full">

        {/* ── Logo + Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Minimalist orb */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: engineState.running
                  ? "radial-gradient(circle, #34d39940 0%, #000 70%)"
                  : "radial-gradient(circle, #ffffff15 0%, #000 70%)",
                border: `1px solid ${engineState.running ? "#34d39930" : "#ffffff15"}`,
              }}
              animate={engineState.running ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div
              className="absolute inset-3 rounded-full flex items-center justify-center"
              style={{
                background: engineState.running ? "#34d39912" : "#ffffff08",
                border: `1px solid ${engineState.running ? "#34d39940" : "#ffffff10"}`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14L5.5 18L7.5 12L2 8H8.5L11 2Z"
                  fill={engineState.running ? "#34d399" : "rgba(255,255,255,0.5)"}
                />
              </svg>
            </div>
          </div>

          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: "#ffffff", letterSpacing: "-0.04em" }}
          >
            AI Flash Loan
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Autonomous · Sovereign · Self-optimising
          </p>
        </motion.div>

        {/* ── State: NOT CONNECTED ── */}
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Connectez votre wallet pour activer l'IA autonome et percevoir vos profits réels.
              </p>
              <button
                onClick={connectWallet}
                className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-all active:scale-95"
                style={{
                  background: "#ffffff",
                  color: "#000000",
                }}
              >
                Connecter le Wallet
              </button>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                MetaMask requis · Ethereum Mainnet
              </p>
            </motion.div>
          ) : (
            /* ── State: CONNECTED ── */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col gap-6"
            >

              {/* Balance card */}
              <div
                className="rounded-2xl p-5 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs mb-2 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Wallet Balance
                </p>
                <p className="text-3xl font-semibold tabular-nums" style={{ color: "#ffffff", letterSpacing: "-0.05em" }}>
                  {walletBalance ?? "0.0000"} ETH
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                  ≈ ${fmt((parseFloat(walletBalance ?? "0")) * engineState.ethPriceUSD, 0)}
                </p>
              </div>

              {/* Profit card */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(52,211,153,0.06)",
                  border: "1px solid rgba(52,211,153,0.15)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(52,211,153,0.6)" }}>
                    Profits générés
                  </p>
                  <span className="text-xs font-mono" style={{ color: "rgba(52,211,153,0.4)" }}>
                    {engineState.successfulExecutions} tx
                  </span>
                </div>
                <p className="text-3xl font-semibold tabular-nums" style={{ color: "#34d399", letterSpacing: "-0.05em" }}>
                  +${fmt(engineState.totalProfitUSD)}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "rgba(52,211,153,0.5)" }}>
                  +{fmt(engineState.totalProfitETH, 6)} ETH
                </p>
              </div>

              {/* AI Activation toggle */}
              <button
                onClick={handleToggleEngine}
                className="w-full py-4 rounded-2xl text-sm font-medium tracking-wide transition-all active:scale-95 relative overflow-hidden"
                style={{
                  background: engineState.running ? "rgba(255,255,255,0.06)" : "#ffffff",
                  color: engineState.running ? "rgba(255,255,255,0.7)" : "#000000",
                  border: engineState.running ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                {engineState.running ? (
                  <span className="flex items-center justify-center gap-2">
                    <PulsingDot active />
                    Arrêter l'IA Autonome
                  </span>
                ) : (
                  "Activer l'IA Autonome"
                )}
              </button>

              {/* Stats bar */}
              {engineState.running && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-3 gap-3 text-center"
                >
                  {[
                    { label: "Agents actifs", value: `${activeAgents}/4` },
                    {
                      label: "Opportunités",
                      value: `${engineState.opportunities.length}`,
                    },
                    {
                      label: "Profit potentiel",
                      value: `$${fmt(totalOppUSD, 0)}`,
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p className="text-base font-semibold tabular-nums" style={{ color: "#fff" }}>
                        {s.value}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* AI Agents */}
              {engineState.running && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="text-xs mb-3 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Agents IA en temps réel
                  </p>
                  {engineState.agents.map((agent) => (
                    <AgentRow key={agent.id} agent={agent} />
                  ))}
                </motion.div>
              )}

              {/* Best opportunity + Execute */}
              <AnimatePresence>
                {bestOpportunity && engineState.running && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-xs mb-2 tracking-widest uppercase px-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Meilleure opportunité
                    </p>
                    <OppCard opp={bestOpportunity} onExecute={() => handleExecute(bestOpportunity)} />

                    <button
                      onClick={() => handleExecute(bestOpportunity)}
                      disabled={executing}
                      className="mt-3 w-full py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all active:scale-95 disabled:opacity-40"
                      style={{
                        background: "#34d399",
                        color: "#000000",
                      }}
                    >
                      {executing ? "Exécution en cours…" : `Exécuter · +$${fmt(bestOpportunity.netProfitUSD)}`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* All opportunities */}
              <AnimatePresence>
                {engineState.opportunities.length > 1 && engineState.running && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-xs mb-2 tracking-widest uppercase px-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Toutes les opportunités ({engineState.opportunities.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {engineState.opportunities.slice(1, 5).map((opp) => (
                        <OppCard key={opp.id} opp={opp} onExecute={() => handleExecute(opp)} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Last tx */}
              {lastTx && (
                <a
                  href={`https://etherscan.io/tx/${lastTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-center block"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Dernière tx: {fmtAddr(lastTx)} ↗
                </a>
              )}

              {/* Market info */}
              {engineState.running && (
                <div className="flex justify-between text-xs px-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  <span>ETH ${fmt(engineState.ethPriceUSD, 0)}</span>
                  <span>{fmt(engineState.gasGwei, 1)} Gwei</span>
                  {engineState.lastScanAt > 0 && (
                    <span>
                      Scan {Math.floor((Date.now() - engineState.lastScanAt) / 1000)}s ago
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.1)" }}>
          THESORIA 2026 · Aave V3 · Flash Loans · AI Sovereign
        </p>
      </footer>
    </div>
  );
}
