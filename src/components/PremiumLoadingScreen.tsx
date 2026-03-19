import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function PremiumLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simuler le chargement
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Fond avec particules animées */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#d4af37] rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Logo THESORIA */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="mb-8 bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#d4af37] bg-clip-text text-transparent"
                style={{ fontSize: '4rem', fontFamily: 'Playfair Display, serif' }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                THESORIA
              </motion.h1>
            </motion.div>

            {/* Anneau de chargement premium */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Cercle de fond */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.1)"
                  strokeWidth="2"
                />
                
                {/* Cercle de progression */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  transform="rotate(-90 50 50)"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))',
                  }}
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="50%" stopColor="#f0e68c" />
                    <stop offset="100%" stopColor="#d4af37" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Pourcentage au centre */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[#d4af37]" style={{ fontSize: '1.5rem' }}>
                  {Math.floor(progress)}%
                </span>
              </motion.div>
            </div>

            {/* Messages de chargement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <p className="text-[#d4af37]/80 tracking-wider">
                {progress < 30 && "Initialisation de l'IA Maître..."}
                {progress >= 30 && progress < 60 && "Connexion aux réseaux blockchain..."}
                {progress >= 60 && progress < 90 && "Activation des systèmes MEV..."}
                {progress >= 90 && "Préparation de l'interface..."}
              </p>
              
              {/* Barre de progression secondaire */}
              <div className="w-64 h-1 bg-black/50 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#d4af37]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)',
                  }}
                />
              </div>
            </motion.div>

            {/* Orbites décoratives */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute border border-[#d4af37]/20 rounded-full"
                  style={{
                    width: `${150 + i * 50}px`,
                    height: `${150 + i * 50}px`,
                  }}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 10 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PremiumLoadingScreen;
