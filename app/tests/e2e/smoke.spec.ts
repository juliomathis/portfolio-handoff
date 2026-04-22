import { expect, test } from '@playwright/test';

test('homepage smoke renders required structure with no console errors', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/');

  await expect(page).toHaveTitle(/Robot - Body \/ Brain \/ Rooms/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#body')).toBeVisible();
  await expect(page.locator('#brain')).toBeVisible();
  await expect(page.locator('#rooms')).toBeVisible();
  await expect(page.locator('#all')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
