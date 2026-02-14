import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // Make requires both React + Tailwind plugins
    react(),
    tailwindcss(),

    // Resolve figma:asset/* imports during Vercel/Vite build
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

  resolve: {
    dedupe: ["three"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      three: path.resolve(__dirname, "./node_modules/three"),
    },
  },

  build: {
    target: "es2020",
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "motion-vendor": ["motion"],
          "ui-vendor": ["lucide-react", "recharts"],
          "spline-vendor": ["@splinetool/react-spline", "@splinetool/runtime"],
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "";
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          if (/\.css$/i.test(name)) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },

      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },

    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
  },

  preview: {
    port: 3000,
    strictPort: true,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
});
