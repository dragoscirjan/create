import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**"],
    setupFiles: ["./vitest.setup.js"],
  },
});
