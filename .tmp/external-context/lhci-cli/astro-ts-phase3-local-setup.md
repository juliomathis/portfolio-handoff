---
source: Context7 API + official docs
library: Lighthouse CI
package: @lhci/cli
topic: Local autorun with static dist for Astro
fetched: 2026-04-22T00:00:00Z
official_docs: https://googlechrome.github.io/lighthouse-ci/docs/configuration.html
---

## Install (pnpm)

```bash
pnpm add -D @lhci/cli
```

## Recommended `lighthouserc.json` for Astro static output

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3,
      "isSinglePageApplication": true
    },
    "assert": {
      "preset": "lighthouse:recommended"
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./.lighthouseci"
    }
  }
}
```

## Local autorun expectations

- `lhci autorun` runs `collect` + `assert` + `upload` with defaults.
- With `staticDistDir: "./dist"`, LHCI starts its own static server automatically.
- For static Astro builds, run build first:

```bash
pnpm astro build
pnpm exec lhci autorun
```

## CI/local caveats

- In `autorun`, nested child flags must use `=` form (example: `--collect.numberOfRuns=5`).
- If using a custom app server instead of static dist, use `collect.startServerCommand` + `collect.url` (not `staticDistDir`).
- `temporary-public-storage` is public and short-lived; use `filesystem` locally and `lhci` server target in long-term CI.
- CI can be noisier; increase runs and tune assertions rather than strict one-run thresholds.
