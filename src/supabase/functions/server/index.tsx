import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const app = new Hono();

// Initialize Supabase client with service role
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-client-info", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Explicitly handle OPTIONS for all routes
app.options("*", (c) => c.text("", 204));

// Health check endpoint
app.get("/make-server-cc38a303/health", (c) => {
  return c.json({ status: "ok" });
});

// Endpoint pour récupérer de manière sécurisée ou utiliser les clés d'API blockchain via proxy
// Cela évite d'exposer les clés en clair au frontend si on le souhaite.
app.post("/make-server-cc38a303/rpc/proxy/:provider", async (c) => {
  try {
    const provider = c.req.param("provider"); // alchemy, infura
    const body = await c.req.json();
    const network = c.req.query("network") || "eth-mainnet";

    // ── Resolve API key using unified helpers ──
    let apiKey: string | null = null;

    if (provider === "alchemy") {
      apiKey = await getAlchemyKey();
    } else if (provider === "infura") {
      apiKey = sanitizeApiKey(Deno.env.get("INFURA_API_KEY"));
      if (!apiKey) {
        try {
          const stored = await kv.get("infura_api_key");
          const v = stored?.value;
          apiKey = sanitizeApiKey(typeof v === "string" ? v : v?.key);
        } catch { /* no infura key */ }
      }
    } else {
      return c.json({ error: `Provider non supporté: ${provider}. Utilisez 'alchemy' ou 'infura'.` }, 400);
    }

    if (!apiKey) {
      console.log(`RPC Proxy: no API key found for ${provider} (checked env + KV)`);
      return c.json({
        error: `Clé API introuvable pour ${provider}. Vérifiez que ${provider.toUpperCase()}_API_KEY est configurée dans les secrets Supabase ou le KV store.`,
        provider,
        keySource: "none",
      }, 400);
    }

    console.log(`RPC Proxy: ${provider}/${network} — key found (${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)})`);

    // ── Build RPC URL ──
    let rpcUrl = "";
    if (provider === "alchemy") {
      rpcUrl = `https://${network}.g.alchemy.com/v2/${apiKey}`;
    } else {
      const infuraNetwork = network === "eth-mainnet" ? "mainnet" : network.replace("-", "/");
      rpcUrl = `https://${infuraNetwork}.infura.io/v3/${apiKey}`;
    }

    // ── Proxy the request ──
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // ── Read response body once ──
    const responseText = await response.text();

    // ── Handle auth errors from upstream provider ──
    if (response.status === 401 || response.status === 403) {
      console.log(`RPC Proxy AUTH FAIL: ${provider}/${network} HTTP ${response.status} — ${responseText.substring(0, 300)}`);
      return c.json({
        error: `Authentification RPC refusée (HTTP ${response.status}). La clé API ${provider.toUpperCase()} est peut-être invalide, expirée, ou le réseau "${network}" n'est pas activé sur votre plan Alchemy.`,
        provider,
        network,
        requiresReset: true,
        upstreamStatus: response.status,
        upstreamBody: responseText.substring(0, 200),
      }, 200); // Return 200 so frontend can read the JSON error details
    }

    // ── Parse JSON response ──
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (_e) {
      console.log(`RPC Proxy: non-JSON response from ${provider}/${network}:`, responseText.substring(0, 200));
      return c.json({ error: "Réponse invalide du provider (non-JSON)", details: responseText.substring(0, 200) }, 502);
    }

    // ── Check for JSON-RPC level errors ──
    if (data.error) {
      console.log(`RPC Proxy: JSON-RPC error from ${provider}/${network}: ${data.error.message || JSON.stringify(data.error)}`);
      // Still return the data as-is so the frontend can interpret it
    }

    return c.json(data, 200);
  } catch (error) {
    console.log("RPC Proxy internal error:", (error as Error).message);
    return c.json({ error: `Erreur interne RPC proxy: ${(error as Error).message}` }, 500);
  }
});

// Endpoint pour configurer et vérifier les clés (pour le Dashboard God Mode)
app.post("/make-server-cc38a303/keys/config", async (c) => {
  try {
    const body = await c.req.json();
    const { provider, apiKey } = body;
    
    if (!provider || !apiKey) {
      return c.json({ error: "Provider et apiKey requis" }, 400);
    }
    
    // Stocker de manière sécurisée dans le KV store (sanitized)
    const cleanKey = sanitizeApiKey(apiKey);
    if (!cleanKey) {
      return c.json({ error: "Clé API invalide (trop courte ou contient des caractères non imprimables)" }, 400);
    }
    await kv.set(`${provider.toLowerCase()}_api_key`, cleanKey);
    
    return c.json({ success: true, message: `Clé API ${provider} configurée avec succès` });
  } catch (error) {
    console.error("Erreur configuration clés:", error);
    return c.json({ error: "Erreur lors de la configuration" }, 500);
  }
});

app.get("/make-server-cc38a303/keys/status", async (c) => {
  try {
    // Ne pas renvoyer les clés, juste leur statut et la source
    const alchemyKeyEnv = Deno.env.get("ALCHEMY_API_KEY");
    const infuraKeyEnv = Deno.env.get("INFURA_API_KEY");
    
    const alchemyKeyKv = await kv.get("alchemy_api_key");
    const infuraKeyKv = await kv.get("infura_api_key");
    
    // Use sanitizeApiKey for consistent key resolution
    const alchKey = sanitizeApiKey(alchemyKeyEnv) || sanitizeApiKey(typeof alchemyKeyKv?.value === "string" ? alchemyKeyKv.value : alchemyKeyKv?.value?.key);
    const infKey = sanitizeApiKey(infuraKeyEnv) || sanitizeApiKey(typeof infuraKeyKv?.value === "string" ? infuraKeyKv.value : infuraKeyKv?.value?.key);

    // Live-test Alchemy key if found
    let alchemyLiveTest = "skipped";
    if (alchKey) {
      try {
        const testRes = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${alchKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
        });
        if (testRes.ok) {
          const testData = await testRes.json();
          alchemyLiveTest = testData.result ? `OK (chainId: ${testData.result})` : `RPC error: ${testData.error?.message || "unknown"}`;
        } else {
          const errTxt = await testRes.text().catch(() => "");
          alchemyLiveTest = `HTTP ${testRes.status}: ${errTxt.substring(0, 100)}`;
        }
      } catch (e) {
        alchemyLiveTest = `Network error: ${(e as Error).message}`;
      }
    }

    // Debug: log raw env var characteristics
    const rawEnv = Deno.env.get("ALCHEMY_API_KEY");
    const envDebug = rawEnv
      ? { length: rawEnv.length, startsWithQuote: rawEnv.startsWith('"') || rawEnv.startsWith("'"), hasNewline: rawEnv.includes("\n"), hasSpace: rawEnv.includes(" ") }
      : null;

    return c.json({
      alchemy: !!alchKey,
      alchemySource: alchemyKeyEnv ? "env" : alchemyKeyKv?.value ? "kv" : "none",
      alchemyKeyPreview: alchKey ? `${alchKey.substring(0, 6)}...${alchKey.substring(alchKey.length - 4)} (${alchKey.length} chars)` : "none",
      alchemyLiveTest,
      alchemyEnvDebug: envDebug,
      infura: !!infKey,
      infuraSource: infuraKeyEnv ? "env" : infuraKeyKv?.value ? "kv" : "none",
    });
  } catch (error) {
    console.error("Erreur statut clés:", error);
    return c.json({ error: "Erreur lors de la vérification des clés" }, 500);
  }
});

// --- GOD MODE ENDPOINTS ---

// 1. Kill Switch
app.post("/make-server-cc38a303/god-mode/kill-switch", async (c) => {
  try {
    const { enabled } = await c.req.json();
    await kv.set("system:kill_switch", { enabled, timestamp: Date.now() });
    return c.json({ success: true, message: enabled ? "NETWORK FROZEN" : "NETWORK UNPAUSED", enabled });
  } catch (error) {
    return c.json({ error: "Failed to toggle kill switch" }, 500);
  }
});

app.get("/make-server-cc38a303/god-mode/kill-switch/status", async (c) => {
  try {
    const status = await kv.get("system:kill_switch");
    return c.json({ enabled: status?.value?.enabled || false });
  } catch (error) {
    return c.json({ error: "Failed to get kill switch status" }, 500);
  }
});

// 2. KYC Override
app.post("/make-server-cc38a303/god-mode/override-kyc", async (c) => {
  try {
    const { address, tier } = await c.req.json();
    if (!address) return c.json({ error: "Address required" }, 400);
    
    await kv.set(`kyc:${address.toLowerCase()}`, {
      status: "verified",
      tier,
      verifiedBy: "GOD_MODE",
      timestamp: Date.now()
    });
    return c.json({ success: true, message: `KYC overridden for ${address}` });
  } catch (error) {
    return c.json({ error: "Failed to override KYC" }, 500);
  }
});

// 3. Force Transfer (Asset Seizure)
app.post("/make-server-cc38a303/god-mode/force-transfer", async (c) => {
  try {
    const { token, from, to, amount } = await c.req.json();
    if (!token || !from || !to || !amount) return c.json({ error: "Missing parameters" }, 400);
    
    const seizureId = `seizure:${Date.now()}`;
    await kv.set(seizureId, { token, from, to, amount, status: "executed", timestamp: Date.now() });
    
    return c.json({ success: true, message: `Forced transfer of ${amount} from ${from} to ${to} recorded. ID: ${seizureId}` });
  } catch (error) {
    return c.json({ error: "Failed to execute forced transfer" }, 500);
  }
});

