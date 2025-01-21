import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        background: "public/service-workers/background.js", // Background script
        popup: "src/index.jsx" // Popup entry point
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]" // Keep CSS inside "assets"
      }
    }
  },
  css: {
    postcss: {
      plugins: []
    }
  }
});
