import path from 'node:path'
import { expect, test as setup } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const authFile = path.join(process.cwd(), '.auth/user.json')

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD are required in .env')
  }

  await page.goto('/signin')
  await page.getByLabel(/correo electrónico/i).fill(email)
  await page.getByLabel(/contraseña/i).fill(password)
  await page.locator('button[type="submit"]').click()

  await expect(page).toHaveURL(/.*dashboard/)

  await page.context().storageState({
    path: authFile,
  })
})
