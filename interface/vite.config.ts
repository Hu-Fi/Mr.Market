import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    sveltekit(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: true, // also useful for many node packages
      },
    }),
  ],
  define: {
    // Provide a fake "module" global to satisfy path-browserify
    module: {},
  },
  ssr: {
    // Prevent Vite from trying to SSR these packages in ESM context
    noExternal: ['path-browserify'],
  },
  optimizeDeps: {
    // Make sure path-browserify isn't pre-bundled wrongly
    exclude: ['path-browserify'],
  },
});
