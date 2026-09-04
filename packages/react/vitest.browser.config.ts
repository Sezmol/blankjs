import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  test: {
    include: ["src/**/*.browser.test.tsx"],
    globals: true,
    setupFiles: [
      fileURLToPath(new URL("./vitest.browser.setup.ts", import.meta.url)),
    ],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
