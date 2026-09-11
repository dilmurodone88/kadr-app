#!/bin/sh
# App konteyneri entrypoint.
# - Lokal (docker-compose): migratsiya/seed alohida "migrate" service'da bajariladi,
#   bu yerda faqat env validatsiya + Next.js start (port 3000).
# - Railway (yoki boshqa bitta-servisli PaaS): alohida migrate service yo'q, shuning
#   uchun bu yerda idempotent db push + seed bajariladi va $PORT'ga bog'lanadi.
set -e

# ── Env validatsiya (fail-fast) ──────────────────────────────────────
: "${DATABASE_URL:?❌ DATABASE_URL o'rnatilmagan}"
: "${SESSION_SECRET:?❌ SESSION_SECRET o'rnatilmagan}"
if [ "${#SESSION_SECRET}" -lt 32 ]; then
  echo "❌ SESSION_SECRET juda qisqa (kamida 32 belgi kerak, hozir ${#SESSION_SECRET})."
  echo "   Yarating:  openssl rand -hex 32"
  exit 1
fi

PORT="${PORT:-3000}"

# ── Railway'da migratsiya + seed (lokalda RAILWAY_* bo'lmaydi → o'tkazib yuboriladi) ──
if [ -n "$RAILWAY_ENVIRONMENT_NAME" ] || [ -n "$RAILWAY_PROJECT_ID" ] || [ -n "$RAILWAY_SERVICE_ID" ]; then
  echo "🚉 Railway aniqlandi — migratsiya + seed bajarilmoqda..."
  echo "⏳ Prisma db push..."
  npx prisma db push --skip-generate --accept-data-loss
  echo "🌱 Seed (idempotent)..."
  npx prisma db seed || echo "⚠️ seed o'tkazib yuborildi"
fi

echo "🚀 Next.js ishga tushmoqda (0.0.0.0:${PORT})..."
exec npm run start -- -H 0.0.0.0 -p "${PORT}"
