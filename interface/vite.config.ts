import { defineConfig, type Plugin } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const browserOnlyPolyfills = nodePolyfills({
  globals: {
    Buffer: true,
  },
}) as Plugin;

browserOnlyPolyfills.apply = (config) => {
  // Skip the polyfill aliasing for SSR builds so Node keeps its native modules.
  if (config?.build?.ssr) {
    return false;
  }

  return true;
};

export default defineConfig({
  plugins: [sveltekit(), browserOnlyPolyfills],
  server: {
    allowedHosts: ['.ngrok-free.app'],
  },
});
