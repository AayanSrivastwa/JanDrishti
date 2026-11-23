import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
// Note: Vite 8 uses rolldown which requires manualChunks as a function
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise chunk size warning limit — Leaflet + Chart.js produce large bundles
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split heavy vendor libraries into separate cacheable chunks
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet") || id.includes("react-leaflet")) return "vendor-map";
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) return "vendor-charts";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("react-dom") || id.includes("react-router")) return "vendor-react";
          }
        },
      },
    },
  },
  server: {
    // Local dev proxy: forwards /api requests to Express backend
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
