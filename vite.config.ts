import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  root: './src/assets',
  publicDir: path.resolve(import.meta.dirname, 'public'),
  build: {
    manifest: true,
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/assets/main.tsx',
    },
  },
});
