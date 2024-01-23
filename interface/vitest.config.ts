import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Include only files with the .test.ts suffix in the helpers folder
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.spec.ts', 'node_modules'],
  },
  resolve: {
    alias: {
      '$lib': '/src/lib'
    },
  },
});
