import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
      },
      host: true,
      port: 5173,
    },
  };
});