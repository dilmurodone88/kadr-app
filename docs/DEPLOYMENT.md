# Deploy — Kadr Tizimi

## Arxitektura

```
Browser → http://localhost:80 → [nginx] → [app:3000 Next.js] → [db:3306 MySQL]
                                                                   └ volume: kadr_mysql_data

Ishga tushish oqimi:
  db (healthy) → migrate (bir marta: db push + seed) → app → nginx
```

- **db** — MySQL 8, persistent volume (`kadr_mysql_data`).
- **migrate** — bir martalik service: Prisma sxemasini yoyadi + seed qiladi, so‘ng chiqadi. App undan keyin (`service_completed_successfully`) ishga tushadi — migratsiya bilan poyga bo‘lmaydi.
- **app** — Next.js (non-root, tini bilan), faqat serverni ishga tushiradi.
- **nginx** — reverse proxy, yagona kirish nuqtasi, xavfsizlik sarlavhalari + rate-limit.

## Talablar

- Docker Desktop / Docker Engine + Compose v2

## Ishga tushirish

```bash
cp .env.example .env
# .env ni tahrirlang: parollar + SESSION_SECRET (openssl rand -hex 32)
docker compose up -d --build
```

Ochish: **http://localhost**

`make` yordamchilari (ixtiyoriy):

```bash
make up       # ko'tarish
make logs     # loglar
make ps       # holat
make seed     # seed'ni qayta ishga tushirish
make health   # health tekshiruvi
make down     # to'xtatish
make reset    # HAMMANI (DB volume bilan) o'chirib qayta ko'tarish — ma'lumot o'chadi
```

## Muhit o'zgaruvchilari

| O'zgaruvchi | Tavsif |
|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root paroli |
| `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` | DB nomi va app foydalanuvchisi |
| `DATABASE_URL` | `mysql://user:pass@db:3306/kadr_db` (konteynerda xost = `db`) |
| `SESSION_SECRET` | JWT kaliti — **kamida 32 belgi** (`openssl rand -hex 32`) |
| `FORCE_INSECURE_COOKIE` | `1` = HTTP (TLS yo'q); HTTPS bo'lsa `0` qiling |

App ishga tushishda `DATABASE_URL` va `SESSION_SECRET` mavjudligini va uzunligini tekshiradi (fail-fast).

## Xavfsizlik (o'rnatilgan)

- Non-root konteyner (`node`), `no-new-privileges`, tini (signal boshqaruvi).
- nginx: `server_tokens off`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Rate-limit: `/login` — 10 so‘rov/daqiqa; API/umumiy — mo‘tadil.
- Sirlar image'ga tushmaydi (`.dockerignore` da `.env` bloklangan).
- Resurs cheklovlari + log rotatsiya (10MB × 3).

## Production (internetga chiqarish)

1. **TLS majburiy**: nginx oldiga sertifikat (Let's Encrypt) qo‘ying yoki 443'ni sozlang.
2. `.env` da `FORCE_INSECURE_COOKIE=0` (Secure cookie yoqiladi).
3. Kuchli, tasodifiy `SESSION_SECRET` va DB parollari.
4. `add_header Strict-Transport-Security` ni HTTPS bo‘lganda qo‘shing.

## CI

`.github/workflows/ci.yml` — har push/PR da: typecheck (`tsc --noEmit`), lint, `next build`, Docker image build.

## E-IMZO (kelajakdagi integratsiya)

Rahbar tasdiqlashida elektron raqamli imzo — ikki rejim:

- `EIMZO_MODE=server` — Node lokal E-IMZO (CAPIWS `127.0.0.1:64443`) bilan (Windows/desktop deploy).
- `EIMZO_MODE=client` — foydalanuvchi brauzeri o‘z E-IMZO'si bilan; serverga faqat tayyor PKCS7 keladi (remote Linux deploy uchun mos).

To‘liq spetsifikatsiya loyiha rejasida.
