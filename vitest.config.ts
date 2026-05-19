import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globalSetup: ['./src/test/global-setup.ts'],
    pool: 'forks',
    alias: {
		"#/*": "./src/*"
	},
  },
})