// 4. DB Direct Injection (KV Store Access)
app.post("/make-server-cc38a303/god-mode/kv-query", async (c) => {
  try {
    const { action, key, value, prefix } = await c.req.json();
    
    switch (action) {
      case "get":
        if (!key) return c.json({ error: "Key required" }, 400);
        const getRes = await kv.get(key);
        return c.json({ result: getRes });
      case "set":
        if (!key || value === undefined) return c.json({ error: "Key and value required" }, 400);
        await kv.set(key, value);
        return c.json({ success: true, message: `Key ${key} set` });
      case "del":
        if (!key) return c.json({ error: "Key required" }, 400);
        await kv.del(key);
        return c.json({ success: true, message: `Key ${key} deleted` });
      case "getByPrefix":
        if (!prefix) return c.json({ error: "Prefix required" }, 400);
        const prefixRes = await kv.getByPrefix(prefix);
        return c.json({ result: prefixRes });
      default:
        return c.json({ error: "Invalid action. Use get, set, del, or getByPrefix" }, 400);
    }
  } catch (error) {
    return c.json({ error: `KV Operation failed: ${error.message}` }, 500);
  }
});

// --- LOTTERY SYSTEM ENDPOINTS ---

// Start new lottery
app.post("/make-server-cc38a303/lottery/start", async (c) => {
  try {
    const { maxTickets, ticketPrice, prize } = await c.req.json();
    
    if (!maxTickets || !ticketPrice) {
      return c.json({ error: "maxTickets and ticketPrice required" }, 400);
    }

    const lotteryId = `lottery:${Date.now()}`;
    const lotteryData = {
      id: lotteryId,
      status: "open",
      maxTickets: parseInt(maxTickets),
      ticketPrice: ticketPrice.toString(),
      prize: prize || "TBD",
      ticketsSold: 0,
      participants: [],
      createdAt: Date.now(),
      winner: null
    };

    await kv.set(lotteryId, lotteryData);
    await kv.set("lottery:current", lotteryId);

    console.log(`✅ Lottery started: ${lotteryId}`);
    return c.json({ 
      success: true, 
      message: "Lottery started successfully",
      lotteryId,
      data: lotteryData
    });
  } catch (error) {
    console.error("Error starting lottery:", error);
    return c.json({ error: `Failed to start lottery: ${error.message}` }, 500);
  }
});

// Buy lottery ticket
app.post("/make-server-cc38a303/lottery/buy-ticket", async (c) => {
  try {
    const { userAddress, txHash } = await c.req.json();
    
    if (!userAddress) {
      return c.json({ error: "userAddress required" }, 400);
    }

    const currentLotteryId = await kv.get("lottery:current");
    if (!currentLotteryId?.value) {
      return c.json({ error: "No active lottery" }, 404);
    }

    const lottery = await kv.get(currentLotteryId.value);
    if (!lottery?.value || lottery.value.status !== "open") {
      return c.json({ error: "Lottery not open" }, 400);
    }

    if (lottery.value.ticketsSold >= lottery.value.maxTickets) {
      return c.json({ error: "Lottery sold out" }, 400);
    }

    // Add participant
    lottery.value.ticketsSold += 1;
    lottery.value.participants.push({
      address: userAddress,
      ticketNumber: lottery.value.ticketsSold,
      txHash: txHash || `0x${Date.now().toString(16)}`,
      timestamp: Date.now()
    });

    await kv.set(currentLotteryId.value, lottery.value);

    return c.json({
      success: true,
      message: "Ticket purchased successfully",
      ticketNumber: lottery.value.ticketsSold,
      totalTickets: lottery.value.maxTickets
    });
  } catch (error) {
    console.error("Error buying ticket:", error);
    return c.json({ error: `Failed to buy ticket: ${error.message}` }, 500);
  }
});

// Pick winner (God Mode)
app.post("/make-server-cc38a303/lottery/pick-winner", async (c) => {
  try {
    const currentLotteryId = await kv.get("lottery:current");
    if (!currentLotteryId?.value) {
      return c.json({ error: "No active lottery" }, 404);
    }

    const lottery = await kv.get(currentLotteryId.value);
    if (!lottery?.value) {
      return c.json({ error: "Lottery not found" }, 404);
    }

    if (lottery.value.participants.length === 0) {
      return c.json({ error: "No participants" }, 400);
    }

    // Simulate Midpoint Oracle random number
    const randomIndex = Math.floor(Math.random() * lottery.value.participants.length);
    const winner = lottery.value.participants[randomIndex];

    lottery.value.status = "closed";
    lottery.value.winner = winner;
    lottery.value.closedAt = Date.now();

    await kv.set(currentLotteryId.value, lottery.value);
    await kv.set("lottery:current", null);

    // Store winner in history
    await kv.set(`lottery:winner:${Date.now()}`, {
      lotteryId: currentLotteryId.value,
      winner: winner.address,
      ticketNumber: winner.ticketNumber,
      prize: lottery.value.prize,
      timestamp: Date.now()
    });

    console.log(`🎉 Winner selected: ${winner.address}`);
    return c.json({
      success: true,
      message: "Winner selected successfully",
      winner: winner,
      lotteryData: lottery.value
    });
  } catch (error) {
    console.error("Error picking winner:", error);
    return c.json({ error: `Failed to pick winner: ${error.message}` }, 500);
  }
});

// Get current lottery status
app.get("/make-server-cc38a303/lottery/status", async (c) => {
  try {
    const currentLotteryId = await kv.get("lottery:current");
    
    if (!currentLotteryId?.value) {
      return c.json({ 
        active: false,
        message: "No active lottery"
      });
    }

    const lottery = await kv.get(currentLotteryId.value);
    
    return c.json({
      active: true,
      lottery: lottery?.value || null
    });
  } catch (error) {
    console.error("Error getting lottery status:", error);
    return c.json({ error: "Failed to get lottery status" }, 500);
  }
});

// Get lottery history
app.get("/make-server-cc38a303/lottery/history", async (c) => {
  try {
    const winners = await kv.getByPrefix("lottery:winner:");
    return c.json({ 
      success: true,
      winners: winners || []
    });
  } catch (error) {
    console.error("Error getting lottery history:", error);
    return c.json({ error: "Failed to get history" }, 500);
  }
});

// --- SMART CONTRACT STUDIO ENDPOINTS ---

// Deploy ERC-3643 Token
app.post("/make-server-cc38a303/studio/deploy-token", async (c) => {
  try {
    const { name, symbol, decimals, initialSupply, compliance } = await c.req.json();
    
    if (!name || !symbol) {
      return c.json({ error: "name and symbol required" }, 400);
    }

    const contractId = `contract:erc3643:${Date.now()}`;
    const contractData = {
      id: contractId,
      type: "ERC-3643",
      name,
      symbol,
      decimals: decimals || 18,
      initialSupply: initialSupply || "0",
      compliance: compliance || {},
      status: "deploying",
      deployedAt: Date.now(),
      // Simulate contract address
      address: `0x${Math.random().toString(16).slice(2, 42)}`.toLowerCase(),
      network: "ethereum-mainnet"
    };

    await kv.set(contractId, contractData);

    // Simulate deployment process
    setTimeout(async () => {
      contractData.status = "deployed";
      await kv.set(contractId, contractData);
    }, 3000);

    return c.json({
      success: true,
      message: "Token deployment initiated",
      contract: contractData
    });
  } catch (error) {
    console.error("Error deploying token:", error);
    return c.json({ error: `Failed to deploy token: ${error.message}` }, 500);
  }
});

// Get all deployed contracts
app.get("/make-server-cc38a303/studio/contracts", async (c) => {
  try {
    const contracts = await kv.getByPrefix("contract:");
    return c.json({ 
      success: true,
      contracts: contracts || []
    });
  } catch (error) {
    console.error("Error getting contracts:", error);
    return c.json({ error: "Failed to get contracts" }, 500);
  }
});

// --- REAL ESTATE TOKENIZATION ENDPOINTS ---

