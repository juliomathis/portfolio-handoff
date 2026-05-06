---
name: Design System
description: Design token and styling approach for the portfolio implementation.
type: project
---

# Design System

## Visual Direction

The UI follows an editorial triptych language:

1. Warm paper baseline with high-contrast ink text.
2. Three semantic zones (`body`, `brain`, `rooms`) with distinct accent palettes.
3. Mechanical/technical motifs (mono labels, ruled lines, card borders) over flat app-chrome minimalism.

## Foundations

1. Token-driven styling under `app/src/styles/`.
2. Shared responsive breakpoints using `@custom-media`.
3. Consistent typography and spacing primitives.

## Token and Style Layers

1. `app/src/styles/tokens.css`
   - color primitives (`--paper`, `--ink`, etc.)
   - section accents (`--body-*`, `--brain-*`, `--rooms-*`)
2. `app/src/styles/typography.css`
   - font families (`Space Grotesk`, `JetBrains Mono`, `Fraunces`)
   - base body/headline typographic rules
3. `app/src/styles/breakpoints.css`
   - `--mobile`, `--tablet`, `--desktop` custom media queries
4. `app/src/styles/phase2.css`
   - concrete component and section styling implementation
5. `app/src/styles/global.css`
   - import order and app-wide primitives (skip-link, reduced-motion handling)

## Typography Rules

1. Primary UI/headlines use `var(--font-sans)`.
2. Label/meta text uses `var(--font-mono)` with uppercase tracking.
3. Serif accent usage is intentional and limited (`.serif` helper).

## Layout and Responsiveness

1. Desktop target is the prototype-aligned 1280px composition.
2. Tablet and mobile variants preserve hierarchy before decorative detail.
3. Responsive behavior is validated through Playwright visual snapshots at 375/768/1280 widths.

## Accessibility and Motion

1. `global.css` includes skip-link focus handling.
2. Reduced-motion users are respected via `prefers-reduced-motion` overrides.
3. Contrast-sensitive section styling should remain compatible with Lighthouse and axe checks.

## Practical Rules

1. Add new tokens in token files, not inline styles.
2. Keep section styling consistent with the existing three-panel section pattern ("triptych").
3. Preserve accessibility-oriented contrast and focus visibility.
4. Keep style imports centralized in `global.css` to preserve deterministic cascade order.
5. Prefer extending existing utility/class patterns over introducing one-off naming islands.

## Change Workflow

1. Edit the smallest relevant style layer first (token -> typography/breakpoints -> component styles).
2. Run:
   - `pnpm --dir app check`
   - `pnpm --dir app test`
   - `pnpm --dir app build`
   - `pnpm --dir app test:e2e` when layout/visual behavior changes
3. If visual intent changes, review and update snapshot baselines deliberately.
