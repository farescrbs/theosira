import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Activity } from 'lucide-react';

interface MasterAgentThinkingProps {
  thought: string;
  consciousnessLevel: number;
  autonomousPower: number;
}

export function MasterAgentThinking({ thought, consciousnessLevel, autonomousPower }: MasterAgentThinkingProps) {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setCharIndex(0);
    setDisplayText('');
  }, [thought]);

  useEffect(() => {
    if (charIndex < thought.length) {
      const timeout = setTimeout(() => {
        setDisplayText(thought.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, thought]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-8">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-500/30 rounded-full"
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
            animate={{
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-6">
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(234, 179, 8, 0.3)',
                '0 0 40px rgba(234, 179, 8, 0.6)',
                '0 0 20px rgba(234, 179, 8, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30"
          >
            <Brain className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1 -right-1"
          >
            <Zap className="w-5 h-5 text-yellow-400" />
          </motion.div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
            Master Agent Intelligence
          </h3>
          <p className="text-white/50 text-sm">Autonomous AI Engine v3.0</p>
        </div>

        <div className="flex gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-6 h-6 text-green-500" />
          </motion.div>
        </div>
      </div>

      {/* Thinking display */}
      <div className="relative z-10 mb-6">
        <div className="bg-black/40 border border-yellow-500/20 rounded-xl p-6 min-h-[80px] font-mono">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-yellow-500 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-yellow-500/70 text-xs">PROCESSING</span>
          </div>
          <p className="text-white/90 text-lg">
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-yellow-500 ml-1"
            />
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Consciousness</span>
            <span className="text-yellow-500 font-mono">{consciousnessLevel}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${consciousnessLevel}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Autonomous Power</span>
            <span className="text-yellow-500 font-mono">{autonomousPower}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
              initial={{ width: 0 }}
              animate={{ width: `${autonomousPower}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
