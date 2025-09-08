import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // This is the new proxy configuration
  server: {
    proxy: {
      // This proxies any request starting with '/api'
      '/api': {
        target: 'http://localhost:5000', // Our backend server
        changeOrigin: true, // Needed for virtual hosts
        secure: false,      // Not using https in dev
      },
    },
  },
});