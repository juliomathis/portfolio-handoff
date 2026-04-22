# Phase 3 Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 3 testing from `IMPLEMENTATION_PLAN.md` by adding Playwright E2E coverage, Lighthouse CI assertions, and verification commands while preserving existing Vitest unit coverage.

**Architecture:** Keep unit tests in `tests/unit` and add browser-level behavior checks in `tests/e2e` with Playwright (Chromium-only). Run Lighthouse CI against `dist/` with strict thresholds matching the implementation plan. Use small, file-focused additions so each test layer stays independent and debuggable.

**Tech Stack:** Vitest, Playwright, @axe-core/playwright, Lighthouse CI (`@lhci/cli`), Astro preview build.

---

## File Structure (before tasks)

- **Modify** `app/package.json`
  - Add exact dev dependencies and scripts for e2e + lighthouse.
- **Create** `app/playwright.config.ts`
  - Single Chromium project, snapshot and server settings.
- **Create** `app/tests/e2e/smoke.spec.ts`
  - Base page load, key headings, and console error guard.
- **Create** `app/tests/e2e/responsive.spec.ts`
  - Screenshot snapshots at 375/768/1280.
- **Create** `app/tests/e2e/filter.spec.ts`
  - Filter count assertions + keyboard interaction.
- **Create** `app/tests/e2e/a11y.spec.ts`
  - Axe scan with serious/critical gate.
- **Create** `app/lighthouserc.json`
  - Perf/a11y/best-practices/seo thresholds per plan.
- **Verify only** `app/tests/unit/filter-projects.test.ts`
  - Already provides full filter-key coverage; do not churn unless gap found.

---

### Task 1: Add failing Phase-3 contract tests (RED)

**Files:**
- Modify: `app/tests/unit/components-phase2.test.ts`

- [ ] **Step 1: Add a failing test that asserts Phase-3 files and scripts exist**

```ts
it('keeps phase-3 testing files and scripts in place', () => {
  const requiredPaths = [
    'playwright.config.ts',
    'tests/e2e/smoke.spec.ts',
    'tests/e2e/responsive.spec.ts',
    'tests/e2e/filter.spec.ts',
    'tests/e2e/a11y.spec.ts',
    'lighthouserc.json',
  ];

  for (const relativePath of requiredPaths) {
    expect(existsSync(resolve(appDir, relativePath))).toBe(true);
  }

  const packageJson = JSON.parse(readFileSync(resolve(appDir, 'package.json'), 'utf8')) as {
    scripts?: Record<string, string>;
  };

  expect(packageJson.scripts?.['test:e2e']).toBe('playwright test');
  expect(packageJson.scripts?.['test:e2e:update']).toBe('playwright test --update-snapshots');
  expect(packageJson.scripts?.['test:e2e:install']).toBe('playwright install chromium');
  expect(packageJson.scripts?.lhci).toBe('lhci autorun');
});
```

- [ ] **Step 2: Run only this test to verify RED**

Run:
```bash
pnpm test -- tests/unit/components-phase2.test.ts
```

Expected: FAIL because phase-3 files/scripts do not exist yet.

---

### Task 2: Install Phase-3 dependencies and add scripts (GREEN)

**Files:**
- Modify: `app/package.json`
- Modify: `app/pnpm-lock.yaml`

- [ ] **Step 1: Install exact dev dependencies**

Run:
```bash
pnpm add -D --save-exact @playwright/test @axe-core/playwright @lhci/cli
```

- [ ] **Step 2: Add package scripts**

Add this script block (preserve existing scripts):

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:update": "playwright test --update-snapshots",
    "test:e2e:install": "playwright install chromium",
    "lhci": "lhci autorun"
  }
}
```

- [ ] **Step 3: Run unit contract test to ensure scripts are present**

Run:
```bash
pnpm test -- tests/unit/components-phase2.test.ts
```

Expected: still FAIL until phase-3 files are created (scripts should now pass in assertion).

---

### Task 3: Add Playwright config + smoke/filter/a11y specs

**Files:**
- Create: `app/playwright.config.ts`
- Create: `app/tests/e2e/smoke.spec.ts`
- Create: `app/tests/e2e/filter.spec.ts`
- Create: `app/tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Create Playwright config (Chromium + preview web server)**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

- [ ] **Step 2: Create `smoke.spec.ts`**

```ts
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
```

- [ ] **Step 3: Create `filter.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

const visibleCardCount = async (page: import('@playwright/test').Page) =>
  page.locator('.proj-grid .proj-card').count();

test('project filter buttons return expected card counts', async ({ page }) => {
  await page.goto('/');

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
  const allButton = page.getByRole('button', { name: /all \(12\)/i });
  await allButton.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect.poll(async () => visibleCardCount(page)).toBe(7);
});
```

- [ ] **Step 4: Create `a11y.spec.ts`**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage has no serious or critical accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const seriousOrCritical = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );

  expect(seriousOrCritical).toEqual([]);
});
```

- [ ] **Step 5: Install Chromium browser binary**

Run:
```bash
pnpm test:e2e:install
```

- [ ] **Step 6: Run smoke/filter/a11y specs**

Run:
```bash
pnpm test:e2e --grep "smoke|filter|accessibility"
```

Expected: PASS for the three spec groups above.

---

### Task 4: Add responsive visual spec and seed snapshots

**Files:**
- Create: `app/tests/e2e/responsive.spec.ts`
- Create: `app/tests/e2e/responsive.spec.ts-snapshots/*` (generated)

- [ ] **Step 1: Create `responsive.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 960 },
];

for (const viewport of viewports) {
  test(`homepage visual baseline at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`${viewport.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.001,
    });
  });
}
```

- [ ] **Step 2: Seed snapshots intentionally**

Run:
```bash
pnpm test:e2e:update --grep "homepage visual baseline"
```

Expected: snapshot files created under `tests/e2e/responsive.spec.ts-snapshots/`.

- [ ] **Step 3: Re-run responsive spec without update mode**

Run:
```bash
pnpm test:e2e --grep "homepage visual baseline"
```

Expected: PASS with seeded baselines.

---

### Task 5: Add Lighthouse CI config and run local autorun

**Files:**
- Create: `app/lighthouserc.json`

- [ ] **Step 1: Create `lighthouserc.json` matching plan thresholds**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./lighthouse-reports"
    }
  }
}
```

- [ ] **Step 2: Run Lighthouse autorun locally**

Run:
```bash
pnpm build && pnpm lhci
```

Expected: PASS with filesystem report output in `app/lighthouse-reports/`.

---

### Task 6: Final verification gate

**Files:**
- Verify: existing and newly added files

- [ ] **Step 1: Run full validation suite**

Run:
```bash
pnpm check && pnpm test && pnpm build && pnpm test:e2e && pnpm lhci
```

Expected:
- `astro check`: 0 errors
- `vitest`: all pass
- `astro build`: complete
- `playwright`: all e2e specs pass
- `lhci`: all assertions pass

- [ ] **Step 2: Snapshot note (no git action unless explicitly requested)**

Record that responsive snapshot baselines now exist in:

```text
app/tests/e2e/responsive.spec.ts-snapshots/
```

Do not commit unless user explicitly asks.

---

## Self-Review

- **Spec coverage:** All Phase-3 checklist items are mapped to Tasks 1–6.
- **Placeholder scan:** No TODO/TBD placeholders remain.
- **Type consistency:** Scripts, filenames, viewport set, thresholds, and counts are consistent with `IMPLEMENTATION_PLAN.md` §§11.2–11.3 and Phase-3 checklist.
