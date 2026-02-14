import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Force Vite to always resolve 'three' to the same instance
    dedupe: ['three'],
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      // Fix for "Multiple instances of Three.js being imported" warning
      'three': path.resolve(__dirname, './node_modules/three'),
    },
  },
  // 🚀 PRODUCTION BUILD OPTIMIZATION
  build: {
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // Минимальный размер для code splitting (20kb)
    cssCodeSplit: true,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks для оптимального splitting
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['motion'],
          'ui-vendor': ['lucide-react', 'recharts'],
          'spline-vendor': ['@splinetool/react-spline', '@splinetool/runtime'],
        },
        
        // Asset file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      
      // Tree-shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
    
    // Compression hints
    minify: 'esbuild',
    
    // Source maps только для production debugging (можно отключить)
    sourcemap: false,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning threshold
    
    // Report compressed size
    reportCompressedSize: true,
  },
  
  // Preview server optimization
  preview: {
    port: 3000,
    strictPort: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
})



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "resolve-figma-asset-protocol",
      enforce: "pre",
      resolveId(source) {
        if (source.startsWith("figma:asset/")) {
          const file = source.replace("figma:asset/", "");
          return path.resolve(__dirname, "src/figma-assets", file);
        }
        return null;
      },
    },
  ],
});
