import { expect, test } from '@playwright/test'

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test.describe('Header Profile UI', () => {
    test('displays user profile information', async ({ page }) => {
      await expect(
        page.locator('main').getByRole('heading', {
          level: 1,
        }),
      ).toBeVisible()
      await expect(page.locator('main [data-slot="avatar"]')).toBeVisible()
    })
  })

  test.describe('Stats Cards UI', () => {
    test('displays all four stat cards', async ({ page }) => {
      const statsGrid = page.locator('main .grid').first()
      const statsCards = statsGrid.locator('[data-slot="card"]')
      await expect(statsCards).toHaveCount(4)

      await expect(
        statsGrid.getByText('Inscripciones', {
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        statsGrid.getByText('Completados', {
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        statsGrid.getByText('Intentos de Quiz', {
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        statsGrid.getByText('Puntuación Promedio', {
          exact: true,
        }),
      ).toBeVisible()
    })

    test('validates stats cards content structure', async ({ page }) => {
      await expect(
        page.locator('main').getByText(/cursos en los que estás inscrito/i),
      ).toBeVisible()
      await expect(page.locator('main').getByText(/cursos completados exitosamente/i)).toBeVisible()
      await expect(page.locator('main').getByText(/total de quizzes realizados/i)).toBeVisible()
      await expect(page.locator('main').getByText(/promedio de tus calificaciones/i)).toBeVisible()
    })
  })

  test.describe('Progress Section UI', () => {
    test('displays progress card header', async ({ page }) => {
      await expect(
        page
          .locator('main')
          .getByText('Mi Progreso', {
            exact: true,
          })
          .first(),
      ).toBeVisible()
      await expect(
        page.locator('main').getByText(/revisa tu progreso en los cursos/i),
      ).toBeVisible()
    })

    test('shows progress content or empty state', async ({ page }) => {
      const hasProgress = page.locator('main').getByText(/módulos/)
      const emptyState = page.locator('main').getByText(/aún no tienes progreso/i)
      await expect(hasProgress.or(emptyState)).toBeVisible()
    })
  })

  test.describe('Account Info UI', () => {
    test('displays account information section', async ({ page }) => {
      await expect(
        page.locator('main').getByText('Información de la Cuenta', {
          exact: true,
        }),
      ).toBeVisible()
    })

    test('shows all account fields', async ({ page }) => {
      await expect(page.locator('main').getByText(/^Email$/)).toBeVisible()
      await expect(page.locator('main').getByText('Email Verificado')).toBeVisible()
      await expect(page.locator('main').getByText('Fecha de Registro')).toBeVisible()
      await expect(page.locator('main').getByText(/^ID$/)).toBeVisible()
    })

    test('validates verification status display', async ({ page }) => {
      // Use exact match or specific value to avoid collision with label
      const verifiedStatus = page.locator('main').getByText(/^(Verificado|No verificado)$/)
      await expect(verifiedStatus).toBeVisible()
    })
  })

  test.describe('Dashboard Navigation', () => {
    test('displays navigation bar', async ({ page }) => {
      const nav = page.getByRole('navigation')
      await expect(nav).toBeVisible()
    })

    test('contains link to courses', async ({ page }) => {
      const coursesLink = page.getByRole('link', {
        name: /catálogo de cursos/i,
      })
      await expect(coursesLink).toBeVisible()
      await expect(coursesLink).toHaveAttribute('href', /\/dashboard\/courses/)
    })

    test('contains link to progress', async ({ page }) => {
      const progressLink = page.getByRole('link', {
        name: /mi progreso/i,
      })
      await expect(progressLink).toBeVisible()
      await expect(progressLink).toHaveAttribute('href', /\/dashboard\/progress/)
    })
  })

  test.describe('Responsive Layout', () => {
    test('renders container with proper spacing', async ({ page }) => {
      const container = page.locator('main .container').first()
      await expect(container).toBeVisible()
    })

    test('stats cards grid is responsive', async ({ page }) => {
      const grid = page.locator('main .grid').first()
      await expect(grid).toBeVisible()
    })
  })
})