// Create property token
app.post("/make-server-cc38a303/real-estate/create-property", async (c) => {
  try {
    const { title, location, totalValue, tokenSupply, minInvestment, images, description } = await c.req.json();
    
    if (!title || !location || !totalValue || !tokenSupply) {
      return c.json({ error: "Required fields missing" }, 400);
    }

    const propertyId = `property:${Date.now()}`;
    const propertyData = {
      id: propertyId,
      title,
      location,
      totalValue: parseFloat(totalValue),
      tokenSupply: parseInt(tokenSupply),
      minInvestment: parseFloat(minInvestment) || 100,
      images: images || [],
      description: description || "",
      status: "active",
      tokensSold: 0,
      investors: [],
      createdAt: Date.now(),
      // Generate contract address
      contractAddress: `0x${Math.random().toString(16).slice(2, 42)}`.toLowerCase(),
      // Compliance
      kycRequired: true,
      accreditedOnly: true
    };

    await kv.set(propertyId, propertyData);

    return c.json({
      success: true,
      message: "Property created successfully",
      property: propertyData
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return c.json({ error: `Failed to create property: ${error.message}` }, 500);
  }
});

// Invest in property
app.post("/make-server-cc38a303/real-estate/invest", async (c) => {
  try {
    const { propertyId, userAddress, amount, kycStatus } = await c.req.json();
    
    if (!propertyId || !userAddress || !amount) {
      return c.json({ error: "Required fields missing" }, 400);
    }

    // Check KYC
    const kyc = await kv.get(`kyc:${userAddress.toLowerCase()}`);
    if (!kyc?.value || kyc.value.status !== "verified") {
      return c.json({ error: "KYC verification required" }, 403);
    }

    const property = await kv.get(propertyId);
    if (!property?.value) {
      return c.json({ error: "Property not found" }, 404);
    }

    const tokensToMint = parseInt(amount);
    if (property.value.tokensSold + tokensToMint > property.value.tokenSupply) {
      return c.json({ error: "Insufficient tokens available" }, 400);
    }

    // Add investor
    property.value.tokensSold += tokensToMint;
    property.value.investors.push({
      address: userAddress,
      tokens: tokensToMint,
      investment: (tokensToMint / property.value.tokenSupply) * property.value.totalValue,
      timestamp: Date.now(),
      txHash: `0x${Date.now().toString(16)}`
    });

    await kv.set(propertyId, property.value);

    // Record user's portfolio
    const userPortfolioKey = `portfolio:${userAddress.toLowerCase()}`;
    const userPortfolio = await kv.get(userPortfolioKey);
    const portfolio = userPortfolio?.value || { properties: [] };
    
    portfolio.properties.push({
      propertyId,
      tokens: tokensToMint,
      investedAt: Date.now()
    });

    await kv.set(userPortfolioKey, portfolio);

    return c.json({
      success: true,
      message: "Investment successful",
      tokens: tokensToMint,
      property: property.value
    });
  } catch (error) {
    console.error("Error processing investment:", error);
    return c.json({ error: `Failed to process investment: ${error.message}` }, 500);
  }
});

// Get all properties
app.get("/make-server-cc38a303/real-estate/properties", async (c) => {
  try {
    const properties = await kv.getByPrefix("property:");
    return c.json({ 
      success: true,
      properties: properties || []
    });
  } catch (error) {
    console.error("Error getting properties:", error);
    return c.json({ error: "Failed to get properties" }, 500);
  }
});

// Get user portfolio
app.get("/make-server-cc38a303/real-estate/portfolio/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const portfolio = await kv.get(`portfolio:${address.toLowerCase()}`);
    
    return c.json({
      success: true,
      portfolio: portfolio?.value || { properties: [] }
    });
  } catch (error) {
    console.error("Error getting portfolio:", error);
    return c.json({ error: "Failed to get portfolio" }, 500);
  }
});

// --- AUTHENTICATION ENDPOINTS ---

