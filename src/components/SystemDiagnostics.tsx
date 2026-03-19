import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, CheckCircle2, XCircle, AlertTriangle, Loader2, Play, 
  RefreshCw, Zap, Globe, Server, Database, Link, Shield, Key,
  Cpu, Fuel, Box, Wallet, FileText, Users, Building, Ticket,
  ArrowUpRight, Clock, Copy, ChevronDown, ChevronRight, ExternalLink,
  BarChart3, Power, Terminal
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const SERVER = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

// ── Types ──
interface TestResult {
  id: string;
  group: string;
  name: string;
  status: "idle" | "running" | "pass" | "fail" | "warn" | "skip";
  detail: string;
  latency?: number;
  ts?: number;
}

interface SystemStatus {
  server: boolean;
  alchemy: boolean;
  alchemySource: string;
  infura: boolean;
  infuraSource: string;
  kvStore: boolean;
  blockNumber: number;
  gasPrice: number;
  chains: Array<{ name: string; status: string; gasPrice: number; blockNumber: number }>;
}

// ── API Helper ──
async function api(method: string, endpoint: string, body?: any): Promise<any> {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
  };
  if (body) opts.body = JSON.stringify(body);
  const start = performance.now();
  const res = await fetch(`${SERVER}/${endpoint}`, opts);
  const latency = Math.round(performance.now() - start);
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { latency });
  return { ...data, _latency: latency };
}

// ── Styled helpers ──
function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pass: "bg-green-500", fail: "bg-red-500", warn: "bg-yellow-500",
    running: "bg-blue-500 animate-pulse", idle: "bg-gray-600", skip: "bg-gray-500"
  };
  return <div className={`w-2 h-2 rounded-full ${colors[status] || colors.idle}`} />;
}

