import adapterAuto from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * @returns {import('@sveltejs/kit').Adapter}
 */
function getAdapter() {
  if (process.env.ADAPTER === 'node' || process.env.RENDER) {
    try {
      const adapterNode = require('@sveltejs/adapter-node');
      return (adapterNode.default || adapterNode)();
    } catch (e) {
      console.warn('Could not load @sveltejs/adapter-node, falling back to auto. Error:', e.message);
    }
  } else if (process.env.ADAPTER === 'static') {
    try {
      const adapterStatic = require('@sveltejs/adapter-static');
      return (adapterStatic.default || adapterStatic)({
        pages: 'build',
        assets: 'build',
        fallback: 'app.html',
        precompress: false,
        strict: true
      });
    } catch (e) {
      console.warn('Could not load @sveltejs/adapter-static, falling back to auto. Error:', e.message);
    }
  }

  return adapterAuto();
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: getAdapter()
  }
};

export default config;
