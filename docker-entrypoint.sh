#!/bin/sh
# App konteyneri ishga tushganda: sxemani DBga yoyish + seed + start.
# DB tayyorligi compose healthcheck (depends_on: service_healthy) orqali kafolatlanadi.
set -e

echo "⏳ [1/3] Prisma sxemasini DBga yoyish (db push)..."
# --accept-data-loss yo'q: destruktiv o'zgarishda jim ma'lumot yo'qotish o'rniga xato beradi
npx prisma db push --skip-generate

echo "🌱 [2/3] Demo hisoblarni seed qilish..."
npx prisma db seed || echo "⚠️  Seed o'tkazib yuborildi (ehtimol allaqachon mavjud)"

echo "🚀 [3/3] Next.js ishga tushmoqda (port 3000)..."
exec npm run start -- -H 0.0.0.0 -p 3000
