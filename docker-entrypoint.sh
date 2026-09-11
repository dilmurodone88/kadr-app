#!/bin/sh
# App konteyneri: env validatsiya (fail-fast) + Next.js start.
# Migratsiya/seed alohida "migrate" service'da (scripts/migrate.sh) bajariladi.
set -e

# ── Env validatsiya ──────────────────────────────────────────────────
: "${DATABASE_URL:?❌ DATABASE_URL o'rnatilmagan}"
: "${SESSION_SECRET:?❌ SESSION_SECRET o'rnatilmagan}"
if [ "${#SESSION_SECRET}" -lt 32 ]; then
  echo "❌ SESSION_SECRET juda qisqa (kamida 32 belgi kerak, hozir ${#SESSION_SECRET})."
  echo "   Yarating:  openssl rand -hex 32"
  exit 1
fi

echo "🚀 Next.js ishga tushmoqda (0.0.0.0:3000)..."
exec npm run start -- -H 0.0.0.0 -p 3000
