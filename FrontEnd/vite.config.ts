import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import type { UserConfig } from 'vitest/config'  


export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setupTests.ts'
  },
} as UserConfig) 
