import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

// Tailwind has been removed in favour of hand-written CSS
// (app/styles/reality-theme.css) for a smaller, faster bundle.
export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: "esnext",
    cssMinify: true,
    sourcemap: false,
  },
});
