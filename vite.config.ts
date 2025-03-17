import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";
// @deno-types="vite-plugin-font/src/font"
import Font from "vite-plugin-font";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react(), Font.vite()],
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/v3/api-docs": "http://localhost:8000",
      "/auth": "http://localhost:8000",
    },
  },
});
