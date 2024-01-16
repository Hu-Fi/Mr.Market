import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Include only files with the .test.ts suffix in the helpers folder
    include: ['**/*.test.ts'],
    exclude: ['**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '$lib': '/src/lib'
    },
  },
});
