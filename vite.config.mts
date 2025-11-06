import { reactRouter } from '@react-router/dev/vite';
import { gadget } from 'gadget-server/vite';
import path from 'path';
// import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [gadget(), reactRouter()],
  resolve: {
    alias: {
      web: path.resolve(__dirname, './web'),
      shared: path.resolve(__dirname, './shared'),
    },
  },
  optimizeDeps: {
    include: ['@shopify/app-bridge-react'],
  },
  ssr: {
    noExternal: ['posthog-js', 'posthog-js/react'],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, './shared')],
    },
  },
});