// Sign up
app.post("/make-server-cc38a303/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email },
      // Automatically confirm since no email server configured
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      success: true,
      message: "User created successfully",
      user: data.user
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// --- ANALYTICS ENDPOINTS ---

// Get platform stats
app.get("/make-server-cc38a303/analytics/stats", async (c) => {
  try {
    const properties = await kv.getByPrefix("property:");
    const contracts = await kv.getByPrefix("contract:");
    const kycUsers = await kv.getByPrefix("kyc:");
    
    const totalTVL = properties.reduce((sum: number, p: any) => {
      return sum + (p.value?.totalValue || 0);
    }, 0);

    const totalInvestors = new Set(
      properties.flatMap((p: any) => 
        (p.value?.investors || []).map((i: any) => i.address)
      )
    ).size;

    return c.json({
      success: true,
      stats: {
        totalValueLocked: totalTVL,
        activeProperties: properties.length,
        totalContracts: contracts.length,
        verifiedUsers: kycUsers.filter((k: any) => k.value?.status === "verified").length,
        totalInvestors,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return c.json({ error: "Failed to get stats" }, 500);
  }
});

// Get flash loan bot stats
app.get("/make-server-cc38a303/analytics/flashbot", async (c) => {
  try {
    const botStats = await kv.get("flashbot:stats");
    
    return c.json({
      success: true,
      stats: botStats?.value || {
        totalTrades: 0,
        successRate: 0,
        totalProfit: "0",
        avgGasUsed: "0",
        lastUpdate: Date.now()
      }
    });
  } catch (error) {
    console.error("Error getting flashbot stats:", error);
    return c.json({ error: "Failed to get flashbot stats" }, 500);
  }
});

// Update flash loan bot stats (called by bot)
app.post("/make-server-cc38a303/analytics/flashbot/update", async (c) => {
  try {
    const stats = await c.req.json();
    await kv.set("flashbot:stats", { ...stats, lastUpdate: Date.now() });
    
    return c.json({
      success: true,
      message: "Stats updated"
    });
  } catch (error) {
    console.error("Error updating flashbot stats:", error);
    return c.json({ error: "Failed to update stats" }, 500);
  }
});

// --- GOD MODE PRODUCTION ENDPOINTS ---

// Activity Log - Add entry
app.post("/make-server-cc38a303/god-mode/activity-log", async (c) => {
  try {
    const { action, category, details, severity } = await c.req.json();
    const logId = `actlog:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    const entry = {
      id: logId,
      action,
      category: category || "system",
      details: details || "",
      severity: severity || "info",
      timestamp: Date.now(),
    };
    await kv.set(logId, entry);
    return c.json({ success: true, entry });
  } catch (error) {
    console.error("Error adding activity log:", error);
    return c.json({ error: "Failed to add log" }, 500);
  }
});

// Activity Log - Get recent
app.get("/make-server-cc38a303/god-mode/activity-log", async (c) => {
  try {
    const logs = await kv.getByPrefix("actlog:");
    const sorted = (logs || [])
      .map((l: any) => l.value)
      .filter(Boolean)
      .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 100);
    return c.json({ success: true, logs: sorted });
  } catch (error) {
    console.error("Error getting activity logs:", error);
    return c.json({ error: "Failed to get logs" }, 500);
  }
});

// System Health
app.get("/make-server-cc38a303/god-mode/system-health", async (c) => {
  try {
    const killSwitch = await kv.get("system:kill_switch");
    const currentLottery = await kv.get("lottery:current");
    const properties = await kv.getByPrefix("property:");
    const contracts = await kv.getByPrefix("contract:");
    const kycUsers = await kv.getByPrefix("kyc:");
    const seizures = await kv.getByPrefix("seizure:");
    const portfolios = await kv.getByPrefix("portfolio:");
    const flashbotStats = await kv.get("flashbot:stats");

    return c.json({
      success: true,
      health: {
        serverStatus: "online",
        killSwitch: killSwitch?.value?.enabled || false,
        lotteryActive: !!currentLottery?.value,
        totalProperties: properties.length,
        totalContracts: contracts.length,
        totalKycUsers: kycUsers.length,
        verifiedKyc: kycUsers.filter((k: any) => k.value?.status === "verified").length,
        totalSeizures: seizures.length,
        totalPortfolios: portfolios.length,
        flashbotStats: flashbotStats?.value || null,
        uptime: Date.now(),
        timestamp: Date.now(),
      }
    });
  } catch (error) {
    console.error("Error getting system health:", error);
    return c.json({ error: "Failed to get system health" }, 500);
  }
});

// God Mode Overview - comprehensive stats
app.get("/make-server-cc38a303/god-mode/overview", async (c) => {
  try {
    const properties = await kv.getByPrefix("property:");
    const contracts = await kv.getByPrefix("contract:");
    const kycUsers = await kv.getByPrefix("kyc:");
    const seizures = await kv.getByPrefix("seizure:");
    const lotteryWinners = await kv.getByPrefix("lottery:winner:");
    const currentLottery = await kv.get("lottery:current");
    const killSwitch = await kv.get("system:kill_switch");
    const flashbotStats = await kv.get("flashbot:stats");

    // Calculate TVL
    const totalTVL = properties.reduce((sum: number, p: any) => {
      return sum + (p.value?.totalValue || 0);
    }, 0);

    // Calculate total tokens sold
    const totalTokensSold = properties.reduce((sum: number, p: any) => {
      return sum + (p.value?.tokensSold || 0);
    }, 0);

    // Unique investors
    const allInvestors = new Set(
      properties.flatMap((p: any) =>
        (p.value?.investors || []).map((i: any) => i.address)
      )
    );

    // KYC breakdown
    const kycBreakdown = {
      total: kycUsers.length,
      verified: kycUsers.filter((k: any) => k.value?.status === "verified").length,
      godMode: kycUsers.filter((k: any) => k.value?.verifiedBy === "GOD_MODE").length,
    };

    // Properties breakdown
    const propertiesData = properties.map((p: any) => ({
      id: p.key,
      title: p.value?.title || "Unknown",
      location: p.value?.location || "Unknown",
      totalValue: p.value?.totalValue || 0,
      tokensSold: p.value?.tokensSold || 0,
      tokenSupply: p.value?.tokenSupply || 0,
      investorCount: (p.value?.investors || []).length,
      status: p.value?.status || "unknown",
      createdAt: p.value?.createdAt || 0,
    }));

    // Contracts breakdown
    const contractsData = contracts.map((c: any) => ({
      id: c.key,
      type: c.value?.type || "Unknown",
      name: c.value?.name || "Unknown",
      symbol: c.value?.symbol || "???",
      address: c.value?.address || "0x0",
      status: c.value?.status || "unknown",
      network: c.value?.network || "unknown",
      deployedAt: c.value?.deployedAt || 0,
    }));

    // KYC users list
    const kycList = kycUsers.map((k: any) => ({
      address: k.key?.replace("kyc:", "") || "unknown",
      status: k.value?.status || "unknown",
      tier: k.value?.tier || "Unknown",
      verifiedBy: k.value?.verifiedBy || "unknown",
      timestamp: k.value?.timestamp || 0,
    }));

    // Seizures list
    const seizuresList = seizures.map((s: any) => ({
      id: s.key,
      token: s.value?.token || "0x0",
      from: s.value?.from || "0x0",
      to: s.value?.to || "0x0",
      amount: s.value?.amount || "0",
      status: s.value?.status || "unknown",
      timestamp: s.value?.timestamp || 0,
    }));

    // Current lottery
    let currentLotteryData = null;
    if (currentLottery?.value) {
      const lotteryData = await kv.get(currentLottery.value);
      currentLotteryData = lotteryData?.value || null;
    }

    return c.json({
      success: true,
      overview: {
        kpis: {
          totalTVL,
          totalTokensSold,
          uniqueInvestors: allInvestors.size,
          totalProperties: properties.length,
          totalContracts: contracts.length,
          totalSeizures: seizures.length,
          lotteryWinners: lotteryWinners.length,
          killSwitchActive: killSwitch?.value?.enabled || false,
        },
        kyc: kycBreakdown,
        kycList,
        properties: propertiesData,
        contracts: contractsData,
        seizures: seizuresList,
        currentLottery: currentLotteryData,
        flashbot: flashbotStats?.value || null,
        timestamp: Date.now(),
      }
    });
  } catch (error) {
    console.error("Error getting god mode overview:", error);
    return c.json({ error: "Failed to get overview" }, 500);
  }
});

// God Mode - List all KYC users
app.get("/make-server-cc38a303/god-mode/users", async (c) => {
  try {
    const kycUsers = await kv.getByPrefix("kyc:");
    const users = kycUsers.map((k: any) => ({
      address: k.key?.replace("kyc:", "") || "unknown",
      ...k.value,
    }));
    return c.json({ success: true, users });
  } catch (error) {
    console.error("Error listing users:", error);
    return c.json({ error: "Failed to list users" }, 500);
  }
});

// God Mode - Delete KYC entry
app.post("/make-server-cc38a303/god-mode/revoke-kyc", async (c) => {
  try {
    const { address } = await c.req.json();
    if (!address) return c.json({ error: "Address required" }, 400);
    await kv.del(`kyc:${address.toLowerCase()}`);
    return c.json({ success: true, message: `KYC revoked for ${address}` });
  } catch (error) {
    return c.json({ error: "Failed to revoke KYC" }, 500);
  }
});

// God Mode - Purge activity logs
app.post("/make-server-cc38a303/god-mode/purge-logs", async (c) => {
  try {
    const logs = await kv.getByPrefix("actlog:");
    const keys = logs.map((l: any) => l.key).filter(Boolean);
    if (keys.length > 0) {
      await kv.mdel(keys);
    }
    return c.json({ success: true, message: `${keys.length} logs purged` });
  } catch (error) {
    return c.json({ error: "Failed to purge logs" }, 500);
  }
});

// ═══════════════════════════════════════════════
// ALCHEMY ON-CHAIN REAL ENDPOINTS
// ═══════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════
// ALCHEMY KEY SANITIZATION (CRITICAL: Must preserve valid key format)
// ══════════════════════════════════════════════════════════════════
/**
 * Sanitize API key with MINIMAL modification to preserve valid keys
 * Alchemy keys are typically 32-char alphanumeric strings
 * Example format: "AbC123dEf456GhI789JkL012MnO345Pq"
 */
function sanitizeApiKey(raw: string | undefined | null): string | null {
  if (!raw) return null;
  
  // Step 1: Convert to string and basic trim
  let key = String(raw).trim();
  
  // Step 2: Remove ONLY surrounding quotes (single pass)
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  
  // Step 3: Remove invisible/control characters (BOM, zero-width, etc.)
  key = key.replace(/[\u200B-\u200D\uFEFF\u0000-\u001F\u007F]/g, "");
  
  // Step 4: Remove ALL whitespace (spaces, tabs, newlines)
  key = key.replace(/\s+/g, "");
  
  // Step 5: Handle URL encoding CAREFULLY
  if (key.includes("%")) {
    try {
      const decoded = decodeURIComponent(key);
      // Only accept decoded version if it looks valid (alphanumeric + safe chars)
      if (/^[a-zA-Z0-9_\-]+$/.test(decoded)) {
        key = decoded;
      } else {
        // Decoding produced garbage, just remove % sequences
        key = key.replace(/%[0-9A-Fa-f]{2}/g, "");
      }
    } catch {
      // Decoding failed, strip % sequences
      key = key.replace(/%[0-9A-Fa-f]{2}/g, "");
    }
  }
  
  // Step 6: Remove ONLY clearly invalid characters (keep alphanumeric + _ -)
  // Alchemy keys are alphanumeric, but may contain dash or underscore
  const cleaned = key.replace(/[^a-zA-Z0-9_\-]/g, "");
  
  // Step 7: Validate final length (Alchemy keys are 32 chars, but accept 20+ to be safe)
  if (cleaned.length < 20) {
    console.log(`[sanitizeApiKey] REJECT: key too short (${cleaned.length} chars, expected 32)`);
    return null;
  }
  
  // Step 8: Log what we're returning (for debugging)
  console.log(`[sanitizeApiKey] OK: ${cleaned.length} chars, preview: ${cleaned.substring(0, 4)}...${cleaned.substring(cleaned.length - 4)}`);
  
  return cleaned;
}

// Helper: get Alchemy API key (env first, KV fallback) — cached
let _cachedAlchemyKey: string | null | undefined = undefined;
async function getAlchemyKey(): Promise<string | null> {
  if (_cachedAlchemyKey !== undefined) return _cachedAlchemyKey;
  
  const rawEnv = Deno.env.get("ALCHEMY_API_KEY");
  if (rawEnv) {
    const charCodes = Array.from(rawEnv.slice(0, 10)).map(c => c.charCodeAt(0));
    console.log(`getAlchemyKey: raw env length=${rawEnv.length}, first10charCodes=[${charCodes.join(",")}]`);
  }
  const envKey = sanitizeApiKey(rawEnv);
  if (envKey) {
    console.log(`getAlchemyKey: sanitized env key OK (${envKey.length} chars, preview: ${envKey.substring(0, 4)}...${envKey.substring(envKey.length - 4)})`);
    _cachedAlchemyKey = envKey;
    return envKey;
  }
  // Fallback: KV store
  try {
    const stored = await kv.get("alchemy_api_key");
    const kvVal = stored?.value;
    const rawKv = typeof kvVal === "string" ? kvVal : kvVal?.key;
    const kvKey = sanitizeApiKey(rawKv);
    if (kvKey) {
      console.log(`getAlchemyKey: KV fallback key found (${kvKey.length} chars)`);
      _cachedAlchemyKey = kvKey;
      return kvKey;
    }
  } catch (e) {
    console.log("getAlchemyKey KV fallback error:", (e as Error).message);
  }
  console.log("getAlchemyKey: NO KEY FOUND in env or KV store");
  _cachedAlchemyKey = null;
  return null;
}

// Helper: call Alchemy JSON-RPC with Public Fallback
async function alchemyRpc(method: string, params: any[] = [], network: string = "eth-mainnet"): Promise<any> {
  const getPublicRpcUrl = (net: string) => {
    switch (net) {
      case "eth-mainnet": return "https://cloudflare-eth.com";
      case "polygon-mainnet": return "https://polygon-rpc.com";
      case "arb-mainnet": return "https://arb1.arbitrum.io/rpc";
      case "opt-mainnet": return "https://mainnet.optimism.io";
      case "eth-goerli": return "https://rpc.ankr.com/eth_goerli";
      case "eth-sepolia": return "https://rpc.sepolia.org";
      default: return "https://cloudflare-eth.com";
    }
  };

  let apiKey;
  try {
    apiKey = await getAlchemyKey();
  } catch (e) {
    apiKey = null;
  }

  let url = apiKey 
    ? `https://${network}.g.alchemy.com/v2/${apiKey}`
    : getPublicRpcUrl(network);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });

    if (!res.ok) {
      if ((res.status === 401 || res.status === 403 || res.status === 404) && apiKey) {
        console.warn(`Alchemy RPC failed (${res.status}). Falling back to public RPC...`);
        _cachedAlchemyKey = undefined; // Invalidate bad key
        // Fallback to public RPC
        url = getPublicRpcUrl(network);
        const fallbackRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });
        
        if (!fallbackRes.ok) {
          const text = await fallbackRes.text();
          throw new Error(`Public RPC fallback error ${fallbackRes.status} on ${network}: ${text.substring(0, 200)}`);
        }
        
        const fallbackData = await fallbackRes.json();
        if (fallbackData.error) throw new Error(`RPC error on ${network}: ${fallbackData.error.message}`);
        return fallbackData.result;
      }
      
      const text = await res.text();
      throw new Error(`RPC error ${res.status} on ${network}: ${text.substring(0, 200)}`);
    }

    const data = await res.json();
    if (data.error) throw new Error(`RPC error on ${network}: ${data.error.message}`);
    return data.result;
  } catch (error: any) {
    // If network fetch fails, try fallback one more time
    if (!url.includes("alchemy.com") && error.message && error.message.includes("fetch")) {
      throw error;
    }
    
    if (apiKey) {
       console.warn(`Network error with Alchemy. Falling back to public RPC...`);
       url = getPublicRpcUrl(network);
       const fallbackRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
       });
       const fallbackData = await fallbackRes.json();
       if (fallbackData.error) throw new Error(`RPC error on ${network}: ${fallbackData.error.message}`);
       return fallbackData.result;
    }
    throw error;
  }
}

