import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/styles.css"],
  dts: true,
  sourcemap: true,
  deps: {
    neverBundle: ["react", "react-dom"],
  },
});
