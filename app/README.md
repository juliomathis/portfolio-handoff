# Portfolio App (Astro)

This directory contains the Astro app scaffold used in phase 1.

## Setup

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
| `pnpm --dir app build` | Build the production bundle |