// Helper: call Alchemy REST/Enhanced API with Public Fallback where possible
async function alchemyApi(endpoint: string, body: any, network: string = "eth-mainnet"): Promise<any> {
  const getPublicRpcUrl = (net: string) => {
    switch (net) {
      case "eth-mainnet": return "https://cloudflare-eth.com";
      case "polygon-mainnet": return "https://polygon-rpc.com";
      case "arb-mainnet": return "https://arb1.arbitrum.io/rpc";
      case "opt-mainnet": return "https://mainnet.optimism.io";
      case "eth-goerli": return "https://rpc.ankr.com/eth_goerli";
      case "eth-sepolia": return "https://rpc.sepolia.org";
      default: return "https://cloudflare-eth.com";
    }
  };

  let apiKey;
  try {
    apiKey = await getAlchemyKey();
  } catch (e) {
    apiKey = null;
  }

  // If endpoint is empty, it's just a standard RPC call masquerading as alchemyApi
  if (!endpoint || endpoint === "") {
    let url = apiKey 
      ? `https://${network}.g.alchemy.com/v2/${apiKey}`
      : getPublicRpcUrl(network);
      
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if ((res.status === 401 || res.status === 403 || res.status === 404) && apiKey) {
          console.warn(`Alchemy API failed (${res.status}). Falling back to public RPC...`);
          _cachedAlchemyKey = undefined;
          url = getPublicRpcUrl(network);
          const fallbackRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          return await fallbackRes.json();
        }
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text.substring(0, 200)}`);
      }
      return await res.json();
    } catch (error) {
       if (apiKey) {
         const urlFallback = getPublicRpcUrl(network);
         const fallbackRes = await fetch(urlFallback, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         });
         return await fallbackRes.json();
       }
       throw error;
    }
  }

  // For real Alchemy enhanced APIs (like alchemy_getTokenBalances)
  if (!apiKey) {
    throw new Error("ALCHEMY_API_KEY not configured. Enchanced APIs require a valid key.");
  }

  const url = `https://${network}.g.alchemy.com/v2/${apiKey}${endpoint ? `/${endpoint}` : ''}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      _cachedAlchemyKey = undefined;
      throw new Error(`Alchemy API 404: API key invalid or network "${network}" not enabled`);
    }
    if (res.status === 401 || res.status === 403) {
      _cachedAlchemyKey = undefined;
      console.error(`❌ ALCHEMY API AUTH ERROR (${res.status}): Key is unauthorized or expired.`);
      throw new Error(`ALCHEMY_KEY_INVALID: Authentication failed (${res.status}). Please update your ALCHEMY_API_KEY.`);
    }
    throw new Error(`Alchemy API error ${res.status}: ${text.substring(0, 200)}`);
  }

  return await res.json();
}

// Diagnostic endpoint: test Alchemy key health
app.get("/make-server-cc38a303/alchemy/test-key", async (c) => {
  try {
    _cachedAlchemyKey = undefined;
    
    const rawEnv = Deno.env.get("ALCHEMY_API_KEY");
    const envInfo = rawEnv ? {
      rawLength: rawEnv.length,
      firstCharCodes: Array.from(rawEnv.slice(0, 6)).map(ch => ch.charCodeAt(0)),
      lastCharCodes: Array.from(rawEnv.slice(-4)).map(ch => ch.charCodeAt(0)),
      hasQuotes: /["']/.test(rawEnv),
      hasWhitespace: /\s/.test(rawEnv),
      hasNonAscii: /[^\x20-\x7E]/.test(rawEnv),
    } : null;
    
    const sanitized = sanitizeApiKey(rawEnv);
    const sanitizedInfo = sanitized ? {
      length: sanitized.length,
      preview: `${sanitized.substring(0, 4)}...${sanitized.substring(sanitized.length - 4)}`,
      allAlphanumeric: /^[a-zA-Z0-9_\-]+$/.test(sanitized),
    } : null;

    let rpcTest: any = null;
    if (sanitized) {
      const testUrl = `https://eth-mainnet.g.alchemy.com/v2/${sanitized}`;
      try {
        const testRes = await fetch(testUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
        });
        const testBody = await testRes.text();
        rpcTest = { httpStatus: testRes.status, ok: testRes.ok, bodyPreview: testBody.substring(0, 200) };
        if (testRes.ok) {
          try {
            const parsed = JSON.parse(testBody);
            if (parsed.result) {
              rpcTest.blockNumber = parseInt(parsed.result, 16);
              rpcTest.success = true;
            } else if (parsed.error) {
              rpcTest.rpcError = parsed.error.message;
            }
          } catch {}
        }
      } catch (e) {
        rpcTest = { error: (e as Error).message };
      }
    }

    return c.json({
      success: true,
      envKeyPresent: !!rawEnv,
      envKeyInfo: envInfo,
      sanitizedKey: sanitizedInfo,
      rpcTest,
      timestamp: Date.now(),
    });
  } catch (error) {
    return c.json({ error: `Key test failed: ${(error as Error).message}` }, 500);
  }
});

// 1. Network Status - block, gas, peers (with auto-fallback)
app.get("/make-server-cc38a303/alchemy/network-status", async (c) => {
  try {
    const network = c.req.query("network") || "eth-mainnet";

    const [blockResult, gasPriceResult, feeHistoryResult, peerCountResult] = await Promise.allSettled([
      alchemyRpc("eth_blockNumber", [], network),
      alchemyRpc("eth_gasPrice", [], network),
      alchemyRpc("eth_feeHistory", ["0x5", "latest", [25, 50, 75]], network),
      alchemyRpc("net_peerCount", [], network),
    ]);

    // If blockNumber failed, the key/connection is bad
    if (blockResult.status === "rejected") {
      console.log("network-status: blockNumber call failed:", blockResult.reason?.message);
      return c.json({ error: `Alchemy connection failed: ${blockResult.reason?.message || "Unknown error"}`, hint: "Check ALCHEMY_API_KEY via /alchemy/test-key endpoint" }, 502);
    }

    const blockHex = blockResult.value;
    const gasPriceHex = gasPriceResult.status === "fulfilled" ? gasPriceResult.value : "0x0";
    const feeHistory = feeHistoryResult.status === "fulfilled" ? feeHistoryResult.value : null;
    const peerCountHex = peerCountResult.status === "fulfilled" ? peerCountResult.value : "0x0";

    const blockNumber = parseInt(blockHex, 16);
    const gasPrice = parseInt(gasPriceHex, 16);
    const gasPriceGwei = gasPrice / 1e9;
    const peerCount = parseInt(peerCountHex, 16);

    // Parse fee history for priority fees
    let baseFee = 0;
    let priorityFees = { slow: 0, standard: 0, fast: 0 };

    if (feeHistory && feeHistory.baseFeePerGas) {
      const lastBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
      baseFee = parseInt(lastBaseFee, 16) / 1e9;

      if (feeHistory.reward && feeHistory.reward.length > 0) {
        const lastReward = feeHistory.reward[feeHistory.reward.length - 1];
        priorityFees = {
          slow: parseInt(lastReward[0], 16) / 1e9,
          standard: parseInt(lastReward[1], 16) / 1e9,
          fast: parseInt(lastReward[2], 16) / 1e9,
        };
      }
    }

    return c.json({
      success: true,
      data: {
        network,
        blockNumber,
        gasPrice: gasPriceGwei,
        baseFee,
        priorityFees,
        peerCount,
        timestamp: Date.now(),
      }
    });
  } catch (error) {
    console.error("Alchemy network-status error:", error);
    return c.json({ error: `Network status failed: ${error.message}` }, 500);
  }
});

// 2. Get latest block details
app.get("/make-server-cc38a303/alchemy/block", async (c) => {
  try {
    const network = c.req.query("network") || "eth-mainnet";
    const blockParam = c.req.query("block") || "latest";

    const block = await alchemyRpc("eth_getBlockByNumber", [blockParam === "latest" ? "latest" : `0x${parseInt(blockParam).toString(16)}`, false], network);

    if (!block) return c.json({ error: "Block not found" }, 404);

    return c.json({
      success: true,
      block: {
        number: parseInt(block.number, 16),
        hash: block.hash,
        parentHash: block.parentHash,
        timestamp: parseInt(block.timestamp, 16),
        gasUsed: parseInt(block.gasUsed, 16),
        gasLimit: parseInt(block.gasLimit, 16),
        baseFeePerGas: block.baseFeePerGas ? parseInt(block.baseFeePerGas, 16) / 1e9 : null,
        transactionCount: block.transactions ? block.transactions.length : 0,
        miner: block.miner,
        size: parseInt(block.size, 16),
      }
    });
  } catch (error) {
    console.error("Alchemy block error:", error);
    return c.json({ error: `Block fetch failed: ${error.message}` }, 500);
  }
});

// 3. Address Inspector - balance, nonce, code check, token balances
app.get("/make-server-cc38a303/alchemy/address/:addr", async (c) => {
  try {
    const addr = c.req.param("addr");
    const network = c.req.query("network") || "eth-mainnet";

    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return c.json({ error: "Invalid Ethereum address" }, 400);
    }

    const [balanceHex, nonceHex, code] = await Promise.all([
      alchemyRpc("eth_getBalance", [addr, "latest"], network),
      alchemyRpc("eth_getTransactionCount", [addr, "latest"], network),
      alchemyRpc("eth_getCode", [addr, "latest"], network),
    ]);

    const balanceWei = BigInt(balanceHex);
    const balanceEth = Number(balanceWei) / 1e18;
    const nonce = parseInt(nonceHex, 16);
    const isContract = code !== "0x";

    // Get token balances via Alchemy Enhanced API
    let tokenBalances: any[] = [];
    try {
      const tokenRes = await alchemyApi("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenBalances",
        params: [addr, "DEFAULT_TOKENS"],
      }, network);
      
      if (tokenRes.result && tokenRes.result.tokenBalances) {
        tokenBalances = tokenRes.result.tokenBalances
          .filter((t: any) => t.tokenBalance && t.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000")
          .map((t: any) => ({
            contractAddress: t.contractAddress,
            balance: t.tokenBalance,
          }));
      }
    } catch (e) {
      // Token balance API may not be available on all networks
      console.log("Token balance fetch skipped:", e);
    }

    // Get token metadata for non-zero balances
    let tokensWithMeta: any[] = [];
    for (const token of tokenBalances.slice(0, 10)) {
      try {
        const metaRes = await alchemyApi("", {
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenMetadata",
          params: [token.contractAddress],
        }, network);
        
        if (metaRes.result) {
          const decimals = metaRes.result.decimals || 18;
          const rawBalance = BigInt(token.balance);
          const formattedBalance = Number(rawBalance) / Math.pow(10, decimals);
          
          tokensWithMeta.push({
            contract: token.contractAddress,
            symbol: metaRes.result.symbol || "???",
            name: metaRes.result.name || "Unknown",
            decimals,
            balance: formattedBalance,
            logo: metaRes.result.logo || null,
          });
        }
      } catch (e) {
        // Skip tokens with metadata errors
      }
    }

    return c.json({
      success: true,
      address: {
        address: addr,
        balanceEth,
        balanceWei: balanceHex,
        nonce,
        txCount: nonce,
        isContract,
        codeSize: isContract ? (code.length - 2) / 2 : 0,
        tokens: tokensWithMeta,
        network,
        timestamp: Date.now(),
      }
    });
  } catch (error) {
    console.error("Alchemy address error:", error);
    return c.json({ error: `Address inspection failed: ${error.message}` }, 500);
  }
});

