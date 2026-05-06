# Portfolio App (Astro)

This directory contains the Astro app scaffold used in phase 1.

## Setup

Requires Node.js 22+ (see `app/package.json` engines).

```sh
pnpm --dir app install
```

## Site URL configuration

`astro.config.mjs` reads `PUBLIC_SITE_URL` for deployment builds.

- Example production value: `PUBLIC_SITE_URL=https://portfolio.example.com`
- Local fallback when unset: `http://localhost:4321`

## Common commands

Run these from the repository root:

| Command | Action |
| :-- | :-- |
| `pnpm --dir app dev` | Start the dev server |
| `pnpm --dir app check` | Run Astro type/content checks |
| `pnpm --dir app test` | Run unit tests with Vitest |
| `pnpm --dir app test:e2e:install` | Install Playwright browser binaries |
| `pnpm --dir app test:e2e` | Run Playwright end-to-end tests |
| `pnpm --dir app build` | Build the production bundle |
| `pnpm --dir app preview` | Serve the built app locally |
| `pnpm --dir app lhci` | Run Lighthouse CI quality assertions |

## Container local verification

Run these from the repository root:

```sh
docker build -t portfolio-phase4:local app
docker run -d --rm --name portfolio-phase4 -p 8080:8080 portfolio-phase4:local
curl -i http://localhost:8080/healthz
curl -I http://localhost:8080/
docker image inspect portfolio-phase4:local --format='{{.Size}}'
docker stop portfolio-phase4
```
