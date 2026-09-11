#!/bin/sh
# Bir martalik "migrate" service: Prisma sxemasini DBga yoyish + seed.
# Compose'da app service'i shu bajarilib bo'lgach (service_completed_successfully) ishga tushadi.
set -e

: "${DATABASE_URL:?❌ DATABASE_URL o'rnatilmagan}"

echo "⏳ [1/2] Prisma sxemasini DBga yoyish (db push)..."
# --accept-data-loss YO'Q: destruktiv o'zgarishda jim ma'lumot yo'qotmaydi, xato beradi.
npx prisma db push --skip-generate

echo "🌱 [2/2] Seed (idempotent — mavjud ma'lumotga tegmaydi)..."
npx prisma db seed

echo "✅ Migratsiya + seed tugadi."
