import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  deps: {
    neverBundle: ["react", "react-dom"],
  },
});
