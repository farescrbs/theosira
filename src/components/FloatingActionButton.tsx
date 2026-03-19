import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, TrendingUp, Wallet, Settings, X, Infinity as InfinityIcon } from 'lucide-react';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Zap, label: 'Flash Loan', color: '#d4af37', onClick: () => window.scrollTo({ top: 0 }) },
    { icon: InfinityIcon, label: 'GOD MODE', color: '#ff3366', onClick: () => window.dispatchEvent(new CustomEvent('toggle-god-mode')) },
    { icon: TrendingUp, label: 'Trading', color: '#f0e68c', onClick: () => window.scrollTo({ top: 0 }) },
    { icon: Wallet, label: 'Wallet', color: '#b8941e', onClick: () => window.scrollTo({ top: 0 }) },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 space-y-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-xl bg-black/60 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all group w-full justify-end"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon 
                  className="w-5 h-5 transition-colors"
                  style={{ color: action.color }}
                />
                <span className="text-white pr-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <motion.button
        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941e] flex items-center justify-center shadow-2xl relative overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
      >
        {/* Effet de brillance animé */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {isOpen ? (
          <X className="w-6 h-6 text-white relative z-10" />
        ) : (
          <Zap className="w-6 h-6 text-white relative z-10" />
        )}
      </motion.button>

      {/* Anneau de pulsation */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#d4af37]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

export default FloatingActionButton;
