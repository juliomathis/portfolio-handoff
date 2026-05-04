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
