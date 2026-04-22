---
source: Context7 API + official docs
library: Playwright
package: @playwright/test
topic: Astro TypeScript Phase 3 local setup
fetched: 2026-04-22T00:00:00Z
official_docs: https://playwright.dev/docs/intro
---

## Install (pnpm)

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps
```

## Recommended `playwright.config.ts` pattern (local + CI-safe)

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: { mode: 'only-on-failure', fullPage: true },
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'pnpm astro dev --host --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Snapshot / visual testing options

- Use `await expect(page).toHaveScreenshot()` for visual comparisons.
- For explicit names: `await expect(page).toHaveScreenshot('landing.png')`.
- For full-page on assertion-level: `await expect(page).toHaveScreenshot({ fullPage: true })`.
- Baselines are stored in `<spec>.ts-snapshots/` and should be committed.
- Update baselines with:

```bash
pnpm exec playwright test --update-snapshots
```

## Caveats

- Screenshot baselines are environment-sensitive (OS/browser/rendering). Keep baseline generation and CI environment aligned.
- `baseURL` enables relative `page.goto('/path')` in tests.
