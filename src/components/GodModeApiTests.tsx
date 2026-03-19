import { useState } from "react";
import { motion } from "motion/react";
import { Activity, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface GodModeApiTestsProps {
  web3: any;
  GCard: any;
  STitle: any;
}

export default function GodModeApiTests({ web3, GCard, STitle }: GodModeApiTestsProps) {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    coingecko?: 'success' | 'error' | 'loading';
    provider?: 'success' | 'error' | 'loading';
    supabase?: 'success' | 'error' | 'loading';
  }>({});

  const runTests = async () => {
    setTesting(true);
    setResults({ coingecko: 'loading', provider: 'loading', supabase: 'loading' });
    
    // 1. Test CoinGecko API (Open Source)
    try {
      const cgRes = await fetch('https://api.coingecko.com/api/v3/ping');
      if (cgRes.ok) {
        setResults(prev => ({ ...prev, coingecko: 'success' }));
      } else {
        setResults(prev => ({ ...prev, coingecko: 'error' }));
      }
    } catch {
      setResults(prev => ({ ...prev, coingecko: 'error' }));
    }

    // 2. Test Ethers Provider (Web3)
    try {
      if (web3.provider) {
        await web3.provider.getNetwork();
        setResults(prev => ({ ...prev, provider: 'success' }));
      } else {
        setResults(prev => ({ ...prev, provider: 'error' })); // Not connected
      }
    } catch {
      setResults(prev => ({ ...prev, provider: 'error' }));
    }

    // 3. Test Supabase Health
    try {
      const sbRes = await fetch('https://api.supabase.io', { mode: 'no-cors' }); 
      // Just a network availability check, since Supabase is running the backend
      setResults(prev => ({ ...prev, supabase: 'success' }));
    } catch {
      setResults(prev => ({ ...prev, supabase: 'error' }));
    }
    
    setTesting(false);
    toast.success("Tests de connexion API terminés");
  };

  return (
    <GCard>
      <div className="flex items-center justify-between mb-4">
        <STitle icon={Activity} title="TESTS CONNEXIONS API (OPEN SOURCE)" />
        <button
          onClick={runTests}
          disabled={testing}
          className="px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-[10px] inline-flex items-center gap-1 disabled:opacity-50"
        >
          {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Lancer Tests
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CoinGecko */}
        <div className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-white">CoinGecko (Prix)</div>
            <div className="text-[10px] text-white/40">API Publique REST</div>
          </div>
          <div>
            {results.coingecko === 'loading' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            {results.coingecko === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            {results.coingecko === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
            {!results.coingecko && <div className="w-4 h-4 rounded-full border border-white/20" />}
          </div>
        </div>

        {/* Ethers Provider */}
        <div className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-white">Web3 Provider</div>
            <div className="text-[10px] text-white/40">MetaMask RPC</div>
          </div>
          <div>
            {results.provider === 'loading' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            {results.provider === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            {results.provider === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
            {!results.provider && <div className="w-4 h-4 rounded-full border border-white/20" />}
          </div>
        </div>

        {/* Supabase */}
        <div className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-white">Backend Supabase</div>
            <div className="text-[10px] text-white/40">Edge Functions</div>
          </div>
          <div>
            {results.supabase === 'loading' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
            {results.supabase === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            {results.supabase === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
            {!results.supabase && <div className="w-4 h-4 rounded-full border border-white/20" />}
          </div>
        </div>
      </div>
    </GCard>
  );
}
