import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: "./src/test/setup.ts",
    environment: "happy-dom",
    globals: true,
    css: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
