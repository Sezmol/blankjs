import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /blankjs/
  base: command === "build" ? "/blankjs/" : "/",
  plugins: [react()],
}));
