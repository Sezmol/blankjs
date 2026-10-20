import "vitest/browser";

type Point = { x: number; y: number };

declare module "vitest/browser" {
  interface BrowserCommands {
    press: (from: Point, to?: Point) => Promise<void>;
    reducedMotion: (value: "reduce" | "no-preference") => Promise<void>;
  }
}
