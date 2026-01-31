import { expect, test } from '@playwright/test'

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL as string,
  password: process.env.TEST_USER_PASSWORD as string,
}

function generateUniqueUser() {
  const timestamp = Date.now()
  return {
    email: `user${timestamp}@test.com`,
    password: 'securePass123',
  }
}

test.describe('Authentication Flow', () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  })

  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test.describe('Sign In Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/signin')
    })

    test('displays all form elements', async ({ page }) => {
      await expect(page.locator('[data-slot="card-title"]')).toHaveText('Iniciar Sesión')
      await expect(page.getByLabel(/correo electrónico/i)).toBeVisible()
      await expect(page.getByLabel(/contraseña/i)).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('shows error for invalid credentials', async ({ page }) => {
      await page.getByLabel(/correo electrónico/i).fill('noexiste@mail.com')
      await page.getByLabel(/contraseña/i).fill('passwordfalso')
      await page.locator('button[type="submit"]').click()

      await expect(
        page.locator('[data-sonner-toast]').filter({
          hasText: /Error de autenticación/i,
        }),
      ).toBeVisible()
    })

    test('redirects to dashboard after successful login', async ({ page }) => {
      await page.getByLabel(/correo electrónico/i).fill(TEST_USER.email)
      await page.getByLabel(/contraseña/i).fill(TEST_USER.password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/dashboard/)
    })
  })

  test.describe('Sign Up Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/signup')
    })

    test('shows error for duplicate registration', async ({ page }) => {
      await page.getByLabel(/correo electrónico/i).fill(TEST_USER.email)
      await page.getByLabel(/contraseña/i).fill(TEST_USER.password)
      await page.locator('button[type="submit"]').click()

      await expect(
        page.locator('[data-sonner-toast]').filter({
          hasText: /Error de registro/i,
        }),
      ).toBeVisible()
    })

    test('redirects to sign in after successful registration', async ({ page }) => {
      const newUser = generateUniqueUser()

      await page.getByLabel(/correo electrónico/i).fill(newUser.email)
      await page.getByLabel(/contraseña/i).fill(newUser.password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/signin/)
    })

    test('Sign in for new user', async ({ page }) => {
      const newUser = generateUniqueUser()

      await page.getByLabel(/correo electrónico/i).fill(newUser.email)
      await page.getByLabel(/contraseña/i).fill(newUser.password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/signin/)

      await page.getByLabel(/correo electrónico/i).fill(newUser.email)
      await page.getByLabel(/contraseña/i).fill(newUser.password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/dashboard/)
    })
  })

  test.describe('Sign Out', () => {
    test('Logout from dashboard successfully', async ({ page }) => {
      await page.goto('/signin')
      await page.getByLabel(/correo electrónico/i).fill(TEST_USER.email)
      await page.getByLabel(/contraseña/i).fill(TEST_USER.password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/dashboard/)

      const userInitial = TEST_USER.email.charAt(0).toUpperCase()
      await page
        .getByRole('button', {
          name: userInitial,
          exact: true,
        })
        .click()
      await page
        .getByRole('menuitem', {
          name: /cerrar sesión/i,
        })
        .click()

      await expect(page).toHaveURL(/\/$/)
    })
  })

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated users from dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/signin/)
    })
  })
})
