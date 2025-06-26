// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // pour être accessible de l’extérieur si besoin
    port: 5174,
    strictPort: true, // échoue si 5174 est pris
  },
})
