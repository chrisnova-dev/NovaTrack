import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Ensure react plugin is imported
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/NovaTrack/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwarding requests from /api-gecko to CoinGecko to bypass CORS
      "/api-gecko": {
        target: "https://api.coingecko.com/api/v3",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-gecko/, ""),
      },
    },
  },
});
