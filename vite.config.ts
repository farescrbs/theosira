import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
 
export default defineConfig({
  plugins: [react(), tailwindcss()],
 
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Alias versionnés (compatibilité imports Figma/externes)
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'ethers@6.13.0': 'ethers',
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@supabase/supabase-js@2.39.0': '@supabase/supabase-js',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
      // Assets Figma
      'figma:asset/f2c8edbbb3b86a52a96e4b14d456ffcee87ec84f.png': path.resolve(__dirname, './src/assets/f2c8edbbb3b86a52a96e4b14d456ffcee87ec84f.png'),
      'figma:asset/ec3bef7a1dbbb53891932786dd22b081863ce7d9.png': path.resolve(__dirname, './src/assets/ec3bef7a1dbbb53891932786dd22b081863ce7d9.png'),
      'figma:asset/e9551396a03238c73b4494cf8da3551b77ea7b0a.png': path.resolve(__dirname, './src/assets/e9551396a03238c73b4494cf8da3551b77ea7b0a.png'),
      'figma:asset/d7d83dd8bfeb93c9c4d8e462baaaac7cd9ff4145.png': path.resolve(__dirname, './src/assets/d7d83dd8bfeb93c9c4d8e462baaaac7cd9ff4145.png'),
      'figma:asset/d2f04083bf369d8a3776c82e1e12d3c2f776a88c.png': path.resolve(__dirname, './src/assets/d2f04083bf369d8a3776c82e1e12d3c2f776a88c.png'),
      'figma:asset/ca547bfc114d4a2a41ab021ccfd1497a3c6acede.png': path.resolve(__dirname, './src/assets/ca547bfc114d4a2a41ab021ccfd1497a3c6acede.png'),
      'figma:asset/c47fb4f835e4dc9598e9fd6b66ab6609a6b32133.png': path.resolve(__dirname, './src/assets/c47fb4f835e4dc9598e9fd6b66ab6609a6b32133.png'),
      'figma:asset/94f91bfbc8dbf2f8c8e7f8b1eecf4b435393110b.png': path.resolve(__dirname, './src/assets/94f91bfbc8dbf2f8c8e7f8b1eecf4b435393110b.png'),
      'figma:asset/5f51e538d29b254ba38cbdf38d07e02ba7eafc79.png': path.resolve(__dirname, './src/assets/5f51e538d29b254ba38cbdf38d07e02ba7eafc79.png'),
      'figma:asset/5d4cb14ae2e1795f7d4b6e4207134f042ae2b498.png': path.resolve(__dirname, './src/assets/5d4cb14ae2e1795f7d4b6e4207134f042ae2b498.png'),
      'figma:asset/2ea33df8ef9972a17e1b1dc9a9411736a1a891c4.png': path.resolve(__dirname, './src/assets/2ea33df8ef9972a17e1b1dc9a9411736a1a891c4.png'),
      'figma:asset/276cea897d479014f3bb099096b244cf5ec2be4b.png': path.resolve(__dirname, './src/assets/276cea897d479014f3bb099096b244cf5ec2be4b.png'),
      'figma:asset/1038fd06bb6a401b3dca9a9772bad37538621417.png': path.resolve(__dirname, './src/assets/1038fd06bb6a401b3dca9a9772bad37538621417.png'),
      // Alias raccourci src
      '@': path.resolve(__dirname, './src'),
    },
  },
 
  build: {
    outDir: 'dist',          // ✅ Aligné avec vercel.json (était 'build')
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'ethers-vendor': ['ethers'],
          'ui-vendor':     ['lucide-react', 'recharts'],
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
 
  optimizeDeps: {
    include: ['react', 'react-dom', 'ethers'],
    exclude: ['@aave/core-v3', '@openzeppelin/contracts'],
  },
 
  server: {
    port: 3000,
    open: true,
  },
});
 
