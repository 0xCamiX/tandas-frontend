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

    await expect(page).toHaveURL(/\/dashboard\/courses\/.+/)

    const enrollBtn = page.getByRole('button', {
      name: 'Inscribirme al curso',
    })
    const startBtn = page.getByRole('button', {
      name: 'Comenzar curso',
    })

    if (
      await enrollBtn.isVisible({
        timeout: 3000,
      })
    ) {
      await enrollBtn.click()
      await expect(page).toHaveURL(/\/dashboard\/courses\/.*\/.*/, {
        timeout: 15000,
      })
    } else if (
      await startBtn.isVisible({
        timeout: 3000,
      })
    ) {
      await startBtn.click()
      await expect(page).toHaveURL(/\/dashboard\/courses\/.*\/.*/, {
        timeout: 10000,
      })
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

  test.describe('Quiz Interaction', () => {
    test('can access and interact with quiz', async ({ page }) => {
      const quizTab = page.getByRole('tab', {
        name: 'Evaluación',
      })

      if (await quizTab.isVisible()) {
        await quizTab.click()

        const firstRadioGroup = page.locator('[role="radiogroup"]').first()
        await expect(firstRadioGroup).toBeVisible()

        const radioGroups = page.locator('[role="radiogroup"]')
        const count = await radioGroups.count()

        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const group = radioGroups.nth(i)
            await group.getByRole('radio').first().click({
              force: true,
            })
          }

          const submitBtn = page.getByRole('button', {
            name: /enviar respuestas/i,
          })

          await expect(submitBtn).toBeEnabled()
          await submitBtn.click()

          await expect(page.getByText(/tu puntuación/i)).toBeVisible()

          await expect(
            page.getByRole('button', {
              name: /intentar de nuevo/i,
            }),
          ).toBeVisible()
        }
      }
    })
  })
})
