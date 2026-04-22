---
source: Context7 API + official docs
library: axe-core (Playwright adapter)
package: @axe-core/playwright
topic: Accessibility scan usage in Playwright tests
fetched: 2026-04-22T00:00:00Z
official_docs: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
---

## Install (pnpm)

```bash
pnpm add -D @axe-core/playwright
```

## Recommended usage pattern in Playwright test

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no critical a11y violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Useful scan scoping options

- Limit scope: `.include('.main-content')`
- Exclude known noisy areas: `.exclude('[data-testid="third-party-widget"]')`
- Rule subset: `.withRules(['html-lang', 'image-alt'])`
- Disable noisy rule temporarily: `.disableRules('color-contrast')`

## Caveats

- Package versioning tracks axe-core major+minor compatibility (patch can include features/fixes).
- Prefer scoping/excluding only when necessary; keep broad scans for key pages.
