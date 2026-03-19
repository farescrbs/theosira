/**
 * Bannière d'avertissement pour transactions blockchain réelles
 * Alerte l'utilisateur que les transactions sont VRAIES et irréversibles
 */

import { motion } from "motion/react";
import { AlertTriangle, Zap } from "lucide-react";

interface RealTransactionWarningProps {
  network: string;
  show?: boolean;
}

export default function RealTransactionWarning({ network, show = true }: RealTransactionWarningProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5"
    >
      <div
        className="relative overflow-hidden rounded-sm backdrop-blur-xl p-4 border"
        style={{
          background: "rgba(239, 68, 68, 0.1)",
          borderColor: "rgba(239, 68, 68, 0.3)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </motion.div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-red-400 font-bold text-sm tracking-wider">
                ⚠️ MODE PRODUCTION RÉEL ACTIVÉ
              </h3>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </div>

            <div className="space-y-1 text-xs text-white/70">
              <p className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  Toutes les transactions sont <strong className="text-red-400">RÉELLES</strong> et seront exécutées sur{" "}
                  <strong className="text-white">{network}</strong>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  Les fonds envoyés sont <strong className="text-red-400">DÉFINITIVEMENT TRANSFÉRÉS</strong> et{" "}
                  <strong className="text-red-400">IRRÉVERSIBLES</strong>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  Vérifiez <strong className="text-white">DEUX FOIS</strong> les adresses destinataires avant d'envoyer
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">•</span>
                <span>
                  Les frais de gas sont <strong className="text-white">PAYÉS EN ETH RÉEL</strong> depuis votre wallet
                </span>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-red-500/20">
              <p className="text-[10px] text-white/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Ce n'est PAS un environnement de test. Utilisez avec précaution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
