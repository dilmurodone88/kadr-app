# Kadr Boshqaruv Tizimi

Tashkilot kadrlar boshqaruvi — buyruqlar, arizalar va GPX ish hisobotlari.
Bir-faylli HTML demodan to‘liq konteynerlashtirilgan stackga ko‘chirilgan.

## Texnologiyalar

- **Next.js 15** (App Router, server actions) + TypeScript
- **Tailwind CSS** — demo dizayn tili (IBM Plex Sans, teal `#0F6E56`)
- **Prisma 6** + **MySQL 8**
- **Docker Compose** — `mysql` + `app` + `nginx`
- **Nginx** reverse proxy → yagona kirish nuqtasi `http://localhost`

## Ishga tushirish (Docker)

Docker Desktop ishlab turganiga ishonch hosil qiling, so‘ng:

```bash
docker compose up -d --build
```

So‘ng brauzerda oching: **http://localhost**

Birinchi ishga tushishda `app` konteyneri avtomatik ravishda:
1. Prisma sxemasini MySQL’ga yoyadi (`prisma db push`),
2. Demo hisoblarni seed qiladi,
3. Next.js’ni 3000-portda ishga tushiradi (nginx 80-portdan proksilaydi).

To‘xtatish: `docker compose down` · Ma’lumot bilan birga: `docker compose down -v`

## Demo hisoblar (parol: `1234`)

| Login | Rol | F.I.O. |
|-------|-----|--------|
| `rahbar1` | Rahbar | Aziz Karimov |
| `kadr1` | Kadr bo‘limi | Dilnoza Yusupova |
| `xodim1` | Xodim (Mehnat) | Bobur Toshev |
| `xodim2` | Xodim (GPX) | Nodira Rashidova |
| `buxgalter1` | Buxgalteriya | Malika Nabieva |
| `it1` | IT bo‘limi | Sardor Aliyev |

## Rollar va imkoniyatlar

- **Rahbar** — umumiy dashboard, buyruq chiqarish (QR-imzo), ariza yozish
- **Kadr** — xodimlar boshqaruvi, buyruqlar arxivi, arizalar, GPX hisobotlar
- **Xodim** — shaxsiy obyektivka, ariza yozish, mening buyruqlarim, (GPX) ish hisobotlari
- **Buxgalteriya / IT** — o‘z bo‘limiga tushgan arizalar, ariza yozish

## Arxitektura

```
Browser → http://localhost:80 → [nginx] → [app:3000 Next.js] → [db:3306 MySQL]
                                                                     └ volume: kadr_mysql_data
```

## Loyiha tuzilishi

- `prisma/schema.prisma` — Account, Order (buyruq), Request (ariza), Report (hisobot)
- `src/app/` — App Router sahifalari (`login`, `panel/*`) va `api/health`
- `src/lib/` — prisma, session (JWT), auth, actions (server actions), labels, nav
- `src/components/` — Shell, formalar, UI primitivlar, ikonalar
- `nginx/default.conf` — reverse proxy
- `docker-compose.yml`, `Dockerfile`, `docker-entrypoint.sh`

## Lokal ishlab chiqish (Docker’siz)

Lokal MySQL kerak. `.env` da `DATABASE_URL` xostini `localhost` qiling, so‘ng:

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

## Spec

To‘liq dizayn hujjati: `docs/superpowers/specs/2026-09-10-kadr-tizimi-design.md`
