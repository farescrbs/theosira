import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Eye, EyeOff } from 'lucide-react';

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const updateStats = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const delta = currentTime - lastTimeRef.current;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;

        // Récupérer l'utilisation mémoire si disponible
        if ((performance as any).memory) {
          const memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576;
          setMemory(Math.round(memoryUsage));
        }
      }

      animationFrameId = requestAnimationFrame(updateStats);
    };

    if (isVisible) {
      animationFrameId = requestAnimationFrame(updateStats);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible]);

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return '#22c55e';
    if (fps >= 30) return '#eab308';
    return '#ef4444';
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed top-24 right-4 z-[9998] w-10 h-10 rounded-lg bg-black/60 backdrop-blur-xl border border-[#d4af37]/30 flex items-center justify-center hover:border-[#d4af37] transition-all group"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {isVisible ? (
          <EyeOff className="w-4 h-4 text-[#d4af37]" />
        ) : (
          <Eye className="w-4 h-4 text-white/60 group-hover:text-[#d4af37] transition-colors" />
        )}
      </motion.button>

      {/* Performance Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-36 right-4 z-[9998] w-48 bg-black/90 backdrop-blur-xl border border-[#d4af37]/30 rounded-lg p-4"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#d4af37]/20">
              <Activity className="w-4 h-4 text-[#d4af37]" />
              <span className="text-white" style={{ fontSize: '0.875rem' }}>
                Performance
              </span>
            </div>

            {/* FPS */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60" style={{ fontSize: '0.75rem' }}>
                  FPS
                </span>
                <span
                  className="font-mono"
                  style={{ 
                    fontSize: '0.875rem',
                    color: getFpsColor(fps)
                  }}
                >
                  {fps}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getFpsColor(fps) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(fps / 60) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Memory (si disponible) */}
            {memory > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60" style={{ fontSize: '0.75rem' }}>
                    Memory
                  </span>
                  <span
                    className="text-[#d4af37] font-mono"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {memory} MB
                  </span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((memory / 500) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#d4af37]/20">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-white/40" style={{ fontSize: '0.65rem' }}>
                System Optimal
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PerformanceMonitor;
