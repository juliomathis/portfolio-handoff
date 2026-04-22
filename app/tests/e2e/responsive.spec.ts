import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 960 },
];

for (const viewport of viewports) {
  test(`homepage visual baseline at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.fonts.status === 'loaded');
    await page.locator('#all').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const island = document.querySelector("astro-island[client='visible']");
      if (!island) {
        return true;
      }

      return !island.hasAttribute('ssr');
    });
    await page.waitForTimeout(250);

    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.001,
      timeout: 15_000,
    });
  });
}
