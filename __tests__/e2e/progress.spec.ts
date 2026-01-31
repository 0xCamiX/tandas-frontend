import { expect, test } from '@playwright/test'

test.describe('Progress Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/progress')
  })

  test('renders progress heading and intro copy', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /mi progreso/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByText(/consulta tus avances en cada curso/i),
    ).toBeVisible()
  })

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
