import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";

type Point = { x: number; y: number };

const press: BrowserCommand<[from: Point, to?: Point]> = async (
  { page, iframe },
  from,
  to = from,
) => {
  const frame = await iframe.owner().evaluate((element: HTMLElement) => {
    const box = element.getBoundingClientRect();

    return {
      x: box.x,
      y: box.y,
      left: element.clientLeft,
      top: element.clientTop,
      scale: box.width / element.offsetWidth,
    };
  });

  const toPage = (point: Point) => ({
    x: frame.x + (frame.left + point.x) * frame.scale,
    y: frame.y + (frame.top + point.y) * frame.scale,
  });

  const start = toPage(from);
  const end = toPage(to);

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();

  try {
    await page.mouse.move(end.x, end.y);
  } finally {
    await page.mouse.up();
  }
};

const reducedMotion: BrowserCommand<[value: "reduce" | "no-preference"]> = (
  { page },
  value,
) => page.emulateMedia({ reducedMotion: value });

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  test: {
    include: ["src/**/*.browser.test.tsx"],
    globals: true,
    fileParallelism: false,
    setupFiles: [
      fileURLToPath(new URL("./vitest.browser.setup.ts", import.meta.url)),
    ],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        { browser: "chromium", name: "chromium" },
        { browser: "firefox", name: "firefox" },
        { browser: "webkit", name: "webkit" },
      ],
      commands: { press, reducedMotion },
    },
  },
});
