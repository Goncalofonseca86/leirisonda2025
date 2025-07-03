import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: false,
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    host: true,
  },
});
