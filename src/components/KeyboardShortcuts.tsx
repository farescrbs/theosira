import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts: Shortcut[] = [
    {
      key: 'H',
      description: 'Aller à l\'accueil',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      key: 'G',
      description: 'Ouvrir God Mode',
      action: () => {
        window.dispatchEvent(new CustomEvent('toggle-god-mode'));
      },
    },
    {
      key: 'T',
      description: 'Trading Dashboard',
      action: () => {
        const trading = document.querySelector('[data-trading]');
        trading?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      key: 'S',
      description: 'Statistiques',
      action: () => {
        const stats = document.querySelector('[data-stats]');
        stats?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      key: '?',
      description: 'Afficher/Masquer les raccourcis',
      action: () => setIsVisible(!isVisible),
    },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignorer si dans un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();

      shortcuts.forEach(shortcut => {
        if (key === shortcut.key.toLowerCase()) {
          e.preventDefault();
          shortcut.action();
        }
      });

      // Toggle help avec '?'
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  return (
    <>
      {/* Indicateur de raccourci */}
      <motion.button
        className="fixed bottom-8 left-24 z-[9999] w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-[#d4af37]/30 flex items-center justify-center hover:border-[#d4af37] transition-all group"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2 }}
      >
        <Keyboard className="w-5 h-5 text-white/60 group-hover:text-[#d4af37] transition-colors" />
        
        {/* Badge "?" */}
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-black" style={{ fontSize: '0.625rem' }}>?</span>
        </motion.div>
      </motion.button>

      {/* Panel des raccourcis */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVisible(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="ultra-glass rounded-2xl p-8 m-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/40 border border-[#d4af37]/30 flex items-center justify-center">
                      <Keyboard className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <div>
                      <h3 className="text-[#d4af37] mb-1">Raccourcis Clavier</h3>
                      <p className="text-white/60" style={{ fontSize: '0.875rem' }}>
                        Navigation rapide sur THESORIA
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setIsVisible(false)}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </motion.button>
                </div>

                {/* Shortcuts List */}
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={shortcut.action}
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-white/80 group-hover:text-white transition-colors">
                        {shortcut.description}
                      </span>

                      <div className="flex items-center gap-2">
                        <motion.kbd
                          className="px-3 py-1.5 rounded-lg bg-black/50 border border-[#d4af37]/30 text-[#d4af37] font-mono"
                          whileHover={{ scale: 1.05 }}
                          style={{ fontSize: '0.875rem' }}
                        >
                          {shortcut.key}
                        </motion.kbd>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/40 text-center" style={{ fontSize: '0.75rem' }}>
                    Appuyez sur <kbd className="px-2 py-1 rounded bg-white/10 text-[#d4af37] font-mono">?</kbd> à tout moment pour afficher/masquer ce panel
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default KeyboardShortcuts;
