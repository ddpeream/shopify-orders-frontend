import { expect, test } from '@playwright/test'

test('opens the configured frontend shell', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboard operativo' })).toBeVisible()
})
