import { defineConfig } from 'vite'

export default defineConfig({
  base: '/pages/',
  build: {
    outDir: 'dist',
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    open: true
  }
})