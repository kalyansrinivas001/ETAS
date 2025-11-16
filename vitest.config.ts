import { defineConfig } from 'vitest/config'

// Vitest configuration — explicit jsdom environment for DOM APIs used in tests
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
