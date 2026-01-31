import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

export const STORAGE_STATE = path.join(process.cwd(), '.auth/user.json')

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.NEXT_PUBLIC_URL,
    trace: 'on-first-retry',
    storageState: STORAGE_STATE,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts$/,
      use: {
        storageState: undefined,
      },
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'Mobile Chrome',
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      dependencies: ['setup'],
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: process.env.NEXT_PUBLIC_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
