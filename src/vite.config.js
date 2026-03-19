import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 2000, // Augmenté de 500 à 2000 KB pour éviter les warnings
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['motion/react'],
          'ui-vendor': ['lucide-react', 'recharts'],
          'ethers-vendor': ['ethers'], // Séparer ethers (gros package)
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion/react'],
  },
});