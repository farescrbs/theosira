/**
 * MetaMask Install Prompt - Guide installation si MetaMask absent
 */

import { motion } from "motion/react";
import { Download, Chrome, Firefox, ExternalLink } from "lucide-react";

export default function MetaMaskInstallPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto p-8 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30"
    >
      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
        <Download className="w-10 h-10 text-orange-400" />
      </div>

      {/* Title */}
      <h2 
        className="text-2xl text-center mb-4 text-white"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        MetaMask Requis
      </h2>

      {/* Description */}
      <p className="text-sm text-white/70 text-center mb-8 max-w-md mx-auto leading-relaxed">
        Pour utiliser les fonctionnalités blockchain de THESORIA God Mode,
        vous devez installer l'extension MetaMask dans votre navigateur.
      </p>

      {/* Installation Steps */}
      <div className="space-y-4 mb-8">
        <div className="p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400 font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Visitez le site officiel MetaMask
              </h3>
              <p className="text-xs text-white/60 mb-3">
                Téléchargez uniquement depuis le site officiel pour votre sécurité
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-sm hover:bg-orange-500/30 transition-all text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                Ouvrir MetaMask.io
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400 font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Choisissez votre navigateur
              </h3>
              <p className="text-xs text-white/60 mb-3">
                MetaMask est disponible pour Chrome, Firefox, Brave et Edge
              </p>
              <div className="flex gap-2">
                <a
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-xs"
                >
                  <Chrome className="w-3 h-3" />
                  Chrome
                </a>
                <a
                  href="https://addons.mozilla.org/firefox/addon/ether-metamask/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-xs"
                >
                  <Firefox className="w-3 h-3" />
                  Firefox
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 text-orange-400 font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Installez et configurez
              </h3>
              <p className="text-xs text-white/60">
                Suivez les instructions pour créer votre wallet. Sauvegardez précieusement
                votre phrase de récupération (seed phrase) - elle est irremplaçable !
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/30 border border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 font-bold text-sm">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Revenez sur THESORIA
              </h3>
              <p className="text-xs text-white/60">
                Une fois MetaMask installé, rafraîchissez cette page et
                cliquez sur "Connecter MetaMask" pour commencer !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
        <div className="text-xs text-red-300">
          <p className="font-semibold mb-2">⚠️ IMPORTANT - SÉCURITÉ</p>
          <ul className="space-y-1 text-red-300/80 list-disc list-inside">
            <li>Ne partagez JAMAIS votre seed phrase (12-24 mots)</li>
            <li>Ne partagez JAMAIS votre clé privée</li>
            <li>MetaMask ne vous demandera JAMAIS ces informations</li>
            <li>Téléchargez uniquement depuis metamask.io</li>
            <li>Vérifiez toujours l'URL avant de saisir des informations</li>
          </ul>
        </div>
      </div>

      {/* Help */}
      <div className="mt-6 text-center">
        <p className="text-xs text-white/40 mb-2">Besoin d'aide ?</p>
        <div className="flex gap-3 justify-center">
          <a
            href="https://support.metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#d4af37] hover:text-yellow-300 underline"
          >
            Support MetaMask
          </a>
          <a
            href="https://metamask.io/faqs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#d4af37] hover:text-yellow-300 underline"
          >
            FAQ
          </a>
          <a
            href="https://www.youtube.com/watch?v=Af_lQ1zUnoM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#d4af37] hover:text-yellow-300 underline"
          >
            Tutoriel Vidéo
          </a>
        </div>
      </div>
    </motion.div>
  );
}
