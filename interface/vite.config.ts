import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    sveltekit(),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
    }),
  ],
});
