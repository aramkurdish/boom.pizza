
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Crucial for GitHub Pages sub-directory deployments
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
