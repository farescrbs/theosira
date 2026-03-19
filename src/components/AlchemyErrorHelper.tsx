/**
 * Composant d'aide pour résoudre les erreurs Alchemy
 * Affiche des instructions claires pour mettre à jour la clé API
 */

import { AlertTriangle, ExternalLink, Key, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AlchemyErrorHelperProps {
  error: string;
  onRetry?: () => void;
}

export default function AlchemyErrorHelper({ error, onRetry }: AlchemyErrorHelperProps) {
  const [showHelp, setShowHelp] = useState(false);

  const isAuthError = error.includes('ALCHEMY_KEY_INVALID') || 
                      error.includes('unauthorized') || 
                      error.includes('401') ||
                      error.includes('expired');

  if (!isAuthError) {
    // Erreur générique, affichage simple
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="text-sm text-red-400 font-semibold mb-1">Alchemy Connection Error</div>
            <div className="text-xs text-red-300/70 font-mono">{error}</div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-xs font-bold rounded transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Erreur d'authentification - affichage détaillé avec aide
  return (
    <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="text-base text-red-400 font-bold mb-2">
            🔑 Clé API Alchemy Invalide ou Expirée
          </div>
          <div className="text-sm text-red-300/80 mb-3">
            L'authentification avec Alchemy a échoué. Votre clé API doit être mise à jour.
          </div>
          
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs text-[#d4af37] hover:text-yellow-300 underline flex items-center gap-1"
          >
            {showHelp ? '▼' : '▶'} Comment résoudre ce problème ?
          </button>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-sm font-bold rounded transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-black/30 border border-white/10 rounded-lg space-y-4">
              
              {/* Étape 1 */}
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                  <span className="text-xs text-[#d4af37] font-bold">1</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-semibold mb-1">Obtenir une nouvelle clé Alchemy</div>
                  <div className="text-xs text-white/60 mb-2">
                    Créez une nouvelle app sur Alchemy Dashboard avec les réseaux Ethereum Mainnet et Sepolia activés.
                  </div>
                  <a
                    href="https://dashboard.alchemy.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] text-xs rounded hover:bg-[#d4af37]/30 transition-all"
                  >
                    <Key className="w-3 h-3" />
                    Ouvrir Alchemy Dashboard
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                  <span className="text-xs text-[#d4af37] font-bold">2</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-semibold mb-1">Mettre à jour dans Supabase</div>
                  <div className="text-xs text-white/60 mb-2">
                    Allez dans Settings → Edge Functions → Secrets et mettez à jour <code className="px-1 py-0.5 bg-black/40 border border-white/10 rounded text-[#d4af37]">ALCHEMY_API_KEY</code>
                  </div>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] text-xs rounded hover:bg-[#d4af37]/30 transition-all"
                  >
                    Ouvrir Supabase Dashboard
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                  <span className="text-xs text-[#d4af37] font-bold">3</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-semibold mb-1">Vérifier la configuration</div>
                  <div className="text-xs text-white/60 mb-2">
                    Retournez dans l'onglet "API Keys" du God Mode et testez la nouvelle clé.
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    La clé doit passer tous les tests au vert
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <div className="text-xs text-yellow-400">
                  ⚠️ <strong>Important :</strong> Collez la clé SANS guillemets, SANS espaces. 
                  Format attendu: <code className="ml-1 px-1 py-0.5 bg-black/40 border border-white/10 rounded">abcd1234efgh5678...</code>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
