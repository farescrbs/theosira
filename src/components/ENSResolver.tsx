/**
 * ENS Resolver - Résolution noms .eth <-> adresses
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Globe, Search, Loader2, ArrowRightLeft, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ENSResolverProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

export default function ENSResolver({ web3, fmtAddr, GCard, STitle }: ENSResolverProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'name-to-address' | 'address-to-name'>('name-to-address');

  const resolve = async () => {
    if (!input.trim()) {
      toast.error("Veuillez entrer un nom ENS ou une adresse");
      return;
    }

    if (!web3.provider) {
      toast.error("Connectez votre wallet d'abord");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'name-to-address') {
        // Resolve name to address
        const address = await web3.provider.resolveName(input);
        
        if (!address) {
          toast.error(`Nom ENS "${input}" introuvable`);
          setResult(null);
          return;
        }

        // Get avatar if available
        let avatar = null;
        try {
          const resolver = await web3.provider.getResolver(input);
          avatar = await resolver?.getAvatar();
        } catch (e) {
          console.log('No avatar found');
        }

        setResult({
          type: 'address',
          ensName: input,
          address,
          avatar,
        });

        toast.success(`✓ ${input} → ${address.substring(0, 10)}...`);
      } else {
        // Reverse lookup: address to name
        const ensName = await web3.provider.lookupAddress(input);
        
        if (!ensName) {
          toast.warning(`Aucun nom ENS trouvé pour ${input.substring(0, 10)}...`);
          setResult(null);
          return;
        }

        // Get avatar
        let avatar = null;
        try {
          const resolver = await web3.provider.getResolver(ensName);
          avatar = await resolver?.getAvatar();
        } catch (e) {
          console.log('No avatar found');
        }

        setResult({
          type: 'name',
          address: input,
          ensName,
          avatar,
        });

        toast.success(`✓ ${input.substring(0, 10)}... → ${ensName}`);
      }
    } catch (error: any) {
      console.error('❌ Erreur résolution ENS:', error);
      toast.error(error.message || "Erreur lors de la résolution");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'name-to-address' ? 'address-to-name' : 'name-to-address');
    setInput("");
    setResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié!");
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={Globe} title="ENS RESOLVER" />
      
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-2">
          <Globe className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-200">
            <p className="font-semibold mb-1">Ethereum Name Service</p>
            <p className="text-blue-300/70">
              Résolvez les noms .eth en adresses et vice-versa.
              Compatible avec les avatars NFT.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('name-to-address')}
            className={`flex-1 px-3 py-2 rounded-sm text-xs transition-all ${
              mode === 'name-to-address'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-black/30 border border-white/10 text-white/70 hover:border-white/20'
            }`}
          >
            📛 Nom → Adresse
          </button>
          <button
            onClick={switchMode}
            className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={() => setMode('address-to-name')}
            className={`flex-1 px-3 py-2 rounded-sm text-xs transition-all ${
              mode === 'address-to-name'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-black/30 border border-white/10 text-white/70 hover:border-white/20'
            }`}
          >
            📍 Adresse → Nom
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            {mode === 'name-to-address' ? 'NOM ENS' : 'ADRESSE ETHEREUM'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={mode === 'name-to-address' ? 'vitalik.eth' : '0x...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && resolve()}
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-blue-500/50 font-mono"
            />
            <button
              onClick={resolve}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm hover:bg-blue-500/30 transition-all text-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Résoudre
            </button>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setMode('name-to-address');
              setInput('vitalik.eth');
            }}
            className="px-2 py-1 bg-white/5 text-white/50 border border-white/10 rounded text-[10px] hover:bg-white/10 transition-all"
          >
            vitalik.eth
          </button>
          <button
            onClick={() => {
              setMode('name-to-address');
              setInput('brantly.eth');
            }}
            className="px-2 py-1 bg-white/5 text-white/50 border border-white/10 rounded text-[10px] hover:bg-white/10 transition-all"
          >
            brantly.eth
          </button>
          <button
            onClick={() => {
              setMode('name-to-address');
              setInput('nick.eth');
            }}
            className="px-2 py-1 bg-white/5 text-white/50 border border-white/10 rounded text-[10px] hover:bg-white/10 transition-all"
          >
            nick.eth
          </button>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-green-400">RÉSOLUTION RÉUSSIE</span>
            </div>

            <div className="flex items-start gap-4">
              {/* Avatar */}
              {result.avatar && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                  <img 
                    src={result.avatar.url} 
                    alt="ENS Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <div className="text-[10px] text-white/40 mb-1">NOM ENS</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-semibold">
                      {result.ensName}
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.ensName)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Copy className="w-3 h-3 text-white/50" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-white/40 mb-1">ADRESSE</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-white font-mono bg-black/30 px-2 py-1 rounded">
                      {fmtAddr(result.address)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.address)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Copy className="w-3 h-3 text-white/50" />
                    </button>
                  </div>
                </div>

                {result.avatar && (
                  <div>
                    <div className="text-[10px] text-white/40 mb-1">AVATAR NFT</div>
                    <div className="text-xs text-green-400">
                      ✓ Avatar configuré
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 pt-3 border-t border-green-500/20 flex gap-2">
              <a
                href={`https://app.ens.domains/name/${result.ensName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-sm hover:bg-green-500/30 transition-all text-xs text-center"
              >
                Voir sur ENS App ↗
              </a>
              <a
                href={`https://etherscan.io/address/${result.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-sm hover:bg-blue-500/30 transition-all text-xs text-center"
              >
                Etherscan ↗
              </a>
            </div>
          </motion.div>
        )}

        {/* Note */}
        <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <p className="text-[9px] text-blue-300 leading-relaxed">
            <strong>💡 Info:</strong> ENS fonctionne uniquement sur Ethereum Mainnet.
            Les noms .eth peuvent avoir des sous-domaines (ex: wallet.vitalik.eth).
          </p>
        </div>
      </div>
    </GCard>
  );
}
