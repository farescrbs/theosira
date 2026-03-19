import { useState } from "react";
import { motion } from "motion/react";
import { 
  Wallet, 
  Key, 
  Copy, 
  Download, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  Unlock,
  FileKey,
  Globe
} from "lucide-react";
import { ethers } from "ethers";
import { toast } from "sonner";

interface Chain {
  name: string;
  symbol: string;
  icon: string;
  color: string;
}

const SUPPORTED_CHAINS: Chain[] = [
  { name: "Ethereum", symbol: "ETH", icon: "⟠", color: "#627EEA" },
  { name: "Polygon", symbol: "MATIC", icon: "◆", color: "#8247E5" },
  { name: "Arbitrum", symbol: "ARB", icon: "◇", color: "#28A0F0" },
  { name: "Optimism", symbol: "OP", icon: "○", color: "#FF0420" },
  { name: "Base", symbol: "BASE", icon: "◎", color: "#0052FF" },
  { name: "BNB Chain", symbol: "BNB", icon: "◈", color: "#F3BA2F" },
  { name: "Avalanche", symbol: "AVAX", icon: "▲", color: "#E84142" },
  { name: "Fantom", symbol: "FTM", icon: "◪", color: "#1969FF" },
];

export default function WalletCreationPage() {
  const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChains, setSelectedChains] = useState<string[]>(["Ethereum"]);
  const [walletName, setWalletName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Générer un nouveau wallet
  const generateWallet = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        // Créer un wallet aléatoire avec mnémonique
        const newWallet = ethers.Wallet.createRandom();
        const mnemonicPhrase = newWallet.mnemonic?.phrase || "";
        
        setWallet(newWallet);
        setMnemonic(mnemonicPhrase);
        setIsGenerating(false);
        
        toast.success("Wallet créé avec succès!", {
          description: "Sauvegardez votre phrase de récupération en lieu sûr",
          icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
        });
      } catch (error) {
        console.error("Erreur génération wallet:", error);
        toast.error("Erreur lors de la création du wallet");
        setIsGenerating(false);
      }
    }, 1500);
  };

  // Copier dans le presse-papier
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié!`, {
      icon: <Copy className="w-4 h-4" />,
    });
  };

  // Télécharger le wallet (format JSON)
  const downloadWallet = async () => {
    if (!wallet || !password) {
      toast.error("Veuillez définir un mot de passe");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // Chiffrer le wallet avec le mot de passe
      const encryptedJson = await wallet.encrypt(password);
      
      const blob = new Blob([encryptedJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thesoria-wallet-${walletName || wallet.address.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Wallet téléchargé!", {
        description: "Conservez ce fichier en lieu sûr",
        icon: <Download className="w-5 h-5 text-green-400" />,
      });
    } catch (error) {
      console.error("Erreur téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  // Toggle chain selection
  const toggleChain = (chainName: string) => {
    setSelectedChains(prev => 
      prev.includes(chainName) 
        ? prev.filter(c => c !== chainName)
        : [...prev, chainName]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-2xl backdrop-blur-xl border border-yellow-400/30">
              <Wallet className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Création Wallet Interchaine
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Générez votre wallet sécurisé compatible avec toutes les blockchains EVM
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Wallet Generation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Wallet Name */}
            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nom du Wallet (optionnel)
              </label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="Mon Wallet Principal"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              />
            </div>

            {/* Chain Selection */}
            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Blockchains Supportées</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SUPPORTED_CHAINS.map((chain) => (
                  <button
                    key={chain.name}
                    onClick={() => toggleChain(chain.name)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedChains.includes(chain.name)
                        ? "bg-white/10 border-yellow-400/50 shadow-lg shadow-yellow-400/20"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{chain.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">{chain.name}</div>
                        <div className="text-xs text-slate-400">{chain.symbol}</div>
                      </div>
                      {selectedChains.includes(chain.name) && (
                        <CheckCircle2 className="w-4 h-4 text-yellow-400 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {!wallet && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateWallet}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-semibold text-lg shadow-lg shadow-yellow-400/50 hover:shadow-yellow-400/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer un Nouveau Wallet
                  </>
                )}
              </motion.button>
            )}

            {/* Security Warning */}
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-200">
                  <p className="font-semibold mb-1">Avertissement de sécurité</p>
                  <ul className="space-y-1 text-red-300/80">
                    <li>• Sauvegardez votre phrase de récupération hors ligne</li>
                    <li>• Ne partagez JAMAIS votre clé privée</li>
                    <li>• Conservez plusieurs copies en lieu sûr</li>
                    <li>• Utilisez un mot de passe fort pour le keystore</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Wallet Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {wallet ? (
              <>
                {/* Address */}
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-400/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Adresse Publique</h3>
                  </div>
                  <div className="p-4 bg-black/30 rounded-xl break-all font-mono text-sm text-green-300 mb-3">
                    {wallet.address}
                  </div>
                  <button
                    onClick={() => copyToClipboard(wallet.address, "Adresse")}
                    className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier l'adresse
                  </button>
                </div>

                {/* Private Key */}
                <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-red-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">Clé Privée</h3>
                    </div>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {showPrivateKey ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 bg-black/30 rounded-xl break-all font-mono text-sm text-red-300 mb-3">
                    {showPrivateKey ? wallet.privateKey : "••••••••••••••••••••••••••••••••"}
                  </div>
                  <button
                    onClick={() => copyToClipboard(wallet.privateKey, "Clé privée")}
                    className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier la clé privée
                  </button>
                </div>

                {/* Mnemonic */}
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileKey className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Phrase de Récupération</h3>
                    </div>
                    <button
                      onClick={() => setShowMnemonic(!showMnemonic)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {showMnemonic ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 bg-black/30 rounded-xl mb-3">
                    {showMnemonic ? (
                      <div className="grid grid-cols-3 gap-2">
                        {mnemonic.split(" ").map((word, index) => (
                          <div key={index} className="p-2 bg-white/5 rounded-lg">
                            <span className="text-xs text-slate-500 mr-1">{index + 1}.</span>
                            <span className="text-sm text-purple-300 font-mono">{word}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-2xl tracking-wider text-purple-300/50">
                        •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(mnemonic, "Phrase de récupération")}
                    className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier la phrase
                  </button>
                </div>

                {/* Download Encrypted Wallet */}
                <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Exporter le Wallet (Keystore)</h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mot de passe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    />
                  </div>

                  <button
                    onClick={downloadWallet}
                    disabled={!password || password !== confirmPassword}
                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger Keystore Chiffré
                  </button>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setWallet(null);
                    setMnemonic("");
                    setPassword("");
                    setConfirmPassword("");
                    setShowPrivateKey(false);
                    setShowMnemonic(false);
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10"
                >
                  <Unlock className="w-5 h-5" />
                  Créer un Nouveau Wallet
                </button>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-12 h-12 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Prêt à créer votre wallet
                  </h3>
                  <p className="text-slate-400">
                    Cliquez sur "Générer" pour commencer
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sécurité Maximum</h3>
            <p className="text-sm text-slate-400">
              Génération cryptographique sécurisée avec chiffrement AES-256
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Chain</h3>
            <p className="text-sm text-slate-400">
              Compatible avec toutes les blockchains EVM (Ethereum, Polygon, BSC, etc.)
            </p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <FileKey className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Contrôle Total</h3>
            <p className="text-sm text-slate-400">
              Vous gardez le contrôle total de vos clés privées. Non-custodial.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