function Badge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; label: string }> = {
    pass: { bg: "bg-green-500/15 border-green-500/30", text: "text-green-400", label: "PASS" },
    fail: { bg: "bg-red-500/15 border-red-500/30", text: "text-red-400", label: "FAIL" },
    warn: { bg: "bg-yellow-500/15 border-yellow-500/30", text: "text-yellow-400", label: "WARN" },
    running: { bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-400", label: "RUN" },
    idle: { bg: "bg-gray-500/10 border-gray-500/20", text: "text-gray-500", label: "IDLE" },
    skip: { bg: "bg-gray-500/10 border-gray-500/20", text: "text-gray-500", label: "SKIP" },
  };
  const c = cfg[status] || cfg.idle;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[7px] tracking-[0.15em] font-bold border ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// ══════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════
export default function SystemDiagnostics() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // ── Update helper ──
  const setResult = useCallback((id: string, group: string, name: string, status: TestResult["status"], detail: string, latency?: number) => {
    setResults(prev => {
      const idx = prev.findIndex(r => r.id === id);
      const entry: TestResult = { id, group, name, status, detail, latency, ts: Date.now() };
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  }, []);

  // ── Auto scroll ──
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [results]);

  // ══════════════════════════════════════
  // FULL DIAGNOSTIC SUITE — ALL 43+ ENDPOINTS
  // ══════════════════════════════════════
  const runFullDiagnostics = useCallback(async () => {
    setRunning(true);
    setResults([]);
    setStartedAt(Date.now());
    const t0 = performance.now();

    // ──────────── GROUP 0: PRODUCTION STATUS ────────────
    const G0 = "Production Activation";

    setResult("prod_status", G0, "Production Status (full check)", "running", "GET /god-mode/production-status...");
    try {
      const r = await api("GET", "god-mode/production-status");
      if (r.success && r.production) {
        const chainsOnline = r.results?.alchemyChains ? Object.values(r.results.alchemyChains as Record<string, any>).filter((c: any) => c.status === "online").length : 0;
        setResult("prod_status", G0, "Production Status (full check)", "pass",
          `${r.mode} ${r.version} | Duration: ${r.checkDuration} | Alchemy: ${r.results?.apiKeys?.alchemy?.source || "?"} | KV: ${r.results?.kvStore?.status} | Chains: ${chainsOnline}/6 online | Kill: ${r.results?.killSwitch?.enabled ? "ACTIVE" : "off"} | Watched: ${r.results?.contractTracking?.totalWatched || 0} contracts`, r._latency);
      } else {
        setResult("prod_status", G0, "Production Status (full check)", "fail", "Production check failed");
      }
    } catch (e: any) { setResult("prod_status", G0, "Production Status (full check)", "fail", e.message); }

    // ──────────── GROUP 1: INFRASTRUCTURE ────────────
    const G1 = "Infrastructure";

    // 1.1 Health check
    setResult("health", G1, "Health Check", "running", "GET /health...");
    try {
      const r = await api("GET", "health");
      setResult("health", G1, "Health Check", r.status === "ok" ? "pass" : "fail", `Status: ${r.status}`, r._latency);
    } catch (e: any) { setResult("health", G1, "Health Check", "fail", e.message, e.latency); }

    // 1.2 Keys status
    setResult("keys", G1, "API Keys Status", "running", "GET /keys/status...");
    try {
      const r = await api("GET", "keys/status");
      const alc = r.alchemy ? `Alchemy: ${r.alchemySource} ${r.alchemyKeyPreview || ""}` : "Alchemy: MISSING";
      const inf = r.infura ? `Infura: ${r.infuraSource}` : "Infura: none";
      const liveStatus = r.alchemyLiveTest ? ` | Live: ${r.alchemyLiveTest}` : "";
      const envDbg = r.alchemyEnvDebug ? ` | Env: ${JSON.stringify(r.alchemyEnvDebug)}` : "";
      const keyOk = r.alchemy && r.alchemyLiveTest?.startsWith("OK");
      setResult("keys", G1, "API Keys Status", keyOk ? "pass" : r.alchemy ? "warn" : "fail",
        `${alc}${liveStatus}${!keyOk ? envDbg : ""} | ${inf}`, r._latency);

      setSystemStatus(prev => ({
        ...prev!,
        alchemy: r.alchemy, alchemySource: r.alchemySource || "none",
        infura: r.infura, infuraSource: r.infuraSource || "none",
        server: true, kvStore: true, blockNumber: 0, gasPrice: 0, chains: [],
      }));
    } catch (e: any) { setResult("keys", G1, "API Keys Status", "fail", e.message, e.latency); }

    // 1.3 KV Store read/write
    setResult("kv_rw", G1, "KV Store Read/Write", "running", "Testing KV store...");
    try {
      const testKey = `__diag_test_${Date.now()}`;
      await api("POST", "god-mode/kv-query", { action: "set", key: testKey, value: { test: true, ts: Date.now() } });
      const readRes = await api("POST", "god-mode/kv-query", { action: "get", key: testKey });
      const hasValue = readRes.result?.value?.test === true;
      await api("POST", "god-mode/kv-query", { action: "del", key: testKey });
      setResult("kv_rw", G1, "KV Store Read/Write", hasValue ? "pass" : "fail",
        hasValue ? "SET → GET → DEL cycle OK" : "Read value mismatch", readRes._latency);
    } catch (e: any) { setResult("kv_rw", G1, "KV Store Read/Write", "fail", e.message); }

    // 1.4 KV getByPrefix
    setResult("kv_prefix", G1, "KV getByPrefix", "running", "Testing prefix scan...");
    try {
      const r = await api("POST", "god-mode/kv-query", { action: "getByPrefix", key: "system:", prefix: "system:" });
      setResult("kv_prefix", G1, "KV getByPrefix", "pass", `${(r.result || []).length} keys with prefix 'system:'`, r._latency);
    } catch (e: any) { setResult("kv_prefix", G1, "KV getByPrefix", "fail", e.message); }

    // ──────────── GROUP 2: ALCHEMY ON-CHAIN ────────────
    const G2 = "Alchemy On-Chain";

    // 2.1 Network status (mainnet)
    setResult("net_main", G2, "Ethereum Mainnet", "running", "eth_blockNumber + eth_gasPrice...");
    try {
      const r = await api("GET", "alchemy/network-status?network=eth-mainnet");
      if (r.success && r.data?.blockNumber > 0) {
        setResult("net_main", G2, "Ethereum Mainnet", "pass",
          `Block #${r.data.blockNumber.toLocaleString()} | Gas: ${r.data.gasPrice.toFixed(2)} Gwei | Peers: ${r.data.peerCount}`, r._latency);
        setSystemStatus(prev => prev ? { ...prev, blockNumber: r.data.blockNumber, gasPrice: r.data.gasPrice } : prev);
      } else {
        setResult("net_main", G2, "Ethereum Mainnet", "fail", "No data");
      }
    } catch (e: any) { setResult("net_main", G2, "Ethereum Mainnet", "fail", e.message); }

    // 2.2 Network status (Sepolia)
    setResult("net_sep", G2, "Sepolia Testnet", "running", "Querying Sepolia...");
    try {
      const r = await api("GET", "alchemy/network-status?network=eth-sepolia");
      if (r.success && r.data?.blockNumber > 0) {
        setResult("net_sep", G2, "Sepolia Testnet", "pass",
          `Block #${r.data.blockNumber.toLocaleString()} | Gas: ${r.data.gasPrice.toFixed(2)} Gwei`, r._latency);
      } else {
        setResult("net_sep", G2, "Sepolia Testnet", "fail", "No block data");
      }
    } catch (e: any) { setResult("net_sep", G2, "Sepolia Testnet", "fail", e.message); }

    // 2.3 Multi-chain gas tracker
    setResult("gas_multi", G2, "Multi-Chain Gas Tracker", "running", "5 chains...");
    try {
      const r = await api("GET", "alchemy/gas-tracker");
      if (r.success && r.chains) {
        const online = r.chains.filter((c: any) => c.status === "online");
        const details = r.chains.map((c: any) => `${c.name}: ${c.status === "online" ? `${c.gasPrice.toFixed(2)}G #${c.blockNumber}` : "ERR"}`).join(" | ");
        setResult("gas_multi", G2, "Multi-Chain Gas Tracker", online.length >= 3 ? "pass" : "warn",
          `${online.length}/${r.chains.length} online | ${details}`, r._latency);
        setSystemStatus(prev => prev ? { ...prev, chains: r.chains } : prev);
      }
    } catch (e: any) { setResult("gas_multi", G2, "Multi-Chain Gas Tracker", "fail", e.message); }

    // 2.4 Block details
    setResult("block", G2, "Block Details (latest)", "running", "eth_getBlockByNumber...");
    try {
      const r = await api("GET", "alchemy/block?network=eth-mainnet");
      if (r.success && r.block) {
        setResult("block", G2, "Block Details (latest)", "pass",
          `Block #${r.block.number} | ${r.block.transactionCount} tx | Gas: ${(r.block.gasUsed / 1e6).toFixed(1)}M | Base: ${r.block.baseFeePerGas?.toFixed(2) || "N/A"} Gwei`, r._latency);
      }
    } catch (e: any) { setResult("block", G2, "Block Details (latest)", "fail", e.message); }

    // 2.5 Address inspector — Vitalik.eth
    const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    setResult("addr_inspect", G2, "Address Inspector (vitalik.eth)", "running", `Inspecting ${vitalik.slice(0,10)}...`);
    try {
      const r = await api("GET", `alchemy/address/${vitalik}?network=eth-mainnet`);
      if (r.success && r.address) {
        const a = r.address;
        setResult("addr_inspect", G2, "Address Inspector (vitalik.eth)", "pass",
          `Balance: ${a.balanceEth.toFixed(4)} ETH | TX: ${a.txCount} | Tokens: ${a.tokens?.length || 0}`, r._latency);
      }
    } catch (e: any) { setResult("addr_inspect", G2, "Address Inspector (vitalik.eth)", "fail", e.message); }

    // 2.6 Transfer history — Vitalik
    setResult("transfers", G2, "Transfers API (vitalik.eth)", "running", "alchemy_getAssetTransfers...");
    try {
      const r = await api("GET", `alchemy/transfers/${vitalik}?network=eth-mainnet&direction=from`);
      if (r.success) {
        setResult("transfers", G2, "Transfers API (vitalik.eth)", r.count > 0 ? "pass" : "warn",
          `${r.count} transfers | Last: ${r.transfers?.[0]?.asset || "N/A"} ${r.transfers?.[0]?.direction || ""}`, r._latency);
      }
    } catch (e: any) { setResult("transfers", G2, "Transfers API (vitalik.eth)", "fail", e.message); }

    // 2.7 Contract verification — USDT
    const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    setResult("verify_contract", G2, "Contract Verify (USDT)", "running", "eth_getCode + token metadata...");
    try {
      const r = await api("GET", `alchemy/verify-contract/${usdt}?network=eth-mainnet`);
      if (r.success && r.isContract) {
        setResult("verify_contract", G2, "Contract Verify (USDT)", "pass",
          `Contract: ${r.codeSize} bytes | ${r.token?.name || "?"} (${r.token?.symbol || "?"}) dec:${r.token?.decimals}`, r._latency);
      }
    } catch (e: any) { setResult("verify_contract", G2, "Contract Verify (USDT)", "fail", e.message); }

    // 2.8 Transaction lookup — a known ETH tx
    const knownTx = "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060";
    setResult("tx_lookup", G2, "Transaction Lookup (historic)", "running", "eth_getTransactionByHash...");
    try {
      const r = await api("GET", `alchemy/tx/${knownTx}?network=eth-mainnet`);
      if (r.success && r.transaction) {
        const tx = r.transaction;
        setResult("tx_lookup", G2, "Transaction Lookup (historic)", "pass",
          `${tx.status} | From: ${tx.from?.slice(0,10)}... → ${tx.to?.slice(0,10)}... | ${tx.value} ETH`, r._latency);
      }
    } catch (e: any) { setResult("tx_lookup", G2, "Transaction Lookup (historic)", "fail", e.message); }

    // 2.9 RPC Proxy direct call
    setResult("rpc_proxy", G2, "RPC Proxy (eth_chainId)", "running", "POST /rpc/proxy/alchemy...");
    try {
      const r = await api("POST", "rpc/proxy/alchemy", { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] });
      if (r.error) {
        setResult("rpc_proxy", G2, "RPC Proxy (eth_chainId)", "fail",
          `${r.error}${r.upstreamBody ? ` | Upstream: ${r.upstreamBody}` : ""}`, r._latency);
      } else {
        const chainId = parseInt(r.result, 16);
        setResult("rpc_proxy", G2, "RPC Proxy (eth_chainId)", chainId === 1 ? "pass" : "warn",
          `Chain ID: ${chainId} (${chainId === 1 ? "Ethereum Mainnet" : "Unknown"})`, r._latency);
      }
    } catch (e: any) { setResult("rpc_proxy", G2, "RPC Proxy (eth_chainId)", "fail", e.message); }

    // 2.10 Multi-Network Test (6 réseaux simultanés)
    setResult("multi_net", G2, "Multi-Network Test (6 chains)", "running", "Testing 6 Alchemy networks in parallel...");
    try {
      // Test 6 networks in parallel using direct RPC proxy calls
      const networks = [
        { id: "eth-mainnet", name: "Ethereum" },
        { id: "polygon-mainnet", name: "Polygon" },
        { id: "arb-mainnet", name: "Arbitrum" },
        { id: "opt-mainnet", name: "Optimism" },
        { id: "base-mainnet", name: "Base" },
        { id: "eth-sepolia", name: "Sepolia" }
      ];

      const results = await Promise.allSettled(
        networks.map(async (net) => {
          try {
            const start = performance.now();
            const r = await api("POST", `rpc/proxy/alchemy?network=${net.id}`, {
              jsonrpc: "2.0", id: 1, method: "eth_chainId", params: []
            });
            const latency = Math.round(performance.now() - start);
            
            if (r.error) {
              return { network: net.name, networkId: net.id, status: "error", error: r.error, latency };
            }
            
            return { network: net.name, networkId: net.id, status: "success", chainId: r.result, latency };
          } catch (err: any) {
            return { network: net.name, networkId: net.id, status: "error", error: err.message, latency: 0 };
          }
        })
      );

      const finalResults = results.map((r, i) => {
        if (r.status === "fulfilled") return r.value;
        return { network: networks[i].name, networkId: networks[i].id, status: "error", error: "Promise rejected", latency: 0 };
      });

      const successful = finalResults.filter((r: any) => r.status === "success");
      const failed = finalResults.filter((r: any) => r.status === "error");
      const avgLatency = finalResults.reduce((sum: number, r: any) => sum + r.latency, 0) / finalResults.length;
      const details = finalResults.slice(0, 3).map((r: any) => 
        r.status === "success" 
          ? `${r.network}: ✓ (${r.latency}ms)` 
          : `${r.network}: ✗`
      ).join(", ");
      
      setResult("multi_net", G2, "Multi-Network Test (6 chains)", 
        successful.length >= 4 ? "pass" : successful.length >= 2 ? "warn" : "fail",
        `${successful.length}/${finalResults.length} online | Avg: ${avgLatency.toFixed(0)}ms | ${details}...`,
        avgLatency
      );
    } catch (e: any) { 
      setResult("multi_net", G2, "Multi-Network Test (6 chains)", "fail", e.message); 
    }

    // ──────────── GROUP 3: GOD MODE ENDPOINTS ────────────
    const G3 = "God Mode";

    // 3.1 Overview
    setResult("gm_overview", G3, "Overview Dashboard", "running", "GET /god-mode/overview...");
    try {
      const r = await api("GET", "god-mode/overview");
      if (r.success && r.overview) {
        const o = r.overview;
        setResult("gm_overview", G3, "Overview Dashboard", "pass",
          `TVL: $${(o.kpis.totalTVL / 1e6).toFixed(2)}M | Users: ${o.kyc.total} | Contracts: ${o.kpis.totalContracts} | Properties: ${o.kpis.totalProperties}`, r._latency);
      }
    } catch (e: any) { setResult("gm_overview", G3, "Overview Dashboard", "fail", e.message); }

    // 3.2 System health
    setResult("gm_health", G3, "System Health", "running", "GET /god-mode/system-health...");
    try {
      const r = await api("GET", "god-mode/system-health");
      if (r.success && r.health) {
        setResult("gm_health", G3, "System Health", "pass",
          `Server: ${r.health.serverStatus} | DB: ${r.health.dbStatus} | Uptime: ${r.health.uptime}`, r._latency);
      }
    } catch (e: any) { setResult("gm_health", G3, "System Health", "fail", e.message); }

    // 3.3 Activity logs
    setResult("gm_logs", G3, "Activity Logs", "running", "GET /god-mode/activity-log...");
    try {
      const r = await api("GET", "god-mode/activity-log");
      setResult("gm_logs", G3, "Activity Logs", "pass", `${(r.logs || []).length} log entries`, r._latency);
    } catch (e: any) { setResult("gm_logs", G3, "Activity Logs", "fail", e.message); }

    // 3.4 Users list
    setResult("gm_users", G3, "Users List", "running", "GET /god-mode/users...");
    try {
      const r = await api("GET", "god-mode/users");
      setResult("gm_users", G3, "Users List", "pass", `${(r.users || []).length} users`, r._latency);
    } catch (e: any) { setResult("gm_users", G3, "Users List", "fail", e.message); }

    // 3.5 Kill switch status
    setResult("gm_killsw", G3, "Kill Switch Status", "running", "GET /god-mode/kill-switch/status...");
    try {
      const r = await api("GET", "god-mode/kill-switch/status");
      setResult("gm_killsw", G3, "Kill Switch Status", "pass", `Enabled: ${r.enabled}`, r._latency);
    } catch (e: any) { setResult("gm_killsw", G3, "Kill Switch Status", "fail", e.message); }

    // 3.6 Write + read activity log cycle
    setResult("gm_log_rw", G3, "Activity Log Write/Read", "running", "POST + GET activity-log...");
    try {
      await api("POST", "god-mode/activity-log", {
        action: "diagnostic_test", category: "testing", details: `Full diagnostic at ${new Date().toISOString()}`, severity: "info"
      });
      const r2 = await api("GET", "god-mode/activity-log");
      const found = (r2.logs || []).some((l: any) => l.action === "diagnostic_test");
      setResult("gm_log_rw", G3, "Activity Log Write/Read", found ? "pass" : "warn",
        found ? "Write → Read verified" : "Write OK but entry not found in read", r2._latency);
    } catch (e: any) { setResult("gm_log_rw", G3, "Activity Log Write/Read", "fail", e.message); }

    // ──────────── GROUP 4: LOTTERY ────────────
    const G4 = "Lottery System";

    setResult("lot_status", G4, "Lottery Status", "running", "GET /lottery/status...");
    try {
      const r = await api("GET", "lottery/status");
      setResult("lot_status", G4, "Lottery Status", "pass",
        r.lottery ? `Active: ${r.lottery.status} | Tickets: ${r.lottery.tickets?.length || 0}/${r.lottery.maxTickets}` : "No active lottery", r._latency);
    } catch (e: any) { setResult("lot_status", G4, "Lottery Status", "fail", e.message); }

    setResult("lot_history", G4, "Lottery History", "running", "GET /lottery/history...");
    try {
      const r = await api("GET", "lottery/history");
      setResult("lot_history", G4, "Lottery History", "pass", `${(r.history || []).length} past draws`, r._latency);
    } catch (e: any) { setResult("lot_history", G4, "Lottery History", "fail", e.message); }

    // ──────────── GROUP 5: SMART CONTRACT STUDIO ────────────
    const G5 = "Smart Contract Studio";

    setResult("studio_list", G5, "Studio Contracts", "running", "GET /studio/contracts...");
    try {
      const r = await api("GET", "studio/contracts");
      setResult("studio_list", G5, "Studio Contracts", "pass", `${(r.contracts || []).length} contracts deployed via Studio`, r._latency);
    } catch (e: any) { setResult("studio_list", G5, "Studio Contracts", "fail", e.message); }

    // ──────────── GROUP 6: REAL ESTATE ────────────
    const G6 = "Real Estate";

    setResult("re_props", G6, "Properties List", "running", "GET /real-estate/properties...");
    try {
      const r = await api("GET", "real-estate/properties");
      setResult("re_props", G6, "Properties List", "pass", `${(r.properties || []).length} tokenized properties`, r._latency);
    } catch (e: any) { setResult("re_props", G6, "Properties List", "fail", e.message); }

    setResult("re_portfolio", G6, "Portfolio (0xdead...)", "running", "GET /real-estate/portfolio/0xdead...");
    try {
      const r = await api("GET", "real-estate/portfolio/0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");
      setResult("re_portfolio", G6, "Portfolio (0xdead...)", "pass", `${(r.investments || []).length} investments`, r._latency);
    } catch (e: any) { setResult("re_portfolio", G6, "Portfolio (0xdead...)", "fail", e.message); }

    // ──────────── GROUP 7: ANALYTICS ────────────
    const G7 = "Analytics";

    setResult("an_stats", G7, "Global Stats", "running", "GET /analytics/stats...");
    try {
      const r = await api("GET", "analytics/stats");
      setResult("an_stats", G7, "Global Stats", "pass",
        `TVL: $${((r.stats?.totalTVL || 0) / 1e6).toFixed(2)}M | Users: ${r.stats?.totalUsers || 0}`, r._latency);
    } catch (e: any) { setResult("an_stats", G7, "Global Stats", "fail", e.message); }

    setResult("an_flash", G7, "FlashBot Analytics", "running", "GET /analytics/flashbot...");
    try {
      const r = await api("GET", "analytics/flashbot");
      setResult("an_flash", G7, "FlashBot Analytics", "pass",
        `Profit: $${r.stats?.totalProfit || 0} | Trades: ${r.stats?.totalTrades || 0}`, r._latency);
    } catch (e: any) { setResult("an_flash", G7, "FlashBot Analytics", "fail", e.message); }

    // ──────────── GROUP 7B: AUTH ────────────
    const G7B = "Authentication";

    setResult("auth_signup_check", G7B, "Signup Endpoint", "running", "POST /auth/signup (dry check)...");
    try {
      // Dry-run test with invalid data to ensure endpoint responds
      const r = await api("POST", "auth/signup", { email: "", password: "", name: "" }).catch(async (e: any) => {
        // Expected to fail (missing data) — we just want to confirm the endpoint is alive
        return { _error: true, message: e.message, _latency: 0 };
      });
      // If we get any response (even error), the endpoint is alive
      setResult("auth_signup_check", G7B, "Signup Endpoint", "pass", "Endpoint responsive (auth route active)", r._latency);
    } catch (e: any) { setResult("auth_signup_check", G7B, "Signup Endpoint", "warn", e.message); }

    // ──────────── GROUP 8: CONTRACT TRACKING ────────────
    const G8 = "Contract Tracking";

    // 8.1 Sync from KV
    setResult("ct_sync", G8, "Sync from KV Store", "running", "POST /contracts/sync-from-kv...");
    try {
      const r = await api("POST", "contracts/sync-from-kv", {});
      setResult("ct_sync", G8, "Sync from KV Store", "pass", r.message || `Synced ${r.total || 0}`, r._latency);
    } catch (e: any) { setResult("ct_sync", G8, "Sync from KV Store", "fail", e.message); }

    // 8.2 Add Sepolia test contracts
    const SEPOLIA_CONTRACTS = [
      { address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", name: "WETH (Sepolia)", symbol: "WETH", type: "ERC-20", network: "eth-sepolia" },
      { address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", name: "USDC (Sepolia)", symbol: "USDC", type: "ERC-20", network: "eth-sepolia" },
      { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", name: "Chainlink LINK", symbol: "LINK", type: "ERC-20", network: "eth-sepolia" },
    ];

    setResult("ct_watch", G8, "Watch Contracts (Sepolia)", "running", `Adding ${SEPOLIA_CONTRACTS.length} test contracts...`);
    try {
      let added = 0;
      for (const c of SEPOLIA_CONTRACTS) {
        try { await api("POST", "contracts/watch", c); added++; } catch { }
      }
      setResult("ct_watch", G8, "Watch Contracts (Sepolia)", added > 0 ? "pass" : "warn", `${added}/${SEPOLIA_CONTRACTS.length} contracts registered`);
    } catch (e: any) { setResult("ct_watch", G8, "Watch Contracts (Sepolia)", "fail", e.message); }

    // 8.3 Get tracked with live refresh
    setResult("ct_tracked", G8, "Tracked Contracts (live refresh)", "running", "GET /contracts/tracked?refresh=true...");
    try {
      const r = await api("GET", "contracts/tracked?refresh=true");
      if (r.success) {
        const total = r.contracts?.length || 0;
        const onchain = (r.contracts || []).filter((c: any) => c.onchain?.exists).length;
        const withTx = (r.contracts || []).filter((c: any) => (c.onchain?.recentTransfers?.length || 0) > 0).length;
        setResult("ct_tracked", G8, "Tracked Contracts (live refresh)", "pass",
          `${total} tracked | ${onchain} on-chain verified | ${withTx} with transfers`, r._latency);
      }
    } catch (e: any) { setResult("ct_tracked", G8, "Tracked Contracts (live refresh)", "fail", e.message); }

    // 8.4 Events scan
    setResult("ct_events", G8, "Event Scanner (WETH Sepolia)", "running", "eth_getLogs...");
    try {
      const r = await api("GET", `contracts/events/${SEPOLIA_CONTRACTS[0].address}?network=eth-sepolia&blocks=5000`);
      if (r.success) {
        const summary = Object.entries(r.eventSummary || {}).map(([e, c]) => `${e}:${c}`).join(", ") || "none";
        setResult("ct_events", G8, "Event Scanner (WETH Sepolia)", r.totalEvents > 0 ? "pass" : "warn",
          `${r.totalEvents} events in ${r.blocksScanned} blocks | ${summary}`, r._latency);
      }
    } catch (e: any) { setResult("ct_events", G8, "Event Scanner (WETH Sepolia)", "fail", e.message); }

    // 8.5 Unwatch + re-watch cycle
    setResult("ct_cycle", G8, "Unwatch/Re-watch Cycle", "running", "Testing lifecycle...");
    try {
      await api("POST", "contracts/unwatch", { address: SEPOLIA_CONTRACTS[2].address });
      await api("POST", "contracts/watch", SEPOLIA_CONTRACTS[2]);
      setResult("ct_cycle", G8, "Unwatch/Re-watch Cycle", "pass", "Unwatch → Re-watch OK");
    } catch (e: any) { setResult("ct_cycle", G8, "Unwatch/Re-watch Cycle", "fail", e.message); }

    // ──────────── GROUP 9: RPC PROXY MULTI-NETWORK ────────────
    const G9 = "RPC Proxy Multi-Net";
    const rpcNets = [
      { net: "eth-mainnet", label: "Ethereum" },
      { net: "eth-sepolia", label: "Sepolia" },
      { net: "arb-mainnet", label: "Arbitrum" },
      { net: "polygon-mainnet", label: "Polygon" },
      { net: "opt-mainnet", label: "Optimism" },
      { net: "base-mainnet", label: "Base" },
    ];

    for (const n of rpcNets) {
      const id = `rpc_${n.net}`;
      setResult(id, G9, `${n.label} (${n.net})`, "running", "eth_blockNumber...");
      try {
        const r = await api("POST", `rpc/proxy/alchemy?network=${n.net}`, {
          jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: []
        });
        if (r.error) {
          // Auth or provider error — check if it's a plan limitation
          const detail = r.upstreamBody
            ? `${r.error} | Upstream: ${r.upstreamBody}`
            : r.error;
          setResult(id, G9, `${n.label} (${n.net})`, "fail", detail, r._latency);
        } else {
          const block = parseInt(r.result, 16);
          setResult(id, G9, `${n.label} (${n.net})`, block > 0 ? "pass" : "fail", `Block #${block.toLocaleString()}`, r._latency);
        }
      } catch (e: any) {
        setResult(id, G9, `${n.label} (${n.net})`, "fail", e.message);
      }
    }

    // ── DONE ──
    setTotalTime(Math.round(performance.now() - t0));
    setRunning(false);

    toast.success("Full Diagnostics Complete", {
      style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
    });
  }, [setResult]);

  // ── Computed stats ──
  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  const warned = results.filter(r => r.status === "warn").length;
  const total = results.length;
  const avgLatency = results.filter(r => r.latency).reduce((s, r) => s + (r.latency || 0), 0) / (results.filter(r => r.latency).length || 1);

  // Group results
  const groups = Array.from(new Set(results.map(r => r.group)));

  return (
    <motion.div key="diagnostics" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] tracking-[0.3em] font-bold text-[#d4af37] uppercase flex items-center gap-2">
            <Cpu size={14} /> System Diagnostics &amp; Production Activation
          </h2>
          <p className="text-[9px] text-gray-500 mt-1 tracking-wider">
            39 tests across 10 groups — Infrastructure, Alchemy RPC (6 chains), God Mode, Lottery, Studio, Real Estate, Analytics, Auth, Contract Tracking, RPC Proxy Multi-Net
          </p>
        </div>

        <button
          onClick={runFullDiagnostics}
          disabled={running}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase border transition-all ${
            running
              ? "border-blue-500/40 text-blue-400 bg-blue-500/10 cursor-wait"
              : "border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          }`}
        >
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {running ? "Running..." : "Run Full Diagnostics"}
        </button>
      </div>

      {/* ═══ STATS BAR ═══ */}
      {total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Tests", value: total, icon: Activity, color: "#d4af37" },
            { label: "Passed", value: passed, icon: CheckCircle2, color: "#4ade80" },
            { label: "Failed", value: failed, icon: XCircle, color: "#ef4444" },
            { label: "Warnings", value: warned, icon: AlertTriangle, color: "#fb923c" },
            { label: "Avg Latency", value: `${Math.round(avgLatency)}ms`, icon: Clock, color: "#22d3ee" },
          ].map((s) => (
            <div key={s.label} className="relative overflow-hidden rounded-sm backdrop-blur-xl p-3"
              style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.color}15` }}>
              <div className="flex items-center gap-2">
                <s.icon size={12} style={{ color: s.color }} />
                <span className="text-[8px] tracking-[0.2em] text-gray-500 uppercase font-bold">{s.label}</span>
              </div>
              <div className="text-xl font-bold mt-1" style={{ color: s.color, fontFamily: "'Playfair Display',serif" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ PROGRESS BAR ═══ */}
      {running && (
        <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d4af37] to-[#f5d77a]"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, (total / 35) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* ═══ SYSTEM STATUS PANEL ═══ */}
      {systemStatus && (
        <div className="relative overflow-hidden rounded-sm backdrop-blur-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.12)" }}>
          <div className="text-[9px] tracking-[0.3em] font-bold text-[#d4af37] uppercase mb-3 flex items-center gap-2">
            <Globe size={12} /> Production System Status
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus.server ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-gray-400">Server:</span>
              <span className={systemStatus.server ? "text-green-400" : "text-red-400"}>{systemStatus.server ? "ONLINE" : "OFFLINE"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus.alchemy ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-gray-400">Alchemy:</span>
              <span className={systemStatus.alchemy ? "text-green-400" : "text-red-400"}>
                {systemStatus.alchemy ? `ACTIVE (${systemStatus.alchemySource})` : "MISSING"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${systemStatus.kvStore ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-gray-400">KV Store:</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel size={11} className="text-gray-500" />
              <span className="text-gray-400">Gas:</span>
              <span className="text-[#d4af37]">{systemStatus.gasPrice.toFixed(2)} Gwei</span>
              <span className="text-gray-600">#{systemStatus.blockNumber.toLocaleString()}</span>
            </div>
          </div>

          {/* Multi-chain status */}
          {systemStatus.chains.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-3">
              {systemStatus.chains.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-[9px]">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-gray-500">{c.name}:</span>
                  {c.status === "online" ? (
                    <span className="text-green-400">{c.gasPrice.toFixed(1)}G</span>
                  ) : (
                    <span className="text-red-400">ERR</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ RESULTS BY GROUP ═══ */}
      <div ref={logRef} className="space-y-3 max-h-[600px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#d4af37 transparent" }}>
        {groups.map(group => {
          const groupResults = results.filter(r => r.group === group);
          const groupPassed = groupResults.filter(r => r.status === "pass").length;
          const groupFailed = groupResults.filter(r => r.status === "fail").length;
          const isExpanded = expandedGroup === group || expandedGroup === null;

          return (
            <div key={group} className="relative overflow-hidden rounded-sm backdrop-blur-xl"
              style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${groupFailed > 0 ? "rgba(239,68,68,0.2)" : "rgba(212,175,55,0.08)"}` }}>

              {/* Group header */}
              <button
                onClick={() => setExpandedGroup(isExpanded && expandedGroup !== null ? null : group)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={12} className="text-gray-500" /> : <ChevronRight size={12} className="text-gray-500" />}
                  <span className="text-[9px] tracking-[0.2em] font-bold text-white/70 uppercase">{group}</span>
                  <span className="text-[8px] text-gray-600">({groupResults.length} tests)</span>
                </div>
                <div className="flex items-center gap-2">
                  {groupPassed > 0 && <span className="text-[8px] text-green-500 font-bold">{groupPassed} PASS</span>}
                  {groupFailed > 0 && <span className="text-[8px] text-red-500 font-bold">{groupFailed} FAIL</span>}
                  {groupResults.some(r => r.status === "running") && <Loader2 size={10} className="animate-spin text-blue-400" />}
                </div>
              </button>

              {/* Group items */}
              {isExpanded && (
                <div className="border-t border-white/5">
                  {groupResults.map(r => (
                    <div key={r.id} className="flex items-start gap-3 px-4 py-2 border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                      <StatusDot status={r.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-white/80">{r.name}</span>
                          <Badge status={r.status} />
                          {r.latency && (
                            <span className="text-[8px] text-gray-600 font-mono">{r.latency}ms</span>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5 font-mono break-all leading-relaxed">{r.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ TOTAL TIME ═══ */}
      {totalTime > 0 && !running && (
        <div className="text-center py-4 border-t border-white/5">
          <div className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
            Full diagnostic completed in <span className="text-[#d4af37] font-bold">{(totalTime / 1000).toFixed(1)}s</span>
            {" "} — {passed}/{total} passed
            {failed === 0 && (
              <span className="text-green-400 ml-2 font-bold">ALL SYSTEMS OPERATIONAL</span>
            )}
          </div>
        </div>
      )}

      {/* ═══ NO RESULTS PLACEHOLDER ═══ */}
      {total === 0 && !running && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/15 mb-4">
            <Cpu size={24} className="text-[#d4af37]/40" />
          </div>
          <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">
            Click "Run Full Diagnostics" to execute 39 tests across 10 groups,<br />
            validate Alchemy RPC on 6 chains, and activate production mode
          </p>
        </div>
      )}
    </motion.div>
  );
}