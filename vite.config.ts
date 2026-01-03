import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // گرنگترین بەش ئەم دێڕەی خوارەوەیە:
  base: './', 
})
