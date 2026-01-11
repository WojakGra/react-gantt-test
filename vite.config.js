import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Development configuration
  if (command === 'serve') {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          '@wojakgra/react-gantt-mantine': resolve(__dirname, 'package/src'),
        },
      },
    };
  }

  // Demo build configuration - includes all dependencies
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist-demos',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
  };
});
