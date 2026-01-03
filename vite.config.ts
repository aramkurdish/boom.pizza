
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures assets are loaded relative to the index.html path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 3000,
  },
});
