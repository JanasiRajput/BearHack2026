import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Dev app URL: http://localhost:5174 (matches Auth0 callback + backend CORS default).
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5174,
    // If 5174 is busy (e.g. old Vite still running), Vite tries 5175+ — use the URL it prints, or stop the other process.
    strictPort: false,
    open: '/',
  },
  preview: {
    host: 'localhost',
    port: 5174,
    strictPort: false,
  },
})
