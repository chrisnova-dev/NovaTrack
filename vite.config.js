import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // This is the "Lightweight" way to fix the Buffer/Process/Global error
  // without using the plugin that is crashing on your Windows paths
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  base: "/", 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  optimizeDeps: {
    // This tells Vite not to try and "re-bundle" these specific libraries
    // which often stops that 'Unexpected end of JSON' error
    exclude: ['@esbuild-plugins/node-globals-polyfill'] 
  }
});