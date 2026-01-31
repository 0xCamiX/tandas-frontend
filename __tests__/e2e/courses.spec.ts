import { expect, test } from '@playwright/test'

test.describe('Courses Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/courses')
  })

  test.describe('Courses List UI', () => {
    test('displays critical UI elements', async ({ page }) => {
      await expect(
        page.getByRole('heading', {
          name: /catálogo de cursos/i,
        }),
      ).toBeVisible()
      await expect(page.getByPlaceholder(/buscar por título/i)).toBeVisible()
      await expect(page.getByRole('combobox').first()).toBeVisible()
      const gridContent = page
        .locator('.grid')
        .first()
        .or(page.getByText(/no se encontraron/i))
      await expect(gridContent).toBeVisible()
    })

    test('course cards have valid links', async ({ page }) => {
      const firstCourseBtn = page
        .getByRole('link', {
          name: /ver curso/i,
        })
        .first()
      await expect(firstCourseBtn).toBeVisible()
      await expect(firstCourseBtn).toHaveAttribute('href', /\/dashboard\/courses\/.+/)
    })
  })

  test.describe('Filters Functionality', () => {
    test('searches courses by title', async ({ page }) => {
      await page.getByPlaceholder(/buscar por título/i).fill('agua')
      await expect(page).toHaveURL(/search=agua/, {
        timeout: 5000,
      })
    })

    test('filters apply to URL params', async ({ page }) => {
      await page
        .getByRole('combobox')
        .filter({
          hasText: /categoría|todas/i,
        })
        .click()
      await page.getByRole('option').nth(1).click()
      await expect(page).toHaveURL(/category=/)

      await page
        .getByRole('combobox')
        .filter({
          hasText: /nivel|todos/i,
        })
        .click()
      await page.getByRole('option').nth(1).click()
      await expect(page).toHaveURL(/level=/)
    })

    test('clears filters resets the view', async ({ page }) => {
      await page.goto('/dashboard/courses?category=test&level=test')

      const clearButton = page.getByRole('button', {
        name: /limpiar filtros/i,
      })
      await clearButton.click()

      await expect(page).not.toHaveURL(/category=test/)
      await expect(page).not.toHaveURL(/level=test/)
    })
  })

  test.describe('Course Detail & Enrollment', () => {
    test('navigates to details and shows content', async ({ page }) => {
      await page
        .getByRole('link', {
          name: /ver curso/i,
        })
        .first()
        .click()

      await expect(page).toHaveURL(/\/dashboard\/courses\/.+/)

      await expect(
        page.locator('main').getByRole('heading', {
          level: 1,
        }),
      ).toBeVisible()

      await expect(
        page.locator('main').filter({
          hasText: /Contenido del curso/i,
        }),
      ).toBeVisible()
    })

    test('enrolls new user and redirects to first module', async ({ page, context }) => {
      const uniqueEmail = `test-${Date.now()}@example.com`
      const password = 'password123'

      await context.clearCookies()
      await page.goto('/signup')

      await page.getByLabel(/correo electrónico/i).fill(uniqueEmail)
      await page
        .getByLabel(/contraseña/i)
        .first()
        .fill(password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/signin/)

      await page.getByLabel(/correo electrónico/i).fill(uniqueEmail)
      await page.getByLabel(/contraseña/i).fill(password)
      await page.locator('button[type="submit"]').click()

      await expect(page).toHaveURL(/dashboard/)

      await page.goto('/dashboard/courses')
      await page
        .getByRole('link', {
          name: /ver curso/i,
        })
        .first()
        .click()

      await expect(page).toHaveURL(/\/dashboard\/courses\/.+/)

      const enrollBtn = page.getByRole('button', {
        name: /inscribirme al curso/i,
      })

      await expect(enrollBtn).toBeVisible()
      await enrollBtn.click()

      await expect(page).toHaveURL(/\/dashboard\/courses\/.+\/.+/, {
        timeout: 10000,
      })

      await expect(page.locator('main h1, main .text-3xl').first()).toBeVisible()
    })
  })
})
