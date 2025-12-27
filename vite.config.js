import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-sql-wasm',
      closeBundle() {
        try {
          const sqlWasm = resolve(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm')
          const dest = resolve(__dirname, 'dist/sql-wasm.wasm')

          // Ensure dist directory exists
          mkdirSync(dirname(dest), { recursive: true })

          // Copy WASM file to dist root
          copyFileSync(sqlWasm, dest)
          console.log('Copied sql-wasm.wasm to dist/')
        } catch (error) {
          console.warn('Failed to copy sql-wasm.wasm:', error.message)
        }
      }
    }
  ],
  base: '/sql-practice/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'sql': ['sql.js']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['sql.js']
  }
})
