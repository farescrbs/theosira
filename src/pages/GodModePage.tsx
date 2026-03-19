import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert, Activity, Eye, Zap, Key, Terminal, Lock, Unlock, Users, Globe,
  Database, RefreshCw, AlertTriangle, Fingerprint, Crosshair, Ticket,
  TrendingUp, DollarSign, BarChart3, Building, Shield, Server, Clock,
  CheckCircle2, XCircle, Trash2, UserX, UserCheck, FileText, Hash,
  ArrowUpRight, ArrowDownRight, Cpu, ChevronRight, Power, Search, Copy,
  Link, Fuel, Box, Wallet, ExternalLink, Loader2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import SystemDiagnostics from "../components/SystemDiagnostics";
import AlchemyKeyDiagnostic from "../components/AlchemyKeyDiagnostic";
import GodModeWeb3Tab from "../components/GodModeWeb3Tab";
import AlchemyErrorHelper from "../components/AlchemyErrorHelper";
import { useWeb3GodMode } from "../hooks/useWeb3GodMode";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from "recharts@2.15.2";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;
const GOD_PIN = "THESORIA2026";

// ── TYPES ──
interface Overview {
  kpis: {
    totalTVL: number;
    totalTokensSold: number;
    uniqueInvestors: number;
    totalProperties: number;
    totalContracts: number;
    totalSeizures: number;
    lotteryWinners: number;
    killSwitchActive: boolean;
  };
  kyc: { total: number; verified: number; godMode: number };
  kycList: Array<{ address: string; status: string; tier: string; verifiedBy: string; timestamp: number }>;
  properties: Array<{ id: string; title: string; location: string; totalValue: number; tokensSold: number; tokenSupply: number; investorCount: number; status: string; createdAt: number }>;
  contracts: Array<{ id: string; type: string; name: string; symbol: string; address: string; status: string; network: string; deployedAt: number }>;
  seizures: Array<{ id: string; token: string; from: string; to: string; amount: string; status: string; timestamp: number }>;
  currentLottery: any;
  flashbot: any;
  timestamp: number;
}

interface ActivityLog {
  id: string;
  action: string;
  category: string;
  details: string;
  severity: string;
  timestamp: number;
}

// ── HELPERS ──
function fmtAddr(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
function fmtDate(ts: number) {
  if (!ts) return "N/A";
  return new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function fmtMoney(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}
function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return `${Math.floor(diff / 86_400_000)}j`;
}

// ── GLASSMORPHIC CARD ──
function GCard({ children, className = "", danger = false }: { children: React.ReactNode; className?: string; danger?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-sm backdrop-blur-xl p-5 ${className}`}
      style={{
        background: danger ? "rgba(127,29,29,0.15)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "rgba(212,175,55,0.12)"}`,
      }}>
      {/* HUD corners */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 pointer-events-none opacity-30">
        <svg viewBox="0 0 12 12" fill="none"><path d="M0 6 L0 0 L6 0" stroke={danger ? "#ef4444" : "#d4af37"} strokeWidth="1" /></svg>
      </div>
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 pointer-events-none opacity-30">
        <svg viewBox="0 0 12 12" fill="none"><path d="M12 6 L12 12 L6 12" stroke={danger ? "#ef4444" : "#d4af37"} strokeWidth="1" /></svg>
      </div>
      {children}
    </div>
  );
}