// 4. Transaction Lookup
app.get("/make-server-cc38a303/alchemy/tx/:hash", async (c) => {
  try {
    const hash = c.req.param("hash");
    const network = c.req.query("network") || "eth-mainnet";

    const [tx, receipt] = await Promise.all([
      alchemyRpc("eth_getTransactionByHash", [hash], network),
      alchemyRpc("eth_getTransactionReceipt", [hash], network).catch(() => null),
    ]);

    if (!tx) return c.json({ error: "Transaction not found" }, 404);

    return c.json({
      success: true,
      transaction: {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseInt(tx.value, 16) / 1e18,
        valueWei: tx.value,
        gasPrice: tx.gasPrice ? parseInt(tx.gasPrice, 16) / 1e9 : null,
        maxFeePerGas: tx.maxFeePerGas ? parseInt(tx.maxFeePerGas, 16) / 1e9 : null,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas ? parseInt(tx.maxPriorityFeePerGas, 16) / 1e9 : null,
        gas: parseInt(tx.gas, 16),
        nonce: parseInt(tx.nonce, 16),
        blockNumber: tx.blockNumber ? parseInt(tx.blockNumber, 16) : null,
        blockHash: tx.blockHash,
        input: tx.input ? tx.input.substring(0, 10) : "0x",
        inputFull: tx.input,
        type: tx.type ? parseInt(tx.type, 16) : 0,
        status: receipt ? (receipt.status === "0x1" ? "success" : "failed") : "pending",
        gasUsed: receipt ? parseInt(receipt.gasUsed, 16) : null,
        effectiveGasPrice: receipt?.effectiveGasPrice ? parseInt(receipt.effectiveGasPrice, 16) / 1e9 : null,
        txFee: receipt ? (parseInt(receipt.gasUsed, 16) * parseInt(receipt.effectiveGasPrice || tx.gasPrice, 16)) / 1e18 : null,
        logs: receipt ? receipt.logs.length : 0,
        contractAddress: receipt?.contractAddress || null,
        network,
        timestamp: Date.now(),
      }
    });
  } catch (error) {
    console.error("Alchemy tx error:", error);
    return c.json({ error: `Transaction lookup failed: ${error.message}` }, 500);
  }
});

// 5. Get recent transfers for address (Alchemy Transfers API)
app.get("/make-server-cc38a303/alchemy/transfers/:addr", async (c) => {
  try {
    const addr = c.req.param("addr");
    const network = c.req.query("network") || "eth-mainnet";
    const direction = c.req.query("direction") || "both";

    const categories = ["external", "erc20", "erc721", "erc1155"];
    
    let transfers: any[] = [];

    if (direction === "from" || direction === "both") {
      const fromRes = await alchemyApi("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [{
          fromAddress: addr,
          category: categories,
          maxCount: "0x14",
          order: "desc",
          withMetadata: true,
        }],
      }, network);

      if (fromRes.result?.transfers) {
        transfers.push(...fromRes.result.transfers.map((t: any) => ({ ...t, direction: "out" })));
      }
    }

    if (direction === "to" || direction === "both") {
      const toRes = await alchemyApi("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [{
          toAddress: addr,
          category: categories,
          maxCount: "0x14",
          order: "desc",
          withMetadata: true,
        }],
      }, network);

      if (toRes.result?.transfers) {
        transfers.push(...toRes.result.transfers.map((t: any) => ({ ...t, direction: "in" })));
      }
    }

    // Sort by block number desc and limit
    transfers.sort((a, b) => {
      const blockA = parseInt(a.blockNum, 16);
      const blockB = parseInt(b.blockNum, 16);
      return blockB - blockA;
    });

    const formatted = transfers.slice(0, 30).map((t: any) => ({
      hash: t.hash,
      from: t.from,
      to: t.to,
      value: t.value,
      asset: t.asset,
      category: t.category,
      direction: t.direction,
      blockNumber: parseInt(t.blockNum, 16),
      timestamp: t.metadata?.blockTimestamp || null,
    }));

    return c.json({ success: true, transfers: formatted, count: formatted.length });
  } catch (error) {
    console.error("Alchemy transfers error:", error);
    return c.json({ error: `Transfers fetch failed: ${error.message}` }, 500);
  }
});

// 6. Multi-chain gas tracker
app.get("/make-server-cc38a303/alchemy/gas-tracker", async (c) => {
  try {
    const networks = [
      { id: "eth-mainnet", name: "Ethereum", symbol: "ETH" },
      { id: "arb-mainnet", name: "Arbitrum", symbol: "ETH" },
      { id: "opt-mainnet", name: "Optimism", symbol: "ETH" },
      { id: "polygon-mainnet", name: "Polygon", symbol: "MATIC" },
      { id: "base-mainnet", name: "Base", symbol: "ETH" },
    ];

    const results = await Promise.all(
      networks.map(async (net) => {
        try {
          const [blockHex, gasPriceHex] = await Promise.all([
            alchemyRpc("eth_blockNumber", [], net.id),
            alchemyRpc("eth_gasPrice", [], net.id),
          ]);
          return {
            ...net,
            blockNumber: parseInt(blockHex, 16),
            gasPrice: parseInt(gasPriceHex, 16) / 1e9,
            status: "online" as const,
          };
        } catch (e) {
          return {
            ...net,
            blockNumber: 0,
            gasPrice: 0,
            status: "error" as const,
            error: (e as Error).message,
          };
        }
      })
    );

    return c.json({ success: true, chains: results, timestamp: Date.now() });
  } catch (error) {
    console.error("Gas tracker error:", error);
    return c.json({ error: `Gas tracker failed: ${error.message}` }, 500);
  }
});

