# syntax=docker/dockerfile:1.7
# ── Kadr Tizimi — Next.js 15 + Prisma (MySQL) ───────────────────────
# Bitta "runner" image: ham "app" (start), ham "migrate" (db push + seed) service
# shu image'dan foydalanadi (buyruq compose'da almashtiriladi). To'liq node_modules —
# prisma CLI + tsx (seed) ishonchli ishlashi uchun. Non-root + tini bilan mustahkam.

FROM node:20-slim AS base
# Prisma engine uchun openssl; signal boshqaruvi uchun tini
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates tini \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ── Dependencies (barcha deps: build + prisma + tsx) ────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ── Builder (prisma generate + next build) ──────────────────────────
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ── Runner (app + migrate uchun umumiy image) ───────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Fayllarni non-root "node" foydalanuvchisiga tegishli qilib ko'chiramiz
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/templates ./templates
COPY --chown=node:node package.json next.config.mjs docker-entrypoint.sh ./
COPY --chown=node:node scripts ./scripts
RUN chmod +x docker-entrypoint.sh scripts/*.sh

USER node
EXPOSE 3000

# tini — to'g'ri signal (SIGTERM) va zombi-jarayonlarni boshqaradi
ENTRYPOINT ["/usr/bin/tini", "--"]
# app service: start (migratsiya alohida "migrate" service'da bajariladi)
CMD ["./docker-entrypoint.sh"]
