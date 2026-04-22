import { expect, test, type Page } from '@playwright/test';

const visibleCardCount = async (page: Page): Promise<number> =>
  page.locator('.proj-grid .proj-card').count();

const waitForProjectFilterHydration = async (page: Page): Promise<void> => {
  await page.locator('#all').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const island = document.querySelector("astro-island[client='visible']");
    if (!island) {
      return false;
    }

    return !island.hasAttribute('ssr');
  });
  await expect(page.getByRole('button', { name: /all \(12\)/i })).toHaveAttribute('aria-pressed', 'true');
};

test('project filter buttons return expected card counts', async ({ page }) => {
  await page.goto('/');
  await waitForProjectFilterHydration(page);

  await expect(page.getByRole('button', { name: /all \(12\)/i })).toBeVisible();
  await expect.poll(async () => visibleCardCount(page)).toBe(12);

  await page.getByRole('button', { name: /^hardware$/i }).click();
  await expect.poll(async () => visibleCardCount(page)).toBe(7);

  await page.getByRole('button', { name: /^ecosystem$/i }).click();
  await expect.poll(async () => visibleCardCount(page)).toBe(5);

  await page.getByRole('button', { name: /^all 3$/i }).click();
  await expect.poll(async () => visibleCardCount(page)).toBe(1);
});

test('project filter supports keyboard activation', async ({ page }) => {
  await page.goto('/');
  await waitForProjectFilterHydration(page);

  const allButton = page.getByRole('button', { name: /all \(12\)/i });
  await allButton.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /^hardware$/i })).toBeFocused();
  await page.keyboard.press('Space');

  await expect.poll(async () => visibleCardCount(page)).toBe(7);
});