// 7. Verify contract on-chain (check code + basic info)
app.get("/make-server-cc38a303/alchemy/verify-contract/:addr", async (c) => {
  try {
    const addr = c.req.param("addr");
    const network = c.req.query("network") || "eth-mainnet";

    const code = await alchemyRpc("eth_getCode", [addr, "latest"], network);
    const isContract = code !== "0x";

    if (!isContract) {
      return c.json({ success: true, isContract: false, message: "Address is an EOA (not a contract)" });
    }

    // Try to get token metadata
    let tokenMeta = null;
    try {
      const metaRes = await alchemyApi("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenMetadata",
        params: [addr],
      }, network);
      if (metaRes.result?.name) {
        tokenMeta = metaRes.result;
      }
    } catch (e) { /* not a token contract */ }

    return c.json({
      success: true,
      isContract: true,
      codeSize: (code.length - 2) / 2,
      token: tokenMeta ? {
        name: tokenMeta.name,
        symbol: tokenMeta.symbol,
        decimals: tokenMeta.decimals,
        totalSupply: tokenMeta.totalSupply,
        logo: tokenMeta.logo,
      } : null,
      network,
    });
  } catch (error) {
    console.error("Verify contract error:", error);
    return c.json({ error: `Contract verification failed: ${error.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════
// CONTRACT TRACKING — LIVE ON-CHAIN
// ═══════════════════════════════════════════════

// 8. Register a watched contract for on-chain tracking
app.post("/make-server-cc38a303/contracts/watch", async (c) => {
  try {
    const { address, name, symbol, type, network } = await c.req.json();
    if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return c.json({ error: "Valid contract address required" }, 400);
    }

    const watchId = `watch:${address.toLowerCase()}`;
    const existing = await kv.get(watchId);

    const watchData = {
      address: address.toLowerCase(),
      name: name || existing?.value?.name || "Unknown",
      symbol: symbol || existing?.value?.symbol || "???",
      type: type || existing?.value?.type || "ERC-3643",
      network: network || existing?.value?.network || "eth-mainnet",
      addedAt: existing?.value?.addedAt || Date.now(),
      updatedAt: Date.now(),
      lastOnchainCheck: null as number | null,
      onchainData: existing?.value?.onchainData || null,
    };

    await kv.set(watchId, watchData);
    return c.json({ success: true, message: `Contract ${address} now tracked`, watch: watchData });
  } catch (error) {
    console.error("Watch contract error:", error);
    return c.json({ error: `Failed to watch contract: ${(error as Error).message}` }, 500);
  }
});

// 9. Remove a watched contract
app.post("/make-server-cc38a303/contracts/unwatch", async (c) => {
  try {
    const { address } = await c.req.json();
    if (!address) return c.json({ error: "Address required" }, 400);
    await kv.del(`watch:${address.toLowerCase()}`);
    return c.json({ success: true, message: `Contract ${address} unwatched` });
  } catch (error) {
    return c.json({ error: "Failed to unwatch contract" }, 500);
  }
});

// 10. Auto-sync: push all KV contracts to watch list
app.post("/make-server-cc38a303/contracts/sync-from-kv", async (c) => {
  try {
    const contracts = await kv.getByPrefix("contract:");
    let synced = 0;

    for (const ctr of contracts) {
      const val = ctr.value;
      if (!val?.address || !/^0x[a-fA-F0-9]{40}$/i.test(val.address)) continue;

      const watchId = `watch:${val.address.toLowerCase()}`;
      const existing = await kv.get(watchId);
      if (existing?.value) continue;

      await kv.set(watchId, {
        address: val.address.toLowerCase(),
        name: val.name || "Unknown",
        symbol: val.symbol || "???",
        type: val.type || "ERC-3643",
        network: val.network || "eth-mainnet",
        addedAt: val.deployedAt || Date.now(),
        updatedAt: Date.now(),
        lastOnchainCheck: null,
        onchainData: null,
        kvContractId: ctr.key,
      });
      synced++;
    }

    return c.json({ success: true, message: `${synced} contracts synced to watchlist`, total: contracts.length });
  } catch (error) {
    console.error("Sync contracts error:", error);
    return c.json({ error: `Sync failed: ${error.message}` }, 500);
  }
});

// Helper: normalize network name to Alchemy format
function toAlchemyNet(net: string): string {
  if (net.includes("sepolia")) return "eth-sepolia";
  if (net.includes("eth") || net.includes("ethereum")) return "eth-mainnet";
  if (net.includes("arb")) return "arb-mainnet";
  if (net.includes("opt")) return "opt-mainnet";
  if (net.includes("polygon") || net.includes("matic")) return "polygon-mainnet";
  if (net.includes("base")) return "base-mainnet";
  return "eth-mainnet";
}

// 11. Get all watched contracts with live on-chain data
app.get("/make-server-cc38a303/contracts/tracked", async (c) => {
  try {
    const refresh = c.req.query("refresh") === "true";
    const watched = await kv.getByPrefix("watch:");

    if (watched.length === 0) {
      return c.json({ success: true, contracts: [], count: 0 });
    }

    const results = [];

    for (const w of watched) {
      const contract = w.value;
      if (!contract?.address) continue;

      const needsRefresh = refresh || !contract.lastOnchainCheck ||
        (Date.now() - contract.lastOnchainCheck > 30000);

      let onchainData = contract.onchainData || {};

      if (needsRefresh) {
        const alchemyNet = toAlchemyNet(contract.network || "eth-mainnet");

        try {
          const code = await alchemyRpc("eth_getCode", [contract.address, "latest"], alchemyNet);
          const exists = code !== "0x";

          const balHex = await alchemyRpc("eth_getBalance", [contract.address, "latest"], alchemyNet);
          const balanceEth = Number(BigInt(balHex)) / 1e18;

          let tokenMeta = null;
          if (exists) {
            try {
              const metaRes = await alchemyApi("", {
                jsonrpc: "2.0", id: 1,
                method: "alchemy_getTokenMetadata",
                params: [contract.address],
              }, alchemyNet);
              if (metaRes.result?.name) {
                tokenMeta = {
                  name: metaRes.result.name,
                  symbol: metaRes.result.symbol,
                  decimals: metaRes.result.decimals,
                  totalSupply: metaRes.result.totalSupply,
                  logo: metaRes.result.logo,
                };
              }
            } catch (_) {}
          }

          let recentTransfers: any[] = [];
          if (exists) {
            try {
              const [fromRes, toRes] = await Promise.all([
                alchemyApi("", {
                  jsonrpc: "2.0", id: 1,
                  method: "alchemy_getAssetTransfers",
                  params: [{ fromAddress: contract.address, category: ["external", "erc20"], maxCount: "0x5", order: "desc", withMetadata: true }],
                }, alchemyNet),
                alchemyApi("", {
                  jsonrpc: "2.0", id: 1,
                  method: "alchemy_getAssetTransfers",
                  params: [{ toAddress: contract.address, category: ["external", "erc20"], maxCount: "0x5", order: "desc", withMetadata: true }],
                }, alchemyNet),
              ]);

              const allTx = [
                ...(fromRes.result?.transfers || []).map((t: any) => ({ ...t, dir: "out" })),
                ...(toRes.result?.transfers || []).map((t: any) => ({ ...t, dir: "in" })),
              ];
              allTx.sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16));

              recentTransfers = allTx.slice(0, 8).map((t: any) => ({
                hash: t.hash, from: t.from, to: t.to, value: t.value,
                asset: t.asset, category: t.category, direction: t.dir,
                blockNumber: parseInt(t.blockNum, 16),
                timestamp: t.metadata?.blockTimestamp || null,
              }));
            } catch (_) {}
          }

          let logCount = 0;
          if (exists) {
            try {
              const blockHex = await alchemyRpc("eth_blockNumber", [], alchemyNet);
              const currentBlock = parseInt(blockHex, 16);
              const fromBlock = `0x${Math.max(0, currentBlock - 1000).toString(16)}`;
              const logs = await alchemyRpc("eth_getLogs", [{
                address: contract.address, fromBlock, toBlock: "latest",
              }], alchemyNet);
              logCount = Array.isArray(logs) ? logs.length : 0;
            } catch (_) {}
          }

          onchainData = { exists, balanceEth, codeSize: exists ? (code.length - 2) / 2 : 0, tokenMeta, recentTransfers, logCount, checkedAt: Date.now() };

          contract.onchainData = onchainData;
          contract.lastOnchainCheck = Date.now();
          contract.updatedAt = Date.now();
          await kv.set(w.key, contract);
        } catch (err) {
          onchainData = { ...onchainData, error: (err as Error).message, checkedAt: Date.now() };
        }
      }

      results.push({
        address: contract.address, name: contract.name, symbol: contract.symbol,
        type: contract.type, network: contract.network, addedAt: contract.addedAt,
        kvContractId: contract.kvContractId || null, onchain: onchainData,
      });
    }

    return c.json({ success: true, contracts: results, count: results.length, timestamp: Date.now() });
  } catch (error) {
    console.error("Tracked contracts error:", error);
    return c.json({ error: `Failed to get tracked contracts: ${error.message}` }, 500);
  }
});

// 12. Get detailed on-chain event log for a specific contract
app.get("/make-server-cc38a303/contracts/events/:addr", async (c) => {
  try {
    const addr = c.req.param("addr");
    const network = c.req.query("network") || "eth-mainnet";
    const blocksBack = parseInt(c.req.query("blocks") || "2000");

    if (!/^0x[a-fA-F0-9]{40}$/i.test(addr)) {
      return c.json({ error: "Invalid address" }, 400);
    }

    const alchemyNet = toAlchemyNet(network);
    const blockHex = await alchemyRpc("eth_blockNumber", [], alchemyNet);
    const currentBlock = parseInt(blockHex, 16);
    const fromBlock = `0x${Math.max(0, currentBlock - blocksBack).toString(16)}`;

    const logs = await alchemyRpc("eth_getLogs", [{
      address: addr, fromBlock, toBlock: "latest",
    }], alchemyNet);

    const SIGS: Record<string, string> = {
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": "Transfer",
      "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": "Approval",
      "0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258": "Paused",
      "0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa": "Unpaused",
      "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31": "ApprovalForAll",
      "0x4e3883c75cc9c47e46f0845e3ea53c79b1665b7d3263b8e19aa82edc4562f90c": "IdentityRegistered",
    };

    const parsedLogs = (Array.isArray(logs) ? logs : []).slice(-50).map((log: any) => {
      const topic0 = log.topics?.[0] || "";
      return {
        blockNumber: parseInt(log.blockNumber, 16),
        txHash: log.transactionHash,
        logIndex: parseInt(log.logIndex, 16),
        event: SIGS[topic0] || topic0.slice(0, 10),
        topic0, data: log.data?.substring(0, 66) || "0x",
        removed: log.removed || false,
      };
    });

    const eventCounts: Record<string, number> = {};
    for (const log of parsedLogs) {
      eventCounts[log.event] = (eventCounts[log.event] || 0) + 1;
    }

    return c.json({
      success: true, address: addr, network: alchemyNet, blocksScanned: blocksBack,
      currentBlock, totalEvents: parsedLogs.length, eventSummary: eventCounts,
      events: parsedLogs.reverse(), timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Contract events error:", error);
    return c.json({ error: `Events fetch failed: ${error.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════
// PRODUCTION STATUS — COMPREHENSIVE SYSTEM CHECK
// ═══════════════════════════════════════════════

app.get("/make-server-cc38a303/god-mode/production-status", async (c) => {
  const results: Record<string, any> = {};
  const t0 = Date.now();

  // 1. Server
  results.server = { status: "online", timestamp: t0 };

  // 2. API Keys
  try {
    const alchemyEnv = !!Deno.env.get("ALCHEMY_API_KEY");
    const infuraEnv = !!Deno.env.get("INFURA_API_KEY");
    const alchemyKv = !!(await kv.get("alchemy_api_key"))?.value;
    const infuraKv = !!(await kv.get("infura_api_key"))?.value;
    results.apiKeys = {
      alchemy: { configured: alchemyEnv || alchemyKv, source: alchemyEnv ? "env" : alchemyKv ? "kv" : "none" },
      infura: { configured: infuraEnv || infuraKv, source: infuraEnv ? "env" : infuraKv ? "kv" : "none" },
    };
  } catch (e) {
    results.apiKeys = { error: (e as Error).message };
  }

  // 3. KV Store
  try {
    const testKey = `__prod_check_${t0}`;
    await kv.set(testKey, { ok: true });
    const read = await kv.get(testKey);
    await kv.del(testKey);
    results.kvStore = { status: "operational", readWrite: !!read?.value?.ok };
  } catch (e) {
    results.kvStore = { status: "error", error: (e as Error).message };
  }

  // 4. Alchemy RPC (mainnet + sepolia)
  const alchemyKey = await getAlchemyKey();
  if (alchemyKey) {
    const chains = ["eth-mainnet", "eth-sepolia", "arb-mainnet", "polygon-mainnet", "opt-mainnet", "base-mainnet"];
    results.alchemyChains = {};
    for (const chain of chains) {
      try {
        const blockHex = await alchemyRpc("eth_blockNumber", [], chain);
        const block = parseInt(blockHex, 16);
        results.alchemyChains[chain] = { status: "online", blockNumber: block };
      } catch (e) {
        results.alchemyChains[chain] = { status: "error", error: (e as Error).message };
      }
    }
  } else {
    results.alchemyChains = { status: "no_key" };
  }

  // 5. Watched contracts
  try {
    const watched = await kv.getByPrefix("watch:");
    results.contractTracking = {
      totalWatched: watched.length,
      networks: [...new Set(watched.map((w: any) => w.value?.network).filter(Boolean))],
    };
  } catch (e) {
    results.contractTracking = { error: (e as Error).message };
  }

  // 6. KYC entries
  try {
    const kycs = await kv.getByPrefix("kyc:");
    results.kyc = { totalEntries: kycs.length };
  } catch (e) {
    results.kyc = { error: (e as Error).message };
  }

  // 7. Kill switch
  try {
    const ks = await kv.get("system:kill_switch");
    results.killSwitch = { enabled: ks?.value?.enabled || false };
  } catch (e) {
    results.killSwitch = { error: (e as Error).message };
  }

  // 8. Supabase Auth
  try {
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1 });
    results.supabaseAuth = { status: error ? "error" : "operational", usersFound: data?.users?.length || 0, error: error?.message };
  } catch (e) {
    results.supabaseAuth = { status: "error", error: (e as Error).message };
  }

  const elapsed = Date.now() - t0;

  return c.json({
    success: true,
    production: true,
    mode: "PRODUCTION",
    version: "THESORIA v4.0",
    checkDuration: `${elapsed}ms`,
    timestamp: t0,
    results,
  });
});

// --- PROFIT MANAGEMENT ENDPOINTS ---

// Get profit balance for an address
app.get("/make-server-cc38a303/profit/balance/:address", async (c) => {
  try {
    const address = c.req.param("address");
    
    if (!address) {
      return c.json({ error: "Address required" }, 400);
    }

    // Get profit balance from KV store
    const profitKey = `profit:balance:${address.toLowerCase()}`;
    const profitData = await kv.get(profitKey);
    
    const balance = profitData?.value || {
      total: 0,
      available: 0,
      pending: 0,
      withdrawn: 0
    };

    // If no balance exists, initialize with demo data for testing
    if (!profitData?.value) {
      const demoBalance = {
        total: 2.5847,
        available: 1.8234,
        pending: 0.4321,
        withdrawn: 0.3292
      };
      await kv.set(profitKey, demoBalance);
      
      console.log(`Profit balance initialized for ${address}: ${JSON.stringify(demoBalance)}`);
      return c.json({ success: true, balance: demoBalance });
    }

    console.log(`Profit balance retrieved for ${address}: ${JSON.stringify(balance)}`);
    return c.json({ success: true, balance });
  } catch (error) {
    console.error("Error getting profit balance:", error);
    return c.json({ error: `Failed to get profit balance: ${error.message}` }, 500);
  }
});

// Get transfer history for an address
app.get("/make-server-cc38a303/profit/history/:address", async (c) => {
  try {
    const address = c.req.param("address");
    
    if (!address) {
      return c.json({ error: "Address required" }, 400);
    }

    // Get transfer history from KV store
    const historyKey = `profit:history:${address.toLowerCase()}`;
    const historyData = await kv.get(historyKey);
    
    const history = historyData?.value || [];

    // If no history exists, initialize with demo data for testing
    if (!historyData?.value || history.length === 0) {
      const demoHistory = [
        {
          id: `tx-${Date.now()}-1`,
          amount: 0.5,
          to: address,
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
          status: 'completed',
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          type: 'profit_withdrawal'
        },
        {
          id: `tx-${Date.now()}-2`,
          amount: 0.25,
          to: address,
          timestamp: Date.now() - 86400000 * 5, // 5 days ago
          status: 'completed',
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          type: 'profit_withdrawal'
        },
        {
          id: `tx-${Date.now()}-3`,
          amount: 0.15,
          to: address,
          timestamp: Date.now() - 86400000 * 10, // 10 days ago
          status: 'completed',
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          type: 'profit_withdrawal'
        }
      ];
      await kv.set(historyKey, demoHistory);
      
      console.log(`Transfer history initialized for ${address} with ${demoHistory.length} transactions`);
      return c.json({ success: true, history: demoHistory });
    }

    console.log(`Transfer history retrieved for ${address}: ${history.length} transactions`);
    return c.json({ success: true, history });
  } catch (error) {
    console.error("Error getting transfer history:", error);
    return c.json({ error: `Failed to get transfer history: ${error.message}` }, 500);
  }
});

// Transfer profits to wallet
app.post("/make-server-cc38a303/profit/transfer", async (c) => {
  try {
    const { from, to, amount } = await c.req.json();
    
    if (!from || !to || !amount) {
      return c.json({ error: "from, to, and amount are required" }, 400);
    }

    if (amount <= 0) {
      return c.json({ error: "Amount must be greater than 0" }, 400);
    }

    const fromAddress = from.toLowerCase();
    const toAddress = to.toLowerCase();

    // Get current balance
    const profitKey = `profit:balance:${fromAddress}`;
    const profitData = await kv.get(profitKey);
    
    let balance;
    
    if (!profitData?.value) {
      // Initialize with demo data if not exists
      console.log(`Initializing profit balance for ${fromAddress} during transfer`);
      balance = {
        total: 2.5847,
        available: 1.8234,
        pending: 0.4321,
        withdrawn: 0.3292
      };
      await kv.set(profitKey, balance);
    } else {
      balance = profitData.value;
    }

    // Check if sufficient balance
    if (amount > balance.available) {
      return c.json({ 
        error: "Insufficient available balance",
        available: balance.available,
        requested: amount
      }, 400);
    }

    // Update balance
    balance.available -= amount;
    balance.pending += amount;
    await kv.set(profitKey, balance);

    // Create transfer record
    const txHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    const transfer = {
      id: `tx-${Date.now()}`,
      amount,
      from: fromAddress,
      to: toAddress,
      timestamp: Date.now(),
      status: 'pending',
      txHash,
      type: 'profit_withdrawal'
    };

    // Add to history
    const historyKey = `profit:history:${fromAddress}`;
    const historyData = await kv.get(historyKey);
    const history = historyData?.value || [];
    history.unshift(transfer); // Add to beginning
    await kv.set(historyKey, history);

    // Simulate blockchain confirmation (in production, this would be a real transaction)
    setTimeout(async () => {
      try {
        // Update transfer status to completed
        transfer.status = 'completed';
        const updatedHistory = await kv.get(historyKey);
        if (updatedHistory?.value) {
          const historyArray = updatedHistory.value;
          const index = historyArray.findIndex((t: any) => t.id === transfer.id);
          if (index !== -1) {
            historyArray[index].status = 'completed';
            await kv.set(historyKey, historyArray);
          }
        }

        // Update balance: move from pending to withdrawn
        const currentBalance = await kv.get(profitKey);
        if (currentBalance?.value) {
          currentBalance.value.pending -= amount;
          currentBalance.value.withdrawn += amount;
          await kv.set(profitKey, currentBalance.value);
        }

        console.log(`Transfer completed: ${amount} ETH from ${fromAddress} to ${toAddress} - ${txHash}`);
      } catch (err) {
        console.error("Error completing transfer:", err);
      }
    }, 5000); // Simulate 5 second confirmation

    console.log(`Transfer initiated: ${amount} ETH from ${fromAddress} to ${toAddress} - ${txHash}`);
    
    return c.json({
      success: true,
      message: "Transfer initiated successfully",
      transfer,
      txHash,
      newBalance: {
        available: balance.available,
        pending: balance.pending
      }
    });
  } catch (error) {
    console.error("Error processing transfer:", error);
    return c.json({ error: `Failed to process transfer: ${error.message}` }, 500);
  }
});

// Add profit (for admin/system use)
app.post("/make-server-cc38a303/profit/add", async (c) => {
  try {
    const { address, amount, source } = await c.req.json();
    
    if (!address || !amount) {
      return c.json({ error: "address and amount are required" }, 400);
    }

    if (amount <= 0) {
      return c.json({ error: "Amount must be greater than 0" }, 400);
    }

    const addressLower = address.toLowerCase();
    const profitKey = `profit:balance:${addressLower}`;
    const profitData = await kv.get(profitKey);
    
    const balance = profitData?.value || {
      total: 0,
      available: 0,
      pending: 0,
      withdrawn: 0
    };

    // Add to balance
    balance.total += amount;
    balance.available += amount;
    await kv.set(profitKey, balance);

    // Log activity
    const activityKey = `activity:${Date.now()}:profit_added`;
    await kv.set(activityKey, {
      type: "profit_added",
      address: addressLower,
      amount,
      source: source || "system",
      timestamp: Date.now(),
      newBalance: balance
    });

    console.log(`Profit added: ${amount} ETH to ${addressLower} from ${source || 'system'}`);
    
    return c.json({
      success: true,
      message: "Profit added successfully",
      newBalance: balance
    });
  } catch (error) {
    console.error("Error adding profit:", error);
    return c.json({ error: `Failed to add profit: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
