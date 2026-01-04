import { expect, test } from '@playwright/test'

test.describe('Modules Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/courses')

    await page
      .getByRole('link', {
        name: /ver curso/i,
      })
      .first()
      .click()

    const enrollBtn = page.getByRole('button', {
      name: /inscribirme/i,
    })

    if (await enrollBtn.isVisible()) {
      await enrollBtn.click()
    } else {
      await page
        .getByRole('link', {
          name: /comenzar|continuar/i,
        })
        .click()
    }
  })

  test.describe('Layout & Navigation', () => {
    test('displays navigation header correctly', async ({ page }) => {
      const backButton = page.getByRole('link', {
        name: /volver al curso/i,
      })
      await expect(backButton).toBeVisible()

      const nextButton = page.getByRole('button', {
        name: /siguiente.*módulo/i,
      })
      if (await nextButton.isVisible()) {
        await expect(nextButton).toBeEnabled()
      }
    })

    test('displays main lesson metadata', async ({ page }) => {
      await expect(page.getByText(/nivel:/i)).toBeVisible()
      await expect(page.getByText(/orden:/i)).toBeVisible()
      await expect(page.locator('main h1, main .text-3xl').first()).toBeVisible()
    })
  })

  test.describe('Video Player Section', () => {
    test('tabs navigation works', async ({ page }) => {
      const tabs = page.locator('[role="tablist"]')
      await expect(tabs).toBeVisible()

      const videoTab = tabs.getByRole('tab', {
        name: 'Video',
      })
      const contentTab = tabs.getByRole('tab', {
        name: 'Contenido',
      })

      await expect(contentTab).toBeVisible()

      if (await videoTab.isVisible()) {
        await videoTab.click()
        await expect(page.locator('.aspect-video')).toBeVisible()
      }

      await contentTab.click()
      await expect(page.locator('.prose')).toBeVisible()
    })

    test('video player is present when available', async ({ page }) => {
      const videoTab = page.getByRole('tab', {
        name: 'Video',
      })

      if (await videoTab.isVisible()) {
        await videoTab.click()
        const videoWrapper = page
          .locator('.aspect-video, iframe[src*="youtube"], iframe[src*="vimeo"]')
          .first()
        await expect(videoWrapper).toBeVisible()
      }
    })

    test('video details section is visible', async ({ page }) => {
      const videoTab = page.getByRole('tab', {
        name: 'Video',
      })

      if (await videoTab.isVisible()) {
        await videoTab.click()
        await expect(page.getByText(/detalles del video/i)).toBeVisible()
      }
    })
  })

  test.describe('Resources & Offline Content', () => {
    test('download buttons are present when resources exist', async ({ page }) => {
      const resourcesSection = page.getByText(/recursos complementarios/i)

      if (await resourcesSection.isVisible()) {
        const viewResourceBtn = page
          .getByRole('link', {
            name: /ver recurso/i,
          })
          .first()
        await expect(viewResourceBtn).toBeVisible()
        await expect(viewResourceBtn).toHaveAttribute('target', '_blank')
      }
    })

    test('offline content download options', async ({ page }) => {
      const offlineSection = page.getByText(/contenido disponible sin conexión/i)

      if (await offlineSection.isVisible()) {
        const downloadButtons = page.getByRole('link', {
          name: /descargar/i,
        })
        expect(await downloadButtons.count()).toBeGreaterThanOrEqual(1)
      }
    })
  })

  test.describe('Sidebar & Curriculum', () => {
    test('displays sidebar with course content', async ({ page }) => {
      const sidebar = page.locator('aside, .sticky').filter({
        hasText: /contenido del curso/i,
      })
      await expect(sidebar).toBeVisible()
    })

    test('displays module summary info', async ({ page }) => {
      await expect(page.getByText(/resumen del módulo/i)).toBeVisible()
      await expect(page.getByText(/curso/i)).toBeVisible()
    })

    test('can navigate to another module via sidebar', async ({ page }) => {
      const moduleLinks = page.locator('aside a, .sticky a').filter({
        has: page.locator('span'),
      })
      const count = await moduleLinks.count()

      if (count > 1) {
        const secondModule = moduleLinks.nth(1)
        await secondModule.click()
        await expect(page).toHaveURL(/\/dashboard\/courses\/.*\/.*/)
      }
    })
  })

  test.describe('Quiz Interaction', () => {
    test('can access and interact with quiz', async ({ page }) => {
      const quizTab = page.getByRole('tab', {
        name: 'Evaluación',
      })

      if ((await quizTab.isVisible()) && (await quizTab.isEnabled())) {
        await quizTab.click()

        const radioGroup = page.locator('[role="radiogroup"]').first()
        if (await radioGroup.isVisible()) {
          const firstOption = radioGroup.getByRole('radio').first()
          await firstOption.click({
            force: true,
          })
          await expect(firstOption).toBeChecked()

          const submitBtn = page.getByRole('button', {
            name: /enviar respuestas/i,
          })
          await expect(submitBtn).toBeEnabled()
          await submitBtn.click()

          await expect(page.getByText(/tu puntuación/i)).toBeVisible()
        }
      }
    })
  })
})
