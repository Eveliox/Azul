import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // when running `npm run dev:ui` alone, proxy API calls to `vercel dev` on :3000
    // Shared client-safe modules under api/_lib must be served by Vite.
    // Proxy only API requests, otherwise the browser cannot load the app.
    proxy: { '^/api/(?!_lib/)': 'http://127.0.0.1:3000' },
  },
})