// ── SECTION TITLE ──
function STitle({ icon: Icon, title, color = "#d4af37", children }: { icon: any; title: string; color?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={13} style={{ color }} />
        <span className="text-[10px] tracking-[0.3em] font-bold text-white/60 uppercase" style={{ fontFamily: "'Montserrat',sans-serif" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── SEVERITY BADGE ──
function SeverityBadge({ level }: { level: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    info: { color: "#67e8f9", label: "INFO" },
    success: { color: "#4ade80", label: "OK" },
    warning: { color: "#fb923c", label: "WARN" },
    error: { color: "#f87171", label: "ERR" },
    critical: { color: "#ef4444", label: "CRIT" },
  };
  const { color, label } = cfg[level] || cfg.info;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[7px] tracking-[0.2em] font-bold"
      style={{ background: `${color}15`, border: `1px solid ${color}35`, color }}>
      {label}
    </span>
  );
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export default function GodModePage() {
  // ── AUTH ──
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("god_mode_auth") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // ── WEB3 INTEGRATION ──
  const web3 = useWeb3GodMode();

  // ── DATA ──
  const [overview, setOverview] = useState<Overview | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ── UI ──
  const [activeTab, setActiveTab] = useState("dashboard");
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [pollHistory, setPollHistory] = useState<Array<{ t: string; tvl: number; users: number; contracts: number }>>([]);

  // ── FORM STATES ──
  const [kycAddress, setKycAddress] = useState("");
  const [kycTier, setKycTier] = useState("Investisseur Qualifie (Tier 1)");
  const [txToken, setTxToken] = useState("");
  const [txFrom, setTxFrom] = useState("");
  const [txTo, setTxTo] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [dbCommand, setDbCommand] = useState("");
  const [dbOutput, setDbOutput] = useState("> THESORIA KV_STORE TERMINAL\n> Type: get <key> | set <key> <value> | del <key> | getByPrefix <prefix>\n> Ready.\n");
  const [lotteryMaxTickets, setLotteryMaxTickets] = useState("1000");
  const [lotteryTicketPrice, setLotteryTicketPrice] = useState("100000000000000000");
  const [searchFilter, setSearchFilter] = useState("");

  // ── ON-CHAIN (ALCHEMY) STATES ──
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [gasTracker, setGasTracker] = useState<any[]>([]);
  const [gasHistory, setGasHistory] = useState<Array<{ t: string; gas: number; block: number }>>([]);
  const [inspectAddr, setInspectAddr] = useState("");
  const [addrResult, setAddrResult] = useState<any>(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txResult, setTxResult] = useState<any>(null);
  const [txLoading, setTxLoading] = useState(false);
  const [transfersAddr, setTransfersAddr] = useState("");
  const [transfers, setTransfers] = useState<any[]>([]);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("eth-mainnet");
  const [alchemyConnected, setAlchemyConnected] = useState(false);
  const [alchemyError, setAlchemyError] = useState<string | null>(null);

  // ── CONTRACT TRACKING STATES ──
  const [trackedContracts, setTrackedContracts] = useState<any[]>([]);
  const [trackedLoading, setTrackedLoading] = useState(false);
  const [watchAddr, setWatchAddr] = useState("");
  const [watchName, setWatchName] = useState("");
  const [watchSymbol, setWatchSymbol] = useState("");
  const [watchType, setWatchType] = useState("ERC-3643");
  const [watchNetwork, setWatchNetwork] = useState("eth-mainnet");
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [contractEvents, setContractEvents] = useState<any>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [testSuiteRunning, setTestSuiteRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ name: string; step: string; status: "pending" | "running" | "pass" | "fail" | "warn"; detail: string; ts: number }>>([]);

  const dbTermRef = useRef<HTMLDivElement>(null);

  // ── PIN AUTH ──
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === GOD_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("god_mode_auth", "true");
      logActivity("God Mode accessed", "auth", "Admin logged in", "info");
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  // ── API HELPER ──
  const apiCall = useCallback(async (method: string, endpoint: string, body?: any) => {
    const opts: RequestInit = {
      method,
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${SERVER_URL}/${endpoint}`, opts);
    // Read body as text first (stream can only be consumed once)
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`HTTP ${res.status}: non-JSON response — ${text.substring(0, 200)}`);
    }
    if (!res.ok) throw new Error(data.error || data.hint || `Request failed (HTTP ${res.status})`);
    return data;
  }, []);

  // ── FETCH ALL DATA ──
  const fetchAll = useCallback(async () => {
    try {
      const [overviewRes, logsRes, healthRes] = await Promise.all([
        apiCall("GET", "god-mode/overview"),
        apiCall("GET", "god-mode/activity-log"),
        apiCall("GET", "god-mode/system-health"),
      ]);

      if (overviewRes.success) setOverview(overviewRes.overview);
      if (logsRes.success) setActivityLogs(logsRes.logs || []);
      if (healthRes.success) setSystemHealth(healthRes.health);

      // Add to poll history for chart (unique timestamp keys to avoid recharts duplicate key warning)
      if (overviewRes.success) {
        const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setPollHistory(prev => {
          let uniqueT = now;
          const dupes = prev.filter(p => p.t.startsWith(now));
          if (dupes.length > 0) uniqueT = `${now}.${dupes.length}`;
          return [
            ...prev.slice(-20),
            {
              t: uniqueT,
              tvl: overviewRes.overview.kpis.totalTVL,
              users: overviewRes.overview.kyc.total,
              contracts: overviewRes.overview.kpis.totalContracts,
            }
          ];
        });
      }

      setLastRefresh(Date.now());
    } catch (err) {
      console.error("God Mode fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // ── AUTO REFRESH ──
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAll();
    if (!autoRefresh) return;
    const interval = setInterval(fetchAll, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, fetchAll]);

  // ── ALCHEMY ON-CHAIN FETCH ──
  const fetchNetworkStatus = useCallback(async () => {
    try {
      const res = await apiCall("GET", `alchemy/network-status?network=${selectedNetwork}`);
      if (res.success && res.data) {
        setNetworkStatus(res.data);
        setAlchemyConnected(true);
        setAlchemyError(null);
        const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setGasHistory(prev => {
          let uniqueT = now;
          const dupes = prev.filter(p => p.t.startsWith(now));
          if (dupes.length > 0) uniqueT = `${now}.${dupes.length}`;
          return [...prev.slice(-30), { t: uniqueT, gas: res.data.gasPrice, block: res.data.blockNumber }];
        });
      } else {
        setAlchemyConnected(false);
        // Check if it's an auth error
        if (res.error?.includes('ALCHEMY_KEY_INVALID') || res.error?.includes('unauthorized') || res.error?.includes('401')) {
          setAlchemyError("⚠️ Clé Alchemy invalide ou expirée. Veuillez mettre à jour ALCHEMY_API_KEY dans les secrets Supabase.");
        } else {
          setAlchemyError(res.error || res.hint || "Unknown error from Alchemy endpoint");
        }
        console.error("Alchemy network-status error response:", res);
      }
    } catch (err: any) {
      setAlchemyConnected(false);
      // Check if it's an auth error
      if (err.message?.includes('ALCHEMY_KEY_INVALID') || err.message?.includes('401') || err.message?.includes('unauthorized')) {
        setAlchemyError("⚠️ Clé Alchemy invalide ou expirée. Veuillez mettre à jour ALCHEMY_API_KEY.");
        // Ne pas spammer la console avec ces erreurs connues
        if (!err.message?.includes('ALCHEMY_KEY_INVALID')) {
          console.error("Alchemy fetchNetworkStatus exception:", err);
        }
      } else {
        setAlchemyError(err.message || "Network request failed");
        console.error("Alchemy fetchNetworkStatus exception:", err);
      }
    }
  }, [apiCall, selectedNetwork]);

  const fetchGasTracker = useCallback(async () => {
    try {
      const res = await apiCall("GET", "alchemy/gas-tracker");
      if (res.success) setGasTracker(res.chains || []);
    } catch (err) {
      console.error("Gas tracker error:", err);
    }
  }, [apiCall]);

  // Auto-fetch on-chain data when on the onchain tab
  useEffect(() => {
    if (!isAuthenticated || activeTab !== "onchain") return;
    fetchNetworkStatus();
    fetchGasTracker();
    const interval = setInterval(() => {
      fetchNetworkStatus();
      fetchGasTracker();
    }, 12000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab, fetchNetworkStatus, fetchGasTracker]);

  const inspectAddress = async () => {
    if (!inspectAddr || !/^0x[a-fA-F0-9]{40}$/.test(inspectAddr)) {
      toast.error("Invalid Ethereum address (0x...)");
      return;
    }
    setAddrLoading(true);
    setAddrResult(null);
    try {
      const res = await apiCall("GET", `alchemy/address/${inspectAddr}?network=${selectedNetwork}`);
      if (res.success) setAddrResult(res.address);
      await logActivity("address_inspect", "onchain", `Inspected ${inspectAddr}`, "info");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAddrLoading(false);
    }
  };

  const lookupTx = async () => {
    if (!txHash || !txHash.startsWith("0x")) {
      toast.error("Invalid transaction hash (0x...)");
      return;
    }
    setTxLoading(true);
    setTxResult(null);
    try {
      const res = await apiCall("GET", `alchemy/tx/${txHash}?network=${selectedNetwork}`);
      if (res.success) setTxResult(res.transaction);
      await logActivity("tx_lookup", "onchain", `Looked up ${txHash}`, "info");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  const fetchTransfers = async () => {
    if (!transfersAddr || !/^0x[a-fA-F0-9]{40}$/.test(transfersAddr)) {
      toast.error("Invalid address");
      return;
    }
    setTransfersLoading(true);
    setTransfers([]);
    try {
      const res = await apiCall("GET", `alchemy/transfers/${transfersAddr}?network=${selectedNetwork}`);
      if (res.success) setTransfers(res.transfers || []);
      await logActivity("transfers_fetch", "onchain", `Transfers for ${transfersAddr}`, "info");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTransfersLoading(false);
    }
  };

  // ── CONTRACT TRACKING ──
  const fetchTrackedContracts = useCallback(async (forceRefresh = false) => {
    setTrackedLoading(true);
    try {
      const res = await apiCall("GET", `contracts/tracked${forceRefresh ? "?refresh=true" : ""}`);
      if (res.success) setTrackedContracts(res.contracts || []);
    } catch (err) {
      console.error("Tracked contracts error:", err);
    } finally {
      setTrackedLoading(false);
    }
  }, [apiCall]);

  const syncContractsFromKV = async () => {
    try {
      const res = await apiCall("POST", "contracts/sync-from-kv", {});
      toast.success(res.message || "Synced", { style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" } });
      await logActivity("contracts_sync", "contracts", res.message, "success");
      fetchTrackedContracts(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const watchContract = async () => {
    if (!watchAddr || !/^0x[a-fA-F0-9]{40}$/i.test(watchAddr)) {
      toast.error("Valid contract address required (0x...)");
      return;
    }
    try {
      await apiCall("POST", "contracts/watch", {
        address: watchAddr, name: watchName || "Unknown",
        symbol: watchSymbol || "???", type: watchType, network: watchNetwork,
      });
      toast.success(`Tracking ${fmtAddr(watchAddr)}`, { style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" } });
      await logActivity("contract_watch", "contracts", `Watching ${watchAddr}`, "success");
      setWatchAddr(""); setWatchName(""); setWatchSymbol("");
      fetchTrackedContracts(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const unwatchContract = async (addr: string) => {
    try {
      await apiCall("POST", "contracts/unwatch", { address: addr });
      toast.success(`Unwatched ${fmtAddr(addr)}`, { style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" } });
      setTrackedContracts(prev => prev.filter(c => c.address !== addr));
      if (expandedContract === addr) { setExpandedContract(null); setContractEvents(null); }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const fetchContractEvents = async (addr: string, network: string) => {
    setEventsLoading(true);
    setContractEvents(null);
    try {
      const res = await apiCall("GET", `contracts/events/${addr}?network=${network}&blocks=5000`);
      if (res.success) setContractEvents(res);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setEventsLoading(false);
    }
  };

  // ── SEPOLIA TEST SUITE ──
  const SEPOLIA_TEST_CONTRACTS = [
    { address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", name: "Wrapped Ether (WETH)", symbol: "WETH", type: "ERC-20", network: "eth-sepolia" },
    { address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", name: "USD Coin (USDC)", symbol: "USDC", type: "ERC-20", network: "eth-sepolia" },
    { address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", name: "Uniswap WETH9", symbol: "WETH", type: "ERC-20", network: "eth-sepolia" },
    { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", name: "Chainlink Token", symbol: "LINK", type: "ERC-20", network: "eth-sepolia" },
    { address: "0x694AA1769357215DE4FAC081bf1f309aDC325306", name: "Chainlink ETH/USD Feed", symbol: "FEED", type: "Oracle", network: "eth-sepolia" },
  ];

  const addTestContracts = async () => {
    let added = 0;
    for (const c of SEPOLIA_TEST_CONTRACTS) {
      const alreadyTracked = trackedContracts.some(t => t.address === c.address.toLowerCase());
      if (alreadyTracked) continue;
      try {
        await apiCall("POST", "contracts/watch", c);
        added++;
      } catch (err) {
        console.error(`Failed to add ${c.name}:`, err);
      }
    }
    toast.success(`${added} Sepolia contracts added`, { style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" } });
    await logActivity("sepolia_test_add", "contracts", `Added ${added} test contracts`, "success");
    fetchTrackedContracts(true);
  };

  const updateTestResult = (name: string, step: string, status: "pending" | "running" | "pass" | "fail" | "warn", detail: string) => {
    setTestResults(prev => {
      const existing = prev.findIndex(r => r.name === name && r.step === step);
      const entry = { name, step, status, detail, ts: Date.now() };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  };

  const runSepoliaTestSuite = async () => {
    setTestSuiteRunning(true);
    setTestResults([]);

    const testContract = SEPOLIA_TEST_CONTRACTS[0]; // WETH
    const testAddr = testContract.address;

    // ── TEST 1: Alchemy Sepolia connectivity ──
    updateTestResult("Alchemy RPC", "Sepolia eth_blockNumber", "running", "Querying...");
    try {
      const res = await apiCall("GET", "alchemy/network-status?network=eth-sepolia");
      if (res.success && res.data?.blockNumber > 0) {
        updateTestResult("Alchemy RPC", "Sepolia eth_blockNumber", "pass", `Block #${res.data.blockNumber.toLocaleString()} | Gas: ${res.data.gasPrice.toFixed(2)} Gwei`);
      } else {
        updateTestResult("Alchemy RPC", "Sepolia eth_blockNumber", "fail", "No block data returned");
      }
    } catch (err: any) {
      updateTestResult("Alchemy RPC", "Sepolia eth_blockNumber", "fail", err.message);
    }

    // ── TEST 2: Watch contract endpoint ──
    updateTestResult("Watch Contract", "POST contracts/watch", "running", `Adding ${testContract.name}...`);
    try {
      const res = await apiCall("POST", "contracts/watch", testContract);
      if (res.success) {
        updateTestResult("Watch Contract", "POST contracts/watch", "pass", `Stored: watch:${testAddr.toLowerCase()}`);
      } else {
        updateTestResult("Watch Contract", "POST contracts/watch", "fail", "Response not success");
      }
    } catch (err: any) {
      updateTestResult("Watch Contract", "POST contracts/watch", "fail", err.message);
    }

    // ── TEST 3: Contract verification (eth_getCode) ──
    updateTestResult("On-Chain Verify", "eth_getCode", "running", `Verifying ${fmtAddr(testAddr)} on Sepolia...`);
    try {
      const res = await apiCall("GET", `alchemy/verify-contract/${testAddr}?network=eth-sepolia`);
      if (res.success && res.isContract) {
        updateTestResult("On-Chain Verify", "eth_getCode", "pass", `Contract verified | Code: ${res.codeSize} bytes${res.token ? ` | Token: ${res.token.name} (${res.token.symbol})` : ""}`);
      } else if (res.success && !res.isContract) {
        updateTestResult("On-Chain Verify", "eth_getCode", "warn", "Address is EOA (not a contract) — expected for some addresses");
      } else {
        updateTestResult("On-Chain Verify", "eth_getCode", "fail", "Verification failed");
      }
    } catch (err: any) {
      updateTestResult("On-Chain Verify", "eth_getCode", "fail", err.message);
    }

    // ── TEST 4: Address inspection (balance + tokens) ──
    updateTestResult("Address Inspector", "Balance + Token Balances", "running", "Fetching...");
    try {
      const res = await apiCall("GET", `alchemy/address/${testAddr}?network=eth-sepolia`);
      if (res.success && res.address) {
        const a = res.address;
        updateTestResult("Address Inspector", "Balance + Token Balances", "pass",
          `Balance: ${a.balanceEth.toFixed(6)} ETH | TX Count: ${a.txCount} | isContract: ${a.isContract} | Code: ${a.codeSize} bytes | Tokens: ${a.tokens?.length || 0}`);
      } else {
        updateTestResult("Address Inspector", "Balance + Token Balances", "fail", "No address data returned");
      }
    } catch (err: any) {
      updateTestResult("Address Inspector", "Balance + Token Balances", "fail", err.message);
    }

    // ── TEST 5: Transfer history ──
    updateTestResult("Transfers API", "alchemy_getAssetTransfers", "running", "Fetching recent transfers...");
    try {
      const res = await apiCall("GET", `alchemy/transfers/${testAddr}?network=eth-sepolia`);
      if (res.success) {
        updateTestResult("Transfers API", "alchemy_getAssetTransfers", res.count > 0 ? "pass" : "warn",
          `${res.count} transfers found${res.count > 0 ? ` | Last: ${res.transfers[0]?.asset || "ETH"} ${res.transfers[0]?.direction || ""}` : " (contract may have no recent activity)"}`);
      } else {
        updateTestResult("Transfers API", "alchemy_getAssetTransfers", "fail", "API call failed");
      }
    } catch (err: any) {
      updateTestResult("Transfers API", "alchemy_getAssetTransfers", "fail", err.message);
    }

    // ── TEST 6: Event log scan ──
    updateTestResult("Event Scanner", "eth_getLogs (5000 blocks)", "running", "Scanning blockchain events...");
    try {
      const res = await apiCall("GET", `contracts/events/${testAddr}?network=eth-sepolia&blocks=5000`);
      if (res.success) {
        const summary = Object.entries(res.eventSummary || {}).map(([e, c]) => `${e}:${c}`).join(", ") || "none";
        updateTestResult("Event Scanner", "eth_getLogs (5000 blocks)", res.totalEvents > 0 ? "pass" : "warn",
          `${res.totalEvents} events | Block range: ${res.currentBlock - res.blocksScanned}→${res.currentBlock} | Summary: ${summary}`);
      } else {
        updateTestResult("Event Scanner", "eth_getLogs (5000 blocks)", "fail", "Event scan failed");
      }
    } catch (err: any) {
      updateTestResult("Event Scanner", "eth_getLogs (5000 blocks)", "fail", err.message);
    }

    // ── TEST 7: Full tracked contracts pipeline ──
    updateTestResult("Full Pipeline", "GET contracts/tracked?refresh=true", "running", "Full pipeline refresh...");
    try {
      const res = await apiCall("GET", "contracts/tracked?refresh=true");
      if (res.success) {
        const sepoliaContracts = (res.contracts || []).filter((c: any) => c.network?.includes("sepolia"));
        const onchainCount = sepoliaContracts.filter((c: any) => c.onchain?.exists === true).length;
        const withTransfers = sepoliaContracts.filter((c: any) => (c.onchain?.recentTransfers?.length || 0) > 0).length;
        const withEvents = sepoliaContracts.filter((c: any) => (c.onchain?.logCount || 0) > 0).length;
        updateTestResult("Full Pipeline", "GET contracts/tracked?refresh=true", "pass",
          `${res.count} total tracked | ${sepoliaContracts.length} Sepolia | ${onchainCount} verified on-chain | ${withTransfers} with transfers | ${withEvents} with events`);
        setTrackedContracts(res.contracts || []);
      } else {
        updateTestResult("Full Pipeline", "GET contracts/tracked?refresh=true", "fail", "Pipeline failed");
      }
    } catch (err: any) {
      updateTestResult("Full Pipeline", "GET contracts/tracked?refresh=true", "fail", err.message);
    }

    // ── TEST 8: Unwatch cleanup test ──
    updateTestResult("Cleanup", "POST contracts/unwatch (then re-add)", "running", "Testing unwatch...");
    try {
      await apiCall("POST", "contracts/unwatch", { address: testAddr });
      // Re-add immediately
      await apiCall("POST", "contracts/watch", testContract);
      updateTestResult("Cleanup", "POST contracts/unwatch (then re-add)", "pass", "Unwatch + re-watch cycle OK");
    } catch (err: any) {
      updateTestResult("Cleanup", "POST contracts/unwatch (then re-add)", "fail", err.message);
    }

    await logActivity("sepolia_test_suite", "testing", `Test suite completed — ${testResults.filter(r => r.status === "pass").length} passed`, "info");
    setTestSuiteRunning(false);
    fetchTrackedContracts(true);
  };

  // Auto-fetch tracked contracts when on contracts tab
  useEffect(() => {
    if (!isAuthenticated || activeTab !== "contracts") return;
    fetchTrackedContracts();
    const interval = setInterval(() => fetchTrackedContracts(), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab, fetchTrackedContracts]);

  // ── LOG ACTIVITY ──
  const logActivity = useCallback(async (action: string, category: string, details: string, severity: string) => {
    try {
      await apiCall("POST", "god-mode/activity-log", { action, category, details, severity });
    } catch (e) { /* silent */ }
  }, [apiCall]);

  // ── ACTION WITH TOAST ──
  const executeAction = useCallback(async (endpoint: string, payload: any, actionName: string, successMsg?: string) => {
    setProcessingAction(actionName);
    try {
      const data = await apiCall("POST", `god-mode/${endpoint}`, payload);
      toast.success(successMsg || data.message || "Success", {
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
      await logActivity(actionName, "action", JSON.stringify(payload).slice(0, 200), "success");
      fetchAll();
      return data;
    } catch (error: any) {
      toast.error(error.message, {
        style: { background: "#1a0000", border: "1px solid #ef4444", color: "#fca5a5" }
      });
      await logActivity(actionName, "error", error.message, "error");
      throw error;
    } finally {
      setProcessingAction(null);
    }
  }, [apiCall, logActivity, fetchAll]);

  // ── KILL SWITCH ──
  const toggleKillSwitch = async () => {
    const newState = !overview?.kpis.killSwitchActive;
    await executeAction("kill-switch", { enabled: newState }, "kill_switch",
      newState ? "KILL SWITCH ACTIVE - Network FROZEN" : "Network RESUMED"
    );
  };

  // ── KYC OVERRIDE ──
  const executeKycOverride = async () => {
    if (!kycAddress) return toast.error("Adresse requise");
    await executeAction("override-kyc", { address: kycAddress, tier: kycTier }, "kyc_override");
    setKycAddress("");
  };

  // ── REVOKE KYC ──
  const revokeKyc = async (address: string) => {
    await executeAction("revoke-kyc", { address }, "kyc_revoke", `KYC revoked: ${fmtAddr(address)}`);
  };

  // ── FORCE TRANSFER ──
  const executeForceTransfer = async () => {
    if (!txToken || !txFrom || !txTo || !txAmount) return toast.error("All fields required");
    await executeAction("force-transfer", { token: txToken, from: txFrom, to: txTo, amount: txAmount }, "force_transfer");
    setTxToken(""); setTxFrom(""); setTxTo(""); setTxAmount("");
  };

  // ── LOTTERY ──
  const startLottery = async () => {
    try {
      await apiCall("POST", "lottery/start", { maxTickets: lotteryMaxTickets, ticketPrice: lotteryTicketPrice });
      toast.success("Lottery started", { style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" } });
      await logActivity("lottery_start", "lottery", `Max: ${lotteryMaxTickets}, Price: ${lotteryTicketPrice}`, "success");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const pickWinner = async () => {
    try {
      const res = await apiCall("POST", "lottery/pick-winner", {});
      toast.success(`Winner: ${fmtAddr(res.winner?.address)}`, { style: { background: "#020202", border: "1px solid #22c55e", color: "#22c55e" } });
      await logActivity("lottery_winner", "lottery", `Winner: ${res.winner?.address}`, "success");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // ── PURGE LOGS ──
  const purgeLogs = async () => {
    await executeAction("purge-logs", {}, "purge_logs", "Activity logs purged");
  };

  // ── DB TERMINAL ──
  const executeDbCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !dbCommand.trim()) return;
    const cmd = dbCommand.trim();
    setDbCommand("");
    setDbOutput(prev => prev + `\n> ${cmd}`);

    const parts = cmd.split(" ");
    const action = parts[0];
    const key = parts[1];
    const value = parts.slice(2).join(" ");

    if (!["get", "set", "del", "getByPrefix"].includes(action)) {
      setDbOutput(prev => prev + "\n[ERROR] Unknown command.\n");
      return;
    }

    try {
      const data = await apiCall("POST", "god-mode/kv-query", { action, key, value, prefix: key });
      setDbOutput(prev => prev + `\n${JSON.stringify(data, null, 2)}\n`);
      await logActivity(`db_${action}`, "database", `Key: ${key}`, "info");
    } catch (err: any) {
      setDbOutput(prev => prev + `\n[ERROR] ${err.message}\n`);
    }

    setTimeout(() => {
      if (dbTermRef.current) dbTermRef.current.scrollTop = dbTermRef.current.scrollHeight;
    }, 50);
  };

  // ── COPY TO CLIPBOARD ──
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied", { duration: 1000, style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" } });
  };

  // ══════════════════════════════════════════
  // PIN GATE
  // ══════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center px-4 font-['Montserrat']">
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 pointer-events-none mix-blend-overlay" />
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <GCard>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6 relative">
                <motion.div className="absolute inset-0 rounded-full border border-red-500/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }} />
                <ShieldAlert className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-[0.2em] text-red-500 uppercase mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Omniscience Protocol
              </h1>
              <p className="text-[10px] tracking-[0.4em] text-[#d4af37]/60 uppercase">
                God Mode // Authorization Required
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mb-2 block font-semibold">Access Code</label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className={`w-full bg-black/80 border px-4 py-3 text-white focus:outline-none font-mono text-sm tracking-widest text-center transition-all ${
                    pinError ? "border-red-500 bg-red-950/20" : "border-white/10 focus:border-[#d4af37]"
                  }`}
                  style={pinError ? { animation: "shake 0.3s ease-in-out" } : {}}
                  placeholder="* * * * * * * *"
                  autoFocus
                />
                {pinError && <p className="text-red-500 text-[10px] tracking-wider mt-2 text-center uppercase">Invalid Access Code</p>}
              </div>
              <button type="submit"
                className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 uppercase tracking-[0.2em] text-xs font-bold transition-all">
                <Lock className="w-4 h-4 inline mr-2" />
                Authenticate
              </button>
            </form>
          </GCard>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // MAIN GOD MODE UI
  // ══════════════════════════════════════════
  const kpis = overview?.kpis;
  const isKillActive = kpis?.killSwitchActive || false;

  const TABS = [
    { id: "dashboard", icon: Activity, label: "Dashboard" },
    { id: "diagnostics", icon: Cpu, label: "Diagnostics" },
    { id: "apikeys", icon: Key, label: "API Keys" },
    { id: "web3", icon: Wallet, label: `Web3${web3.isConnected ? ' 🟢' : ' ⚪'}` },
    { id: "onchain", icon: Link, label: "On-Chain" },
    { id: "users", icon: Users, label: "KYC / Users" },
    { id: "properties", icon: Building, label: "Properties" },
    { id: "contracts", icon: FileText, label: `Contracts${trackedContracts.length ? ` (${trackedContracts.length})` : ""}` },
    { id: "lottery", icon: Ticket, label: "Lottery" },
    { id: "seizure", icon: Shield, label: "Seizure" },
    { id: "emergency", icon: AlertTriangle, label: "Kill Switch" },
    { id: "logs", icon: Terminal, label: "Activity Logs" },
    { id: "database", icon: Database, label: "DB Terminal" },
  ];

  const PIE_COLORS = ["#d4af37", "#22d3ee", "#a78bfa", "#4ade80", "#fb923c"];

  // Filtered KYC list
  const filteredKyc = (overview?.kycList || []).filter(u =>
    !searchFilter || u.address.toLowerCase().includes(searchFilter.toLowerCase()) || u.tier.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isKillActive ? "bg-[#0a0000]" : "bg-[#020202]"} text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-['Montserrat'] relative overflow-hidden transition-colors duration-700`}>
      {/* BG FX */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] ${isKillActive ? "bg-red-600/15" : "bg-red-900/8"} rounded-full blur-[150px] pointer-events-none transition-colors duration-700`} />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 pointer-events-none mix-blend-overlay" />
      <div className={`fixed inset-0 opacity-[0.03] pointer-events-none`}
        style={{ backgroundImage: `linear-gradient(${isKillActive ? "#ff0000" : "#d4af37"} 1px, transparent 1px), linear-gradient(90deg, ${isKillActive ? "#ff0000" : "#d4af37"} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* ═══ HEADER ═══ */}
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 border-b ${isKillActive ? "border-red-500/40" : "border-red-900/25"} pb-6 transition-colors duration-700`}>
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="relative">
              <div className={`absolute inset-0 ${isKillActive ? "bg-red-500 blur-lg opacity-80" : "bg-red-500 blur-md opacity-40"} animate-pulse`} />
              <div className={`bg-black border ${isKillActive ? "border-red-500 shadow-[0_0_15px_#ff0000]" : "border-red-500"} p-3 relative`}>
                <ShieldAlert className={`w-7 h-7 ${isKillActive ? "text-white" : "text-red-500"}`} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.15em] text-red-500 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                Omniscience Protocol
                {isKillActive && <span className="text-white text-sm ml-3 animate-pulse">(FROZEN)</span>}
              </h1>
              <p className="text-[10px] tracking-[0.3em] font-semibold text-[#d4af37]/70 mt-1">
                PRODUCTION GOD MODE // SUPABASE LIVE // {overview ? `${overview.kpis.totalProperties}P ${overview.kpis.totalContracts}C ${overview.kyc.total}U` : "LOADING..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Auto Refresh */}
            <button onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[0.2em] font-semibold uppercase border rounded-sm transition-all ${
                autoRefresh ? "border-green-500/40 text-green-500 bg-green-500/10" : "border-white/10 text-gray-500"
              }`}>
              <RefreshCw className={`w-3 h-3 ${autoRefresh ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              {autoRefresh ? "LIVE" : "PAUSED"}
            </button>

            {/* Manual Refresh */}
            <button onClick={() => { fetchAll(); toast.success("Refreshed"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[0.2em] font-semibold uppercase border border-[#d4af37]/30 text-[#d4af37] rounded-sm hover:bg-[#d4af37]/10 transition-all">
              <RefreshCw className="w-3 h-3" />
              REFRESH
            </button>

            {/* Status */}
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <div className={`w-2 h-2 rounded-full ${systemHealth?.serverStatus === "online" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
              <span className={systemHealth?.serverStatus === "online" ? "text-green-500" : "text-red-500"}>
                {systemHealth?.serverStatus === "online" ? "CONNECTED" : "OFFLINE"}
              </span>
            </div>

            {/* Last refresh */}
            <div className="text-[9px] text-gray-600 tracking-wider">
              <Clock className="w-3 h-3 inline mr-1" />
              {timeAgo(lastRefresh)} ago
            </div>

            {/* Logout */}
            <button onClick={() => { sessionStorage.removeItem("god_mode_auth"); setIsAuthenticated(false); }}
              className="text-[9px] tracking-[0.2em] text-gray-600 hover:text-red-500 transition-colors uppercase">
              <Lock className="w-3 h-3 inline mr-1" />LOCK
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* ═══ SIDEBAR NAV ═══ */}
          <div className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-200 border-l-2 rounded-r-sm ${
                  activeTab === tab.id
                    ? "border-red-500 bg-red-500/8 text-red-400"
                    : "border-transparent text-gray-500 hover:text-white hover:bg-white/3"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase">{tab.label}</span>
              </button>
            ))}

            {/* Quick Health */}
            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 px-2">
              <div className="text-[8px] tracking-[0.3em] text-gray-600 uppercase font-bold mb-2">System</div>
              {[
                { label: "Server", ok: systemHealth?.serverStatus === "online" },
                { label: "Kill Switch", ok: !isKillActive, danger: isKillActive },
                { label: "Lottery", ok: systemHealth?.lotteryActive },
                { label: "Alchemy RPC", ok: alchemyConnected },
                { label: "Sepolia Tracked", ok: trackedContracts.some(c => c.network?.includes("sepolia")) },
                { label: "Diagnostics", ok: activeTab === "diagnostics" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[9px]">
                  <span className="text-gray-500">{s.label}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${s.danger ? "bg-red-500 animate-pulse" : s.ok ? "bg-green-500" : "bg-gray-600"}`} />
                </div>
              ))}
            </div>
          </div>

          {/* ═══ CONTENT ═══ */}
          <div className="min-w-0">
            {/* Initial Loading State */}
            {loading && !overview && (
              <div className="flex items-center justify-center py-24 gap-3">
                <Loader2 size={20} className="animate-spin text-[#d4af37]" />
                <span className="text-[11px] tracking-[0.3em] text-white/30 uppercase font-semibold">Connecting to Supabase...</span>
              </div>
            )}

            <AnimatePresence mode="wait">

              {/* ═══ DASHBOARD TAB ═══ */}
              {activeTab === "dashboard" && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "TVL", value: fmtMoney(kpis?.totalTVL || 0), icon: DollarSign, color: "#d4af37", sub: `${kpis?.totalProperties || 0} properties` },
                      { label: "Investors", value: (kpis?.uniqueInvestors || 0).toString(), icon: Users, color: "#4ade80", sub: `${overview?.kyc.verified || 0} KYC verified` },
                      { label: "Contracts", value: (kpis?.totalContracts || 0).toString(), icon: FileText, color: "#22d3ee", sub: `${kpis?.totalTokensSold || 0} tokens minted` },
                      { label: "Status", value: isKillActive ? "FROZEN" : "ACTIVE", icon: isKillActive ? AlertTriangle : Shield, color: isKillActive ? "#ef4444" : "#4ade80", sub: isKillActive ? "Emergency Pause" : "All systems nominal" },
                    ].map((kpi, i) => (
                      <GCard key={i} danger={kpi.color === "#ef4444"}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <kpi.icon size={12} style={{ color: kpi.color }} />
                          <span className="text-[8px] tracking-[0.3em] text-white/35 uppercase font-semibold">{kpi.label}</span>
                        </div>
                        <div className="text-xl font-bold" style={{ color: kpi.color, fontFamily: "'Playfair Display', serif" }}>{kpi.value}</div>
                        <div className="text-[9px] text-white/30 mt-1">{kpi.sub}</div>
                      </GCard>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    {/* TVL Over Time */}
                    <GCard>
                      <STitle icon={BarChart3} title="Polling History (Live)" />
                      <div className="w-full" style={{ height: 180, minHeight: 180 }}>
                        {pollHistory.length < 2 ? (
                          <div className="h-full flex items-center justify-center text-[10px] text-white/20 tracking-[0.3em] uppercase">
                            Collecting data...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={pollHistory}>
                              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                              <XAxis key="xaxis" dataKey="t" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                              <YAxis key="yaxis" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                              <Tooltip key="tooltip" contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(212,175,55,0.3)", fontSize: 10, color: "#d4af37" }} />
                              <Area key="area-tvl" type="monotone" dataKey="tvl" stroke="#d4af37" fill="rgba(212,175,55,0.15)" fillOpacity={1} strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </GCard>

                    {/* KYC Breakdown Pie */}
                    <GCard>
                      <STitle icon={Fingerprint} title="KYC Distribution" />
                      <div className="flex items-center gap-6">
                        <div style={{ width: 140, height: 140, minWidth: 140, minHeight: 140 }}>
                          <PieChart width={140} height={140}>
                            <Pie
                              key="pie-kyc"
                              data={[
                                { name: "Verified", value: overview?.kyc.verified || 0 },
                                { name: "God Mode", value: overview?.kyc.godMode || 0 },
                                { name: "Pending", value: Math.max(0, (overview?.kyc.total || 0) - (overview?.kyc.verified || 0)) },
                              ].filter(d => d.value > 0)}
                              cx="50%" cy="50%"
                              innerRadius={35} outerRadius={55}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {[0, 1, 2].map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip key="tooltip-pie" contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(212,175,55,0.3)", fontSize: 10 }} />
                          </PieChart>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: "Total KYC", value: overview?.kyc.total || 0, color: "#d4af37" },
                            { label: "Verified", value: overview?.kyc.verified || 0, color: "#4ade80" },
                            { label: "God Mode", value: overview?.kyc.godMode || 0, color: "#22d3ee" },
                          ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                              <span className="text-[9px] text-white/50 tracking-wider">{s.label}:</span>
                              <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                            <Zap size={10} className="text-red-400" />
                            <span className="text-[9px] text-white/50 tracking-wider">Seizures:</span>
                            <span className="text-sm font-bold text-red-400">{kpis?.totalSeizures || 0}</span>
                          </div>
                        </div>
                      </div>
                    </GCard>
                  </div>

                  {/* Recent Activity */}
                  <GCard>
                    <STitle icon={Activity} title="Recent Activity">
                      <span className="text-[9px] text-white/30">{activityLogs.length} entries</span>
                    </STitle>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {activityLogs.length === 0 ? (
                        <div className="text-center py-8 text-[10px] text-white/20 tracking-wider uppercase">No activity recorded yet</div>
                      ) : (
                        activityLogs.slice(0, 10).map((log, i) => (
                          <div key={log.id || i} className="flex items-center gap-3 py-1.5 px-2 hover:bg-white/3 rounded-sm transition-colors">
                            <SeverityBadge level={log.severity} />
                            <span className="text-[10px] text-white/70 flex-1 truncate">{log.action}</span>
                            <span className="text-[9px] text-white/25 font-mono">{log.category}</span>
                            <span className="text-[9px] text-white/20">{timeAgo(log.timestamp)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </GCard>
                </motion.div>
              )}

              {/* ═══ DIAGNOSTICS TAB ═══ */}
              {activeTab === "diagnostics" && <SystemDiagnostics />}

              {/* ═══ API KEYS TAB ═══ */}
              {activeTab === "apikeys" && (
                <motion.div key="apikeys" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AlchemyKeyDiagnostic />
                </motion.div>
              )}

              {/* ═══ WEB3 TAB ═══ */}
              {activeTab === "web3" && (
                <GodModeWeb3Tab web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
              )}

              {/* ═══ ON-CHAIN (ALCHEMY) TAB ═══ */}
              {activeTab === "onchain" && (
                <motion.div key="onchain" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

                  {/* Network Selector */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Link size={13} className="text-[#d4af37]" />
                      <span className="text-[10px] tracking-[0.3em] font-bold text-white/60 uppercase">Network</span>
                    </div>
                    {[
                      { id: "eth-mainnet", label: "Ethereum", color: "#627eea" },
                      { id: "arb-mainnet", label: "Arbitrum", color: "#28a0f0" },
                      { id: "opt-mainnet", label: "Optimism", color: "#ff0420" },
                      { id: "polygon-mainnet", label: "Polygon", color: "#8247e5" },
                      { id: "base-mainnet", label: "Base", color: "#0052ff" },
                    ].map(net => (
                      <button key={net.id} onClick={() => setSelectedNetwork(net.id)}
                        className={`px-3 py-1.5 text-[9px] tracking-[0.15em] font-bold uppercase border rounded-sm transition-all ${
                          selectedNetwork === net.id
                            ? ""
                            : "border-white/8 text-white/30 hover:text-white/60"
                        }`}
                        style={selectedNetwork === net.id ? { borderColor: net.color, color: net.color, background: `${net.color}15` } : {}}>
                        {net.label}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${alchemyConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                      <span className={`text-[9px] font-mono ${alchemyConnected ? "text-green-500" : "text-red-500"}`}>
                        {alchemyConnected ? "ALCHEMY LIVE" : alchemyError ? "RPC ERROR" : "CONNECTING..."}
                      </span>
                    </div>
                  </div>

                  {/* Alchemy Error Banner */}
                  {alchemyError && !alchemyConnected && (
                    <AlchemyErrorHelper 
                      error={alchemyError} 
                      onRetry={() => { setAlchemyError(null); fetchNetworkStatus(); }} 
                    />
                  )}

                  {/* Network Status KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      { label: "Block", value: networkStatus?.blockNumber?.toLocaleString() || "---", icon: Box, color: "#d4af37" },
                      { label: "Gas Price", value: networkStatus ? `${networkStatus.gasPrice.toFixed(2)} Gwei` : "---", icon: Fuel, color: "#fb923c" },
                      { label: "Base Fee", value: networkStatus?.baseFee ? `${networkStatus.baseFee.toFixed(2)} Gwei` : "---", icon: BarChart3, color: "#22d3ee" },
                      { label: "Priority (Fast)", value: networkStatus?.priorityFees?.fast ? `${networkStatus.priorityFees.fast.toFixed(2)} Gwei` : "---", icon: Zap, color: "#4ade80" },
                      { label: "Peers", value: networkStatus?.peerCount?.toString() || "---", icon: Globe, color: "#a78bfa" },
                    ].map((kpi, i) => (
                      <GCard key={i}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <kpi.icon size={11} style={{ color: kpi.color }} />
                          <span className="text-[8px] tracking-[0.25em] text-white/30 uppercase font-semibold">{kpi.label}</span>
                        </div>
                        <div className="text-base font-bold" style={{ color: kpi.color, fontFamily: "'Playfair Display', serif" }}>{kpi.value}</div>
                      </GCard>
                    ))}
                  </div>

                  {/* Gas Chart + Multi-Chain Gas */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    <GCard>
                      <STitle icon={Fuel} title="Gas Price History (Live)" />
                      <div className="w-full" style={{ height: 170, minHeight: 170 }}>
                        {gasHistory.length < 2 ? (
                          <div className="h-full flex items-center justify-center text-[10px] text-white/20 tracking-[0.3em] uppercase">
                            {alchemyConnected ? "Collecting gas data..." : "Waiting for Alchemy connection..."}
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={170}>
                            <AreaChart data={gasHistory}>
                              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                              <XAxis key="xaxis" dataKey="t" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                              <YAxis key="yaxis" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                              <Tooltip key="tooltip" contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(251,146,60,0.3)", fontSize: 10, color: "#fb923c" }} />
                              <Area key="area-gas" type="monotone" dataKey="gas" stroke="#fb923c" fill="rgba(251,146,60,0.15)" fillOpacity={1} strokeWidth={2} name="Gas (Gwei)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </GCard>

                    <GCard>
                      <STitle icon={Globe} title="Multi-Chain Gas Tracker" />
                      {gasTracker.length === 0 ? (
                        <div className="h-[170px] flex items-center justify-center text-[10px] text-white/20 tracking-[0.3em] uppercase">Loading chains...</div>
                      ) : (
                        <div className="space-y-2">
                          {gasTracker.map((chain, i) => (
                            <div key={i} className="flex items-center justify-between py-2 px-2 bg-white/2 border border-white/5 rounded-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${chain.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
                                <span className="text-[10px] text-white/70 font-semibold">{chain.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[9px] text-white/30 font-mono">Block {chain.blockNumber?.toLocaleString()}</span>
                                <span className="text-[10px] font-bold" style={{ color: chain.gasPrice < 5 ? "#4ade80" : chain.gasPrice < 30 ? "#fb923c" : "#f87171" }}>
                                  {chain.gasPrice?.toFixed(2)} Gwei
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </GCard>
                  </div>

                  {/* Address Inspector */}
                  <GCard>
                    <STitle icon={Wallet} title="Address Inspector" />
                    <div className="flex gap-2 mb-4">
                      <input type="text" value={inspectAddr} onChange={e => setInspectAddr(e.target.value)}
                        placeholder="0x... (any Ethereum address)"
                        onKeyDown={e => e.key === "Enter" && inspectAddress()}
                        className="flex-1 bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-xs" />
                      <button onClick={inspectAddress} disabled={addrLoading}
                        className="px-4 py-2.5 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5">
                        {addrLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                        INSPECT
                      </button>
                    </div>

                    {addrResult && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {[
                            { label: "Balance", value: `${addrResult.balanceEth?.toFixed(6)} ETH`, color: "#d4af37" },
                            { label: "TX Count", value: addrResult.txCount?.toString(), color: "#22d3ee" },
                            { label: "Type", value: addrResult.isContract ? "CONTRACT" : "EOA", color: addrResult.isContract ? "#a78bfa" : "#4ade80" },
                            { label: "Code Size", value: addrResult.isContract ? `${addrResult.codeSize} bytes` : "N/A", color: "#fb923c" },
                          ].map((f, i) => (
                            <div key={i} className="bg-black/40 border border-white/5 p-3 rounded-sm">
                              <div className="text-[8px] tracking-[0.3em] text-white/30 uppercase mb-1">{f.label}</div>
                              <div className="text-sm font-bold" style={{ color: f.color }}>{f.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Token Balances */}
                        {addrResult.tokens && addrResult.tokens.length > 0 && (
                          <div>
                            <div className="text-[9px] tracking-[0.2em] text-white/40 uppercase font-semibold mb-2">ERC-20 Token Balances</div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-[10px]">
                                <thead>
                                  <tr className="border-b border-white/5">
                                    <th className="text-left py-1.5 text-[8px] tracking-[0.2em] text-white/25 uppercase font-semibold">Token</th>
                                    <th className="text-left py-1.5 text-[8px] tracking-[0.2em] text-white/25 uppercase font-semibold">Symbol</th>
                                    <th className="text-right py-1.5 text-[8px] tracking-[0.2em] text-white/25 uppercase font-semibold">Balance</th>
                                    <th className="text-right py-1.5 text-[8px] tracking-[0.2em] text-white/25 uppercase font-semibold">Contract</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {addrResult.tokens.map((tok: any, i: number) => (
                                    <tr key={i} className="border-b border-white/3 hover:bg-white/3">
                                      <td className="py-1.5 text-white/60">{tok.name}</td>
                                      <td className="py-1.5 text-[#d4af37] font-mono font-semibold">{tok.symbol}</td>
                                      <td className="py-1.5 text-right text-white/70">{tok.balance?.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                                      <td className="py-1.5 text-right font-mono text-white/30 flex items-center justify-end gap-1">
                                        {fmtAddr(tok.contract)}
                                        <button onClick={() => copyToClipboard(tok.contract)}><Copy size={8} className="text-white/20 hover:text-[#d4af37]" /></button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </GCard>

                  {/* Transaction Lookup */}
                  <GCard>
                    <STitle icon={Hash} title="Transaction Lookup" />
                    <div className="flex gap-2 mb-4">
                      <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)}
                        placeholder="0x... (transaction hash)"
                        onKeyDown={e => e.key === "Enter" && lookupTx()}
                        className="flex-1 bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#22d3ee] focus:outline-none font-mono text-xs" />
                      <button onClick={lookupTx} disabled={txLoading}
                        className="px-4 py-2.5 bg-[#22d3ee]/10 hover:bg-[#22d3ee]/25 border border-[#22d3ee]/40 text-[#22d3ee] uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5">
                        {txLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                        LOOKUP
                      </button>
                    </div>

                    {txResult && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-wider ${
                            txResult.status === "success" ? "bg-green-500/15 text-green-400 border border-green-500/30"
                            : txResult.status === "failed" ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          }`}>{txResult.status?.toUpperCase()}</span>
                          <span className="text-[9px] text-white/30 font-mono">Block #{txResult.blockNumber?.toLocaleString()}</span>
                          <span className="text-[9px] text-white/20">Type {txResult.type}</span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {[
                            { label: "Value", value: `${txResult.value?.toFixed(6)} ETH` },
                            { label: "Gas Used", value: txResult.gasUsed?.toLocaleString() || "Pending" },
                            { label: "TX Fee", value: txResult.txFee ? `${txResult.txFee.toFixed(6)} ETH` : "Pending" },
                            { label: "Gas Price", value: txResult.effectiveGasPrice ? `${txResult.effectiveGasPrice.toFixed(2)} Gwei` : txResult.gasPrice ? `${txResult.gasPrice.toFixed(2)} Gwei` : "---" },
                            { label: "Nonce", value: txResult.nonce?.toString() },
                            { label: "Logs", value: txResult.logs?.toString() },
                          ].map((f, i) => (
                            <div key={i} className="bg-black/40 border border-white/5 p-2.5 rounded-sm">
                              <div className="text-[8px] tracking-[0.2em] text-white/25 uppercase mb-1">{f.label}</div>
                              <div className="text-[11px] text-white/70 font-mono">{f.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1.5 text-[10px]">
                          <div className="flex items-center gap-2">
                            <span className="text-white/30 w-12">From</span>
                            <span className="font-mono text-white/60">{txResult.from}</span>
                            <button onClick={() => { setInspectAddr(txResult.from); setActiveTab("onchain"); }}><ExternalLink size={9} className="text-[#d4af37]/50 hover:text-[#d4af37]" /></button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/30 w-12">To</span>
                            <span className="font-mono text-white/60">{txResult.to || "(Contract Creation)"}</span>
                            {txResult.to && <button onClick={() => { setInspectAddr(txResult.to); setActiveTab("onchain"); }}><ExternalLink size={9} className="text-[#d4af37]/50 hover:text-[#d4af37]" /></button>}
                          </div>
                          {txResult.input !== "0x" && (
                            <div className="flex items-center gap-2">
                              <span className="text-white/30 w-12">Method</span>
                              <span className="font-mono text-[#a78bfa]">{txResult.input}</span>
                            </div>
                          )}
                          {txResult.contractAddress && (
                            <div className="flex items-center gap-2">
                              <span className="text-white/30 w-12">Created</span>
                              <span className="font-mono text-[#4ade80]">{txResult.contractAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </GCard>

                  {/* Transfer History */}
                  <GCard>
                    <STitle icon={ArrowUpRight} title="Transfer History (Alchemy Enhanced)" />
                    <div className="flex gap-2 mb-4">
                      <input type="text" value={transfersAddr} onChange={e => setTransfersAddr(e.target.value)}
                        placeholder="0x... (address to check transfers)"
                        onKeyDown={e => e.key === "Enter" && fetchTransfers()}
                        className="flex-1 bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#a78bfa] focus:outline-none font-mono text-xs" />
                      <button onClick={fetchTransfers} disabled={transfersLoading}
                        className="px-4 py-2.5 bg-[#a78bfa]/10 hover:bg-[#a78bfa]/25 border border-[#a78bfa]/40 text-[#a78bfa] uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5">
                        {transfersLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                        FETCH
                      </button>
                    </div>

                    {transfers.length > 0 && (
                      <div className="overflow-x-auto max-h-72 overflow-y-auto">
                        <table className="w-full text-[10px]">
                          <thead className="sticky top-0 bg-[#0a0a0a]">
                            <tr className="border-b border-white/5">
                              {["Dir", "Hash", "From", "To", "Value", "Asset", "Type", "Block"].map(h => (
                                <th key={h} className="text-left py-1.5 text-[8px] tracking-[0.2em] text-white/25 uppercase font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {transfers.map((t, i) => (
                              <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                <td className="py-1.5">
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold ${
                                    t.direction === "in" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                                  }`}>{t.direction === "in" ? "IN" : "OUT"}</span>
                                </td>
                                <td className="py-1.5 font-mono text-white/40">
                                  <button onClick={() => setTxHash(t.hash)} className="hover:text-[#22d3ee] transition-colors">
                                    {fmtAddr(t.hash)}
                                  </button>
                                </td>
                                <td className="py-1.5 font-mono text-white/40">{fmtAddr(t.from)}</td>
                                <td className="py-1.5 font-mono text-white/40">{fmtAddr(t.to || "")}</td>
                                <td className="py-1.5 text-white/60">{t.value != null ? (typeof t.value === "number" ? t.value.toFixed(4) : t.value) : "---"}</td>
                                <td className="py-1.5 text-[#d4af37] font-semibold">{t.asset || "---"}</td>
                                <td className="py-1.5 text-white/30">{t.category}</td>
                                <td className="py-1.5 text-white/30 font-mono">{t.blockNumber?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </GCard>
                </motion.div>
              )}

              {/* ═══ KYC / USERS TAB ═══ */}
              {activeTab === "users" && (
                <motion.div key="users" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                  {/* Add KYC */}
                  <GCard>
                    <STitle icon={UserCheck} title="Override KYC / ONCHAINID" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <input type="text" value={kycAddress} onChange={e => setKycAddress(e.target.value)} placeholder="0x..."
                        className="bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-xs" />
                      <select value={kycTier} onChange={e => setKycTier(e.target.value)}
                        className="bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none text-xs appearance-none">
                        <option>Investisseur Qualifie (Tier 1)</option>
                        <option>Institutionnel (Tier 2)</option>
                        <option>Agent de conformite (God Tier)</option>
                      </select>
                      <button onClick={executeKycOverride} disabled={processingAction === "kyc_override"}
                        className="px-4 py-2.5 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50">
                        {processingAction === "kyc_override" ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "VALIDATE KYC"}
                      </button>
                    </div>
                  </GCard>

                  {/* User List */}
                  <GCard>
                    <STitle icon={Users} title={`Users (${overview?.kyc.total || 0})`}>
                      <div className="flex items-center gap-2">
                        <Search size={11} className="text-white/30" />
                        <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)}
                          placeholder="Search..." className="bg-transparent border-none text-[10px] text-white/60 focus:outline-none w-32" />
                      </div>
                    </STitle>

                    {filteredKyc.length === 0 ? (
                      <div className="text-center py-8 text-[10px] text-white/20 tracking-wider uppercase">No KYC users found</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="text-left py-2 text-[8px] tracking-[0.3em] text-white/30 uppercase font-semibold">Address</th>
                              <th className="text-left py-2 text-[8px] tracking-[0.3em] text-white/30 uppercase font-semibold">Status</th>
                              <th className="text-left py-2 text-[8px] tracking-[0.3em] text-white/30 uppercase font-semibold">Tier</th>
                              <th className="text-left py-2 text-[8px] tracking-[0.3em] text-white/30 uppercase font-semibold">By</th>
                              <th className="text-left py-2 text-[8px] tracking-[0.3em] text-white/30 uppercase font-semibold">Date</th>
                              <th className="text-right py-2 text-[8px] tracking-[0.3em] text-white/30 uppercase font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredKyc.map((user, i) => (
                              <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                <td className="py-2 font-mono text-white/70 flex items-center gap-1">
                                  {fmtAddr(user.address)}
                                  <button onClick={() => copyToClipboard(user.address)}><Copy size={9} className="text-white/20 hover:text-[#d4af37]" /></button>
                                </td>
                                <td className="py-2">
                                  <span className={`text-[9px] font-bold ${user.status === "verified" ? "text-green-400" : "text-yellow-400"}`}>
                                    {user.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-2 text-white/50">{user.tier}</td>
                                <td className="py-2">
                                  <span className={`text-[9px] ${user.verifiedBy === "GOD_MODE" ? "text-red-400" : "text-white/40"}`}>
                                    {user.verifiedBy}
                                  </span>
                                </td>
                                <td className="py-2 text-white/30">{fmtDate(user.timestamp)}</td>
                                <td className="py-2 text-right">
                                  <button onClick={() => revokeKyc(user.address)}
                                    className="px-2 py-1 text-[8px] text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-sm transition-all uppercase tracking-wider">
                                    Revoke
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </GCard>
                </motion.div>
              )}

              {/* ═══ PROPERTIES TAB ═══ */}
              {activeTab === "properties" && (
                <motion.div key="properties" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                  <GCard>
                    <STitle icon={Building} title={`Tokenized Properties (${overview?.properties.length || 0})`} />
                    {(!overview?.properties || overview.properties.length === 0) ? (
                      <div className="text-center py-12 text-[10px] text-white/20 tracking-wider uppercase">No properties registered</div>
                    ) : (
                      <div className="space-y-3">
                        {overview.properties.map((prop, i) => (
                          <div key={i} className="flex items-center justify-between py-3 px-3 bg-white/2 border border-white/5 rounded-sm hover:border-[#d4af37]/20 transition-all">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-white/90">{prop.title}</span>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider ${
                                  prop.status === "active" ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                                }`}>{prop.status.toUpperCase()}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[9px] text-white/40">
                                <span>{prop.location}</span>
                                <span>{prop.investorCount} investors</span>
                                <span>{fmtDate(prop.createdAt)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>{fmtMoney(prop.totalValue)}</div>
                              <div className="text-[9px] text-white/30">{prop.tokensSold}/{prop.tokenSupply} tokens</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GCard>
                </motion.div>
              )}

              {/* ═══ CONTRACTS TAB — LIVE ON-CHAIN TRACKING ═══ */}
              {activeTab === "contracts" && (
                <motion.div key="contracts" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => fetchTrackedContracts(true)} disabled={trackedLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[0.15em] font-bold uppercase border border-[#d4af37]/30 text-[#d4af37] rounded-sm hover:bg-[#d4af37]/10 transition-all disabled:opacity-50">
                      {trackedLoading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                      REFRESH ON-CHAIN
                    </button>
                    <button onClick={syncContractsFromKV}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[0.15em] font-bold uppercase border border-[#22d3ee]/30 text-[#22d3ee] rounded-sm hover:bg-[#22d3ee]/10 transition-all">
                      <Database size={11} />
                      SYNC FROM KV
                    </button>
                    <div className="ml-auto text-[9px] text-white/25 font-mono">
                      {trackedContracts.length} tracked
                    </div>
                  </div>

                  {/* Add Contract to Watch */}
                  <GCard>
                    <STitle icon={Eye} title="Watch New Contract" />
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
                      <input type="text" value={watchAddr} onChange={e => setWatchAddr(e.target.value)} placeholder="0x... contract address"
                        className="md:col-span-2 bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none font-mono text-xs" />
                      <input type="text" value={watchName} onChange={e => setWatchName(e.target.value)} placeholder="Name"
                        className="bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-xs" />
                      <input type="text" value={watchSymbol} onChange={e => setWatchSymbol(e.target.value)} placeholder="Symbol"
                        className="bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-xs" />
                      <select value={watchNetwork} onChange={e => setWatchNetwork(e.target.value)}
                        className="bg-black/60 border border-white/10 px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-xs appearance-none">
                        <option value="eth-mainnet">Ethereum</option>
                        <option value="arb-mainnet">Arbitrum</option>
                        <option value="polygon-mainnet">Polygon</option>
                        <option value="opt-mainnet">Optimism</option>
                        <option value="base-mainnet">Base</option>
                        <option value="eth-sepolia">Sepolia</option>
                      </select>
                      <button onClick={watchContract}
                        className="px-3 py-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] uppercase tracking-[0.15em] text-[9px] font-bold transition-all flex items-center justify-center gap-1">
                        <Eye size={11} /> WATCH
                      </button>
                    </div>
                  </GCard>

                  {/* ═══ SEPOLIA TEST SUITE ═══ */}
                  <GCard className="ring-1 ring-purple-500/20">
                    <STitle icon={Crosshair} title="Sepolia Test Suite — ERC-3643 Pipeline" color="#a78bfa">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">TESTNET</span>
                      </div>
                    </STitle>

                    <p className="text-[10px] text-white/30 mb-4 leading-relaxed">
                      Validation complète du pipeline on-chain via Alchemy sur Sepolia : connectivité RPC, watch/unwatch, eth_getCode, balance, transfers, event logs et pipeline intégré.
                    </p>

                    {/* Pre-configured Test Contracts */}
                    <div className="mb-4">
                      <div className="text-[8px] tracking-[0.25em] text-white/25 uppercase font-semibold mb-2">Contrats de test pré-configurés</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {SEPOLIA_TEST_CONTRACTS.map((c, i) => {
                          const isTracked = trackedContracts.some(t => t.address === c.address.toLowerCase());
                          return (
                            <div key={i} className={`flex items-center justify-between py-1.5 px-2.5 rounded-sm border text-[9px] transition-all ${
                              isTracked
                                ? "bg-green-500/5 border-green-500/20"
                                : "bg-black/30 border-white/5 hover:border-purple-500/20"
                            }`}>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-semibold ${isTracked ? "text-green-400" : "text-white/60"}`}>{c.name}</span>
                                  <span className="text-[7px] px-1 py-0.5 rounded-sm bg-purple-500/10 text-purple-400 font-bold">{c.type}</span>
                                </div>
                                <div className="font-mono text-white/20 text-[8px] flex items-center gap-1">
                                  {fmtAddr(c.address)}
                                  <button onClick={() => copyToClipboard(c.address)}><Copy size={7} className="text-white/10 hover:text-[#d4af37]" /></button>
                                </div>
                              </div>
                              {isTracked ? (
                                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-white/10 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mb-4">
                      <button onClick={addTestContracts} disabled={testSuiteRunning}
                        className="flex items-center gap-1.5 px-4 py-2 text-[9px] tracking-[0.15em] font-bold uppercase border border-purple-500/30 text-purple-400 rounded-sm hover:bg-purple-500/10 transition-all disabled:opacity-50">
                        <Eye size={11} />
                        ADD ALL TO WATCHLIST
                      </button>
                      <button onClick={runSepoliaTestSuite} disabled={testSuiteRunning}
                        className="flex items-center gap-1.5 px-4 py-2 text-[9px] tracking-[0.15em] font-bold uppercase bg-purple-600/15 border border-purple-500/40 text-purple-300 rounded-sm hover:bg-purple-600/30 transition-all disabled:opacity-50">
                        {testSuiteRunning ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
                        {testSuiteRunning ? "RUNNING..." : "RUN FULL TEST SUITE"}
                      </button>
                      {testResults.length > 0 && !testSuiteRunning && (
                        <div className="flex items-center gap-3 ml-auto text-[9px]">
                          <span className="text-green-400 font-mono">{testResults.filter(r => r.status === "pass").length} PASS</span>
                          <span className="text-yellow-400 font-mono">{testResults.filter(r => r.status === "warn").length} WARN</span>
                          <span className="text-red-400 font-mono">{testResults.filter(r => r.status === "fail").length} FAIL</span>
                        </div>
                      )}
                    </div>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[8px] tracking-[0.25em] text-white/25 uppercase font-semibold mb-2">Test Results</div>
                        {testResults.map((r, i) => (
                          <div key={i} className={`flex items-start gap-2.5 py-2 px-3 rounded-sm border transition-all ${
                            r.status === "pass" ? "bg-green-500/5 border-green-500/15" :
                            r.status === "fail" ? "bg-red-500/5 border-red-500/15" :
                            r.status === "warn" ? "bg-yellow-500/5 border-yellow-500/15" :
                            r.status === "running" ? "bg-purple-500/5 border-purple-500/15" :
                            "bg-black/20 border-white/5"
                          }`}>
                            {/* Status Icon */}
                            <div className="shrink-0 mt-0.5">
                              {r.status === "pass" ? <CheckCircle2 size={12} className="text-green-500" /> :
                               r.status === "fail" ? <XCircle size={12} className="text-red-500" /> :
                               r.status === "warn" ? <AlertTriangle size={12} className="text-yellow-500" /> :
                               r.status === "running" ? <Loader2 size={12} className="text-purple-400 animate-spin" /> :
                               <Clock size={12} className="text-white/20" />}
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[9px] font-semibold text-white/70">{r.name}</span>
                                <span className="text-[8px] text-white/25 font-mono">{r.step}</span>
                              </div>
                              <div className="text-[9px] text-white/40 leading-relaxed break-all">{r.detail}</div>
                            </div>
                            {/* Timing */}
                            <span className="text-[8px] text-white/15 font-mono shrink-0">{new Date(r.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </GCard>

                  {/* Tracked Contracts List */}
                  {trackedContracts.length === 0 ? (
                    <GCard>
                      <div className="text-center py-12">
                        <FileText size={32} className="mx-auto mb-3 text-white/10" />
                        <div className="text-[10px] text-white/20 tracking-wider uppercase mb-2">No contracts tracked yet</div>
                        <div className="text-[9px] text-white/10">Add a contract address above or sync from the KV store</div>
                      </div>
                    </GCard>
                  ) : (
                    trackedContracts.map((ctr) => {
                      const oc = ctr.onchain || {};
                      const isExpanded = expandedContract === ctr.address;
                      const existsOnChain = oc.exists === true;
                      const hasError = !!oc.error;

                      return (
                        <GCard key={ctr.address} className={isExpanded ? "ring-1 ring-[#d4af37]/30" : ""}>
                          {/* Contract Header */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-semibold text-white/90">{ctr.name}</span>
                                <span className="text-[#d4af37] font-mono text-[10px] font-bold">{ctr.symbol}</span>
                                <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30">
                                  {ctr.type}
                                </span>
                                {/* On-chain status */}
                                {hasError ? (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">RPC ERROR</span>
                                ) : existsOnChain ? (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">ON-CHAIN</span>
                                ) : (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">NOT FOUND</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[9px] text-white/40 font-mono">
                                <span>{ctr.address}</span>
                                <button onClick={() => copyToClipboard(ctr.address)}><Copy size={9} className="text-white/20 hover:text-[#d4af37]" /></button>
                                <span className="text-white/15">|</span>
                                <span className="text-white/30">{ctr.network}</span>
                                {ctr.network?.includes("sepolia") && (
                                  <span className="text-[7px] px-1 py-0.5 rounded-sm bg-purple-500/15 text-purple-400 border border-purple-500/25 font-bold tracking-wider ml-1">TESTNET</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => { setExpandedContract(isExpanded ? null : ctr.address); if (!isExpanded) fetchContractEvents(ctr.address, ctr.network); }}
                                className="px-2 py-1 text-[8px] text-[#d4af37] hover:bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm transition-all uppercase tracking-wider">
                                {isExpanded ? "COLLAPSE" : "EVENTS"}
                              </button>
                              <button onClick={() => { setInspectAddr(ctr.address); setActiveTab("onchain"); }}
                                className="px-2 py-1 text-[8px] text-[#22d3ee] hover:bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-sm transition-all uppercase tracking-wider">
                                INSPECT
                              </button>
                              <button onClick={() => unwatchContract(ctr.address)}
                                className="px-2 py-1 text-[8px] text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-sm transition-all uppercase tracking-wider">
                                <Trash2 size={9} />
                              </button>
                            </div>
                          </div>

                          {/* On-Chain KPIs */}
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
                            {[
                              { label: "Balance", value: oc.balanceEth != null ? `${oc.balanceEth.toFixed(6)} ETH` : "---", color: "#d4af37" },
                              { label: "Code Size", value: oc.codeSize ? `${oc.codeSize.toLocaleString()} bytes` : existsOnChain ? "0" : "---", color: "#22d3ee" },
                              { label: "Events (1K blocks)", value: oc.logCount != null ? oc.logCount.toString() : "---", color: "#a78bfa" },
                              { label: "Transfers", value: oc.recentTransfers ? oc.recentTransfers.length.toString() : "---", color: "#4ade80" },
                              { label: "Last Check", value: oc.checkedAt ? timeAgo(oc.checkedAt) : "Never", color: "#fb923c" },
                            ].map((k, i) => (
                              <div key={i} className="bg-black/40 border border-white/5 p-2 rounded-sm">
                                <div className="text-[7px] tracking-[0.25em] text-white/25 uppercase mb-0.5">{k.label}</div>
                                <div className="text-[11px] font-bold font-mono" style={{ color: k.color }}>{k.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Token Metadata */}
                          {oc.tokenMeta && (
                            <div className="flex items-center gap-3 py-2 px-3 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-sm mb-3 text-[10px]">
                              {oc.tokenMeta.logo && <img src={oc.tokenMeta.logo} alt="" className="w-5 h-5 rounded-full" />}
                              <span className="text-white/60">Token:</span>
                              <span className="text-[#d4af37] font-semibold">{oc.tokenMeta.name} ({oc.tokenMeta.symbol})</span>
                              <span className="text-white/30">Decimals: {oc.tokenMeta.decimals}</span>
                              {oc.tokenMeta.totalSupply && <span className="text-white/30">Supply: {oc.tokenMeta.totalSupply}</span>}
                            </div>
                          )}

                          {/* Recent Transfers */}
                          {oc.recentTransfers && oc.recentTransfers.length > 0 && (
                            <div className="mb-3">
                              <div className="text-[8px] tracking-[0.2em] text-white/30 uppercase font-semibold mb-1.5">Recent Transfers</div>
                              <div className="overflow-x-auto max-h-32 overflow-y-auto">
                                <table className="w-full text-[9px]">
                                  <tbody>
                                    {oc.recentTransfers.map((t: any, i: number) => (
                                      <tr key={i} className="border-b border-white/3 hover:bg-white/3">
                                        <td className="py-1">
                                          <span className={`text-[7px] px-1 py-0.5 rounded-sm font-bold ${t.direction === "in" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                                            {t.direction === "in" ? "IN" : "OUT"}
                                          </span>
                                        </td>
                                        <td className="py-1 font-mono text-white/30">{fmtAddr(t.hash)}</td>
                                        <td className="py-1 font-mono text-white/30">{fmtAddr(t.from)} → {fmtAddr(t.to || "")}</td>
                                        <td className="py-1 text-white/50">{t.value != null ? (typeof t.value === "number" ? t.value.toFixed(4) : t.value) : "---"} {t.asset || ""}</td>
                                        <td className="py-1 text-white/20 font-mono">{t.blockNumber?.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Expanded: Event Log */}
                          {isExpanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-white/5 pt-3 mt-2">
                              <STitle icon={Activity} title={`Event Log — ${ctr.address.slice(0, 10)}...`} color="#a78bfa">
                                {contractEvents && (
                                  <span className="text-[9px] text-white/25 font-mono">
                                    {contractEvents.totalEvents} events in {contractEvents.blocksScanned} blocks
                                  </span>
                                )}
                              </STitle>

                              {eventsLoading ? (
                                <div className="flex items-center justify-center py-8 gap-2">
                                  <Loader2 size={14} className="animate-spin text-[#a78bfa]" />
                                  <span className="text-[10px] text-white/30 tracking-wider uppercase">Scanning blockchain...</span>
                                </div>
                              ) : contractEvents ? (
                                <div className="space-y-3">
                                  {/* Event Summary */}
                                  {contractEvents.eventSummary && Object.keys(contractEvents.eventSummary).length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {Object.entries(contractEvents.eventSummary).map(([evt, count]: [string, any]) => (
                                        <div key={evt} className="flex items-center gap-1 px-2 py-1 bg-[#a78bfa]/8 border border-[#a78bfa]/15 rounded-sm">
                                          <span className="text-[8px] text-[#a78bfa] font-semibold">{evt}</span>
                                          <span className="text-[8px] text-white/30">x{count}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Event Table */}
                                  {contractEvents.events && contractEvents.events.length > 0 ? (
                                    <div className="overflow-x-auto max-h-60 overflow-y-auto">
                                      <table className="w-full text-[9px]">
                                        <thead className="sticky top-0 bg-[#0a0a0a]">
                                          <tr className="border-b border-white/5">
                                            {["Block", "Event", "TX Hash", "Data"].map(h => (
                                              <th key={h} className="text-left py-1 text-[7px] tracking-[0.2em] text-white/20 uppercase font-semibold">{h}</th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {contractEvents.events.map((ev: any, i: number) => (
                                            <tr key={i} className="border-b border-white/3 hover:bg-white/3">
                                              <td className="py-1 font-mono text-white/30">{ev.blockNumber?.toLocaleString()}</td>
                                              <td className="py-1">
                                                <span className={`text-[8px] font-semibold ${
                                                  ev.event === "Transfer" ? "text-[#4ade80]" :
                                                  ev.event === "Approval" ? "text-[#22d3ee]" :
                                                  ev.event === "Paused" ? "text-red-400" :
                                                  ev.event === "Unpaused" ? "text-green-400" :
                                                  "text-[#a78bfa]"
                                                }`}>{ev.event}</span>
                                              </td>
                                              <td className="py-1 font-mono text-white/25">{fmtAddr(ev.txHash)}</td>
                                              <td className="py-1 font-mono text-white/15 truncate max-w-[120px]">{ev.data}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-[10px] text-white/20 tracking-wider">No events in the scanned range</div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-[10px] text-white/20 tracking-wider">Failed to load events</div>
                              )}
                            </motion.div>
                          )}
                        </GCard>
                      );
                    })
                  )}

                  {/* KV Store Contracts (legacy view) */}
                  {overview?.contracts && overview.contracts.length > 0 && (
                    <GCard>
                      <STitle icon={Database} title={`KV Store Contracts (${overview.contracts.length})`}>
                        <span className="text-[8px] text-white/20 tracking-wider">Raw database entries</span>
                      </STitle>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[9px]">
                          <thead>
                            <tr className="border-b border-white/5">
                              {["Name", "Symbol", "Type", "Address", "Status", "Network"].map(h => (
                                <th key={h} className="text-left py-1.5 text-[7px] tracking-[0.2em] text-white/20 uppercase font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {overview.contracts.map((c, i) => (
                              <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                <td className="py-1.5 text-white/50">{c.name}</td>
                                <td className="py-1.5 text-[#d4af37] font-mono">{c.symbol}</td>
                                <td className="py-1.5 text-white/30">{c.type}</td>
                                <td className="py-1.5 font-mono text-white/25 flex items-center gap-1">
                                  {fmtAddr(c.address)}
                                  <button onClick={() => copyToClipboard(c.address)}><Copy size={8} className="text-white/15 hover:text-[#d4af37]" /></button>
                                </td>
                                <td className="py-1.5">
                                  <span className={`text-[8px] font-bold ${c.status === "deployed" ? "text-green-400" : "text-yellow-400"}`}>{c.status.toUpperCase()}</span>
                                </td>
                                <td className="py-1.5 text-white/25">{c.network}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </GCard>
                  )}
                </motion.div>
              )}

              {/* ═══ LOTTERY TAB ═══ */}
              {activeTab === "lottery" && (
                <motion.div key="lottery" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                  {/* Current Lottery Status */}
                  <GCard>
                    <STitle icon={Ticket} title="Current Lottery Status" />
                    {overview?.currentLottery ? (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        {[
                          { label: "Status", value: overview.currentLottery.status?.toUpperCase(), color: overview.currentLottery.status === "open" ? "#4ade80" : "#f87171" },
                          { label: "Tickets Sold", value: `${overview.currentLottery.ticketsSold}/${overview.currentLottery.maxTickets}`, color: "#22d3ee" },
                          { label: "Participants", value: overview.currentLottery.participants?.length || 0, color: "#a78bfa" },
                          { label: "Ticket Price", value: `${parseFloat(overview.currentLottery.ticketPrice) / 1e18} ETH`, color: "#d4af37" },
                        ].map((s, i) => (
                          <div key={i} className="bg-black/40 border border-white/5 p-3 rounded-sm">
                            <div className="text-[8px] tracking-[0.3em] text-white/30 uppercase mb-1">{s.label}</div>
                            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[10px] text-white/20 tracking-wider uppercase">No active lottery</div>
                    )}
                  </GCard>

                  {/* Lottery Controls */}
                  <GCard>
                    <STitle icon={Zap} title="Lottery Administration" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1.5 block font-semibold">Max Tickets</label>
                        <input type="text" value={lotteryMaxTickets} onChange={e => setLotteryMaxTickets(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-xs" />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1.5 block font-semibold">Ticket Price (Wei)</label>
                        <input type="text" value={lotteryTicketPrice} onChange={e => setLotteryTicketPrice(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-xs" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={startLottery} disabled={!!processingAction}
                        className="py-3 bg-[#d4af37]/10 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#d4af37] uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <Zap size={13} /> START LOTTERY
                      </button>
                      <button onClick={pickWinner} disabled={!!processingAction || !overview?.currentLottery}
                        className="py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <Ticket size={13} /> PICK WINNER (Oracle)
                      </button>
                    </div>
                  </GCard>

                  {/* Lottery History */}
                  <GCard>
                    <STitle icon={TrendingUp} title={`Winner History (${kpis?.lotteryWinners || 0})`} />
                    <div className="text-[10px] text-white/30 text-center py-4 tracking-wider">
                      {(kpis?.lotteryWinners || 0) === 0 ? "No winners yet" : `${kpis?.lotteryWinners} winners recorded in KV store`}
                    </div>
                  </GCard>
                </motion.div>
              )}

              {/* ═══ SEIZURE TAB ═══ */}
              {activeTab === "seizure" && (
                <motion.div key="seizure" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                  <GCard danger>
                    <STitle icon={Key} title="Asset Seizure (ERC-3643 forcedTransfer)" color="#ef4444" />
                    <p className="text-[10px] text-white/40 mb-4 leading-relaxed">
                      Registers a forced transfer instruction in the database. Will be executed on-chain by compliance agents.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1.5 block font-semibold">Token Address (ERC-3643)</label>
                        <input type="text" value={txToken} onChange={e => setTxToken(e.target.value)} placeholder="0x..."
                          className="w-full bg-black/60 border border-red-500/20 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none font-mono text-xs" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1.5 block font-semibold">From (Compromised)</label>
                          <input type="text" value={txFrom} onChange={e => setTxFrom(e.target.value)} placeholder="0x..."
                            className="w-full bg-black/60 border border-red-500/20 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none font-mono text-xs" />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1.5 block font-semibold">To (Recovery)</label>
                          <input type="text" value={txTo} onChange={e => setTxTo(e.target.value)} placeholder="0x..."
                            className="w-full bg-black/60 border border-red-500/20 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none font-mono text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-1.5 block font-semibold">Amount</label>
                        <input type="text" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="50000"
                          className="w-full bg-black/60 border border-red-500/20 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none font-mono text-xs" />
                      </div>
                    </div>
                    <button onClick={executeForceTransfer} disabled={processingAction === "force_transfer"}
                      className="w-full py-3 bg-red-600/15 hover:bg-red-600/30 border border-red-500/40 text-red-400 uppercase tracking-[0.15em] text-[10px] font-bold transition-all disabled:opacity-50">
                      {processingAction === "force_transfer" ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "EXECUTE FORCE TRANSFER"}
                    </button>
                  </GCard>

                  {/* Seizure History */}
                  {(overview?.seizures && overview.seizures.length > 0) && (
                    <GCard danger>
                      <STitle icon={AlertTriangle} title={`Seizure History (${overview.seizures.length})`} color="#ef4444" />
                      <div className="space-y-2">
                        {overview.seizures.map((s, i) => (
                          <div key={i} className="flex items-center justify-between py-2 px-2 bg-red-950/20 border border-red-500/10 rounded-sm text-[10px]">
                            <div className="flex items-center gap-3">
                              <span className="text-red-400 font-mono">{fmtAddr(s.from)}</span>
                              <ChevronRight size={10} className="text-red-500/50" />
                              <span className="text-green-400 font-mono">{fmtAddr(s.to)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white/60">{s.amount} tokens</span>
                              <span className="text-white/20">{fmtDate(s.timestamp)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GCard>
                  )}
                </motion.div>
              )}

              {/* ═══ KILL SWITCH TAB ═══ */}
              {activeTab === "emergency" && (
                <motion.div key="emergency" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}>
                  <GCard danger={isKillActive} className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 mb-6 relative">
                      <motion.div className="absolute inset-0 rounded-full border border-red-500"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }} />
                      <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>

                    <h2 className="text-3xl text-white mb-4 uppercase tracking-[0.15em] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Global Kill Switch
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto mb-8 text-[11px] leading-relaxed">
                      This will pause (Pausable) all smart contracts deployed on the THESORIA platform.
                      Transfers, mints and burns will be frozen. State is persisted in KV_STORE.
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className={`text-[10px] tracking-[0.3em] font-bold ${isKillActive ? "text-red-500" : "text-green-500"}`}>
                        Current: {isKillActive ? "FROZEN" : "ACTIVE"}
                      </div>
                      {systemHealth && (
                        <div className="text-[9px] text-white/20">
                          Last toggle: {systemHealth.killSwitch ? "Active" : "Inactive"}
                        </div>
                      )}
                    </div>

                    <button onClick={toggleKillSwitch} disabled={processingAction === "kill_switch"}
                      className={`relative px-10 py-4 uppercase tracking-[0.2em] text-sm font-bold transition-all overflow-hidden group ${
                        isKillActive
                          ? "bg-green-600 hover:bg-green-500 text-white"
                          : "bg-red-600 hover:bg-red-500 text-white"
                      }`}>
                      {processingAction === "kill_switch" ? (
                        <span className="flex items-center gap-2"><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</span>
                      ) : isKillActive ? (
                        <span className="flex items-center gap-2"><Unlock className="w-5 h-5" /> UNFREEZE NETWORK</span>
                      ) : (
                        <span className="flex items-center gap-2"><Lock className="w-5 h-5" /> ENGAGE EMERGENCY PAUSE</span>
                      )}
                    </button>
                  </GCard>
                </motion.div>
              )}

              {/* ═══ ACTIVITY LOGS TAB ═══ */}
              {activeTab === "logs" && (
                <motion.div key="logs" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
                  <GCard>
                    <STitle icon={Activity} title={`Activity Logs (${activityLogs.length})`}>
                      <button onClick={purgeLogs}
                        className="flex items-center gap-1 px-2 py-1 text-[8px] text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-sm transition-all uppercase tracking-wider">
                        <Trash2 size={9} /> Purge
                      </button>
                    </STitle>

                    <div className="space-y-1 max-h-[500px] overflow-y-auto">
                      {activityLogs.length === 0 ? (
                        <div className="text-center py-12 text-[10px] text-white/20 tracking-wider uppercase">No activity logs</div>
                      ) : (
                        activityLogs.map((log, i) => (
                          <div key={log.id || i} className="flex items-start gap-3 py-2 px-2 hover:bg-white/3 rounded-sm transition-colors border-b border-white/3">
                            <SeverityBadge level={log.severity} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-white/70 font-semibold">{log.action}</div>
                              {log.details && <div className="text-[9px] text-white/30 truncate mt-0.5">{log.details}</div>}
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-[9px] text-[#d4af37]/50 font-mono">{log.category}</div>
                              <div className="text-[8px] text-white/20">{fmtDate(log.timestamp)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GCard>
                </motion.div>
              )}

              {/* ═══ DB TERMINAL TAB ═══ */}
              {activeTab === "database" && (
                <motion.div key="database" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  <GCard className="h-[550px] flex flex-col">
                    <STitle icon={Database} title="Supabase KV Direct Terminal" />
                    <div ref={dbTermRef}
                      className="flex-grow bg-[#050505] border border-white/5 font-mono text-xs text-green-500 p-4 overflow-auto rounded-sm whitespace-pre-wrap mb-3">
                      {dbOutput}
                    </div>
                    <div className="flex items-center gap-2 bg-[#050505] border border-white/5 px-3 py-2 rounded-sm">
                      <span className="text-[#d4af37] font-mono text-sm">{">"}</span>
                      <input
                        type="text"
                        value={dbCommand}
                        onChange={e => setDbCommand(e.target.value)}
                        onKeyDown={executeDbCommand}
                        className="bg-transparent border-none outline-none flex-grow text-white font-mono text-xs"
                        placeholder="get kyc:0x... | set key value | del key | getByPrefix prefix"
                        autoFocus
                      />
                    </div>
                  </GCard>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
