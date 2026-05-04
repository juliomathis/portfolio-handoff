# Phase 4 Containerization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production-grade container runtime assets for the Astro app (`Dockerfile`, `nginx.conf`, `.dockerignore`) and verify local container readiness (build/run/health/size) before Phase 5.

**Architecture:** Use a multi-stage Docker build: Node builder stage compiles Astro static output (`dist/`), nginx runtime stage serves static files on port `8080` as non-root. Runtime behavior is explicit in repo-owned `nginx.conf` with cache policy, baseline security headers, and `/healthz` endpoint. Validation combines existing app checks/tests with container-specific smoke and image-size gates.

**Tech Stack:** Docker (build + run), nginx:alpine, Astro static build, pnpm, curl

---

## File Map (lock boundaries first)

### Create
- `app/.dockerignore` — minimize Docker build context size/noise
- `app/Dockerfile` — multi-stage build and hardened runtime image
- `app/nginx.conf` — runtime server policy (cache + security + health)

### Modify
- `app/README.md` — local container build/run/verification commands

### Verify against
- `app/package.json` (scripts + Node engine)
- `app/astro.config.mjs` (site/runtime assumptions)
- `IMPLEMENTATION_PLAN.md` §7.1–7.3 and §16 Phase 4 checklist
- `AGENTS.md` (Phase scope and validation command baseline)

---

### Task 1: Add build/runtime container scaffolding

**Files:**
- Create: `app/.dockerignore`
- Create: `app/Dockerfile`
- Verify: `app/package.json`

- [ ] **Step 1: Create `.dockerignore` to keep context tight**

```dockerignore
node_modules
dist
.astro
.git
.github
docs
.opencode
.tmp
test-results
playwright-report
lighthouse-reports
.lighthouseci
coverage
*.log
```

- [ ] **Step 2: Create multi-stage `Dockerfile`**

```dockerfile
# ---------- build stage ----------
FROM node:22-alpine AS build
WORKDIR /src

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate \
  && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---------- runtime stage ----------
FROM nginx:1.27-alpine AS runtime

RUN addgroup -S app && adduser -S app -G app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:8080/healthz || exit 1

USER app
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: Build image to verify Dockerfile baseline**

Run: `docker build -t portfolio-phase4:local app`

Expected:
- Build exits `0`
- Final stage image is produced

- [ ] **Step 4: Commit Task 1**

```bash
git add app/.dockerignore app/Dockerfile
git commit -m "feat(phase4): add multi-stage container build scaffold"
```

---

### Task 2: Add nginx runtime policy (cache + security + health)

**Files:**
- Create: `app/nginx.conf`
- Verify: `app/Dockerfile`

- [ ] **Step 1: Create `app/nginx.conf`**

```nginx
worker_processes auto;
pid /tmp/nginx.pid;

events { worker_connections 1024; }

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  client_body_temp_path /tmp/client_body;
  proxy_temp_path /tmp/proxy;
  fastcgi_temp_path /tmp/fastcgi;
  uwsgi_temp_path /tmp/uwsgi;
  scgi_temp_path /tmp/scgi;

  sendfile on;
  tcp_nopush on;
  server_tokens off;

  gzip on;
  gzip_vary on;
  gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;
  gzip_min_length 256;

  server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    location /_astro/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
      try_files $uri =404;
    }

    location ~* \.(css|js|woff2?|svg|png|jpg|webp|avif)$ {
      expires 7d;
      add_header Cache-Control "public";
    }

    location / {
      add_header Cache-Control "no-cache";
      try_files $uri $uri/ $uri.html =404;
    }

    location = /healthz {
      access_log off;
      add_header Content-Type text/plain;
      return 200 "ok\n";
    }
  }
}
```

- [ ] **Step 2: Rebuild image with nginx config included**

Run: `docker build -t portfolio-phase4:local app`

Expected:
- Build exits `0`
- No nginx config copy errors

- [ ] **Step 3: Start container and verify health endpoint**

Run:

```bash
docker run -d --rm --name portfolio-phase4 -p 8080:8080 portfolio-phase4:local
curl -i http://localhost:8080/healthz
```

Expected:
- HTTP `200 OK`
- Body contains `ok`

- [ ] **Step 4: Verify baseline response headers on `/`**

Run: `curl -I http://localhost:8080/`

Expected headers include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

- [ ] **Step 5: Stop test container and commit Task 2**

```bash
docker stop portfolio-phase4
git add app/nginx.conf
git commit -m "feat(phase4): add nginx runtime cache and security policy"
```

---

### Task 3: Run Phase 4 verification gates and image-size check

**Files:**
- Verify only (no file creation expected)

- [ ] **Step 1: Run app quality gates from repo root**

Run:

```bash
pnpm --dir app check
pnpm --dir app test
pnpm --dir app test:e2e
pnpm --dir app build
```

Expected:
- All commands exit `0`

- [ ] **Step 2: Rebuild the final image for measurement**

Run: `docker build -t portfolio-phase4:local app`

- [ ] **Step 3: Validate image-size target (<50 MB)**

Run:

```bash
docker image inspect portfolio-phase4:local --format='{{.Size}}'
```

Expected:
- Byte size corresponds to `< 52428800` (50 MB)

- [ ] **Step 4: Verify local runtime smoke check on containerized app**

Run:

```bash
docker run -d --rm --name portfolio-phase4 -p 8080:8080 portfolio-phase4:local
curl -I http://localhost:8080
docker stop portfolio-phase4
```

Expected:
- Root endpoint returns `200 OK`

- [ ] **Step 5: Confirm verification-only task leaves repo clean**

Run: `git status --short`

Expected:
- No new tracked file changes introduced by validation commands

---

### Task 4: Document local container workflow for maintainers

**Files:**
- Modify: `app/README.md`

- [ ] **Step 1: Add a "Container local verification" section**

Include commands for:
- `docker build -t portfolio-phase4:local app`
- `docker run -d --rm --name portfolio-phase4 -p 8080:8080 portfolio-phase4:local`
- `curl -i http://localhost:8080/healthz`
- `curl -I http://localhost:8080/`
- `docker image inspect portfolio-phase4:local --format='{{.Size}}'`
- `docker stop portfolio-phase4`

- [ ] **Step 2: Commit Task 4**

```bash
git add app/README.md
git commit -m "docs(phase4): add local container verification runbook"
```

---

## Testing Strategy

- [ ] Existing quality gates stay green: `check`, `test`, `test:e2e`, `build`
- [ ] Container health endpoint returns `200`
- [ ] Security headers present on root response
- [ ] Runtime image size under 50 MB
- [ ] Manual smoke test confirms container serves app at `http://localhost:8080`

---

## Scope Guardrails

- Do **not** add `infra/`, `k8s/`, or `.github/workflows/` in this phase.
- Do **not** change React-island architecture (single island remains `ProjectFilter.tsx`).
- Keep Phase 4 strictly to containerization assets and local verification.

---

## Total Estimate

**Time:** 2.5–4 hours  
**Complexity:** Medium

## Notes

- Source-of-truth constraints: `IMPLEMENTATION_PLAN.md` §7 and §16 Phase 4 checklist.
- Runtime choice is fixed by ADR 006 (`nginx:alpine`).
- Use immutable, reproducible container build behavior (pinned base tags + `pnpm --frozen-lockfile`).
