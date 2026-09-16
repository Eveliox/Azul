import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // when running `npm run dev:ui` alone, proxy API calls to `vercel dev` on :3000
    proxy: { '/api': 'http://localhost:3000' },
  },
})
