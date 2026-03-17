import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // Ensure this is EXACTLY '/' for Vercel
  base: '/', 
  
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  build: {
    outDir: 'dist',
    // This helps ensure the file names match what Vercel expects
    assetsDir: 'assets', 
  }
});