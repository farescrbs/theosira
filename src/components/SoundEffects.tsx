import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

export function SoundEffects() {
  const [isMuted, setIsMuted] = useState(true); // Par défaut muté pour ne pas déranger

  useEffect(() => {
    if (isMuted) return;

    // Créer un contexte audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Sons premium pour les interactions
    const playSound = (frequency: number, duration: number, volume: number = 0.1) => {
      if (isMuted) return;
      
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.log('Audio playback not available');
      }
    };

    // Sons pour différents événements
    const sounds = {
      hover: () => playSound(800, 0.05, 0.05),
      click: () => playSound(1200, 0.1, 0.08),
      success: () => {
        playSound(800, 0.1, 0.1);
        setTimeout(() => playSound(1000, 0.1, 0.1), 100);
        setTimeout(() => playSound(1200, 0.15, 0.1), 200);
      },
      notification: () => {
        playSound(1000, 0.1, 0.08);
        setTimeout(() => playSound(1200, 0.1, 0.08), 150);
      },
    };

    // Ajouter des listeners sur les boutons
    const handleHover = () => sounds.hover();
    const handleClick = () => sounds.click();

    const buttons = document.querySelectorAll('button, a[role="button"]');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', handleHover);
      button.addEventListener('click', handleClick);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', handleHover);
        button.removeEventListener('click', handleClick);
      });
      audioContext.close();
    };
  }, [isMuted]);

  return (
    <motion.button
      className="fixed bottom-8 left-8 z-[9999] w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-[#d4af37]/30 flex items-center justify-center hover:border-[#d4af37] transition-all group"
      onClick={() => setIsMuted(!isMuted)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white/60 group-hover:text-[#d4af37] transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-[#d4af37] transition-colors" />
      )}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 backdrop-blur-xl border border-[#d4af37]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <span className="text-white" style={{ fontSize: '0.875rem' }}>
          {isMuted ? 'Activer les sons' : 'Désactiver les sons'}
        </span>
      </div>
    </motion.button>
  );
}

export default SoundEffects;
