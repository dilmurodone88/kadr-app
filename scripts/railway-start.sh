#!/bin/sh
# Railway (yoki boshqa bitta-servisli PaaS) uchun ishga tushirish:
# migratsiya + seed (idempotent) + Next.js start ($PORT).
# DATABASE_URL va SESSION_SECRET Railway o'zgaruvchilaridan keladi.
set -e

: "${DATABASE_URL:?DATABASE_URL yo'q — Railway MySQL'ni ulang}"
: "${SESSION_SECRET:?SESSION_SECRET yo'q — Railway'da o'zgaruvchi qo'shing}"

echo "⏳ Prisma db push..."
npx prisma db push --skip-generate --accept-data-loss

echo "🌱 Seed (idempotent)..."
npx prisma db seed || echo "⚠️ seed o'tkazib yuborildi"

echo "🚀 Next.js start (port ${PORT:-3000})..."
exec npm run start -- -H 0.0.0.0 -p "${PORT:-3000}"
