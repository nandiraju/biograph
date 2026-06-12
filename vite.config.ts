import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    // Force these CJS packages to be pre-bundled together so imports resolve
    include: [
      'react-force-graph-3d',
      'three-forcegraph',
      'ngraph.forcelayout',
      'ngraph.graph',
    ],
  },
})
