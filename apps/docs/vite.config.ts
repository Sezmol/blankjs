import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /blankjs/
  base: command === "build" ? "/blankjs/" : "/",
  plugins: [react(), tailwindcss()],
}));
