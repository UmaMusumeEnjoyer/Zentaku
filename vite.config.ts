import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: [
      'dry-scalping-surgical.ngrok-free.dev'
    ],
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_DOMAIN,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        },
        '/movies': {
          target: env.VITE_FILM_SERVER_URL || 'http://localhost:3636',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: env.VITE_BACKEND_DOMAIN,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    optimizeDeps: {
      exclude: ['@umamusumeenjoyer/shared-logic']
    }
  };
});