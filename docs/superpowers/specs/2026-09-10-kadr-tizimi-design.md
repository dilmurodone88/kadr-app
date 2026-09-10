# Kadr Boshqaruv Tizimi — Design Spec

**Sana:** 2026-09-10
**Manba:** `kadr_tizimi_demo.html` (vanilla JS demo) → to'liq production stack
**Holat:** Avtonom ijro (foydalanuvchi 1-2 soat yo'q, ideal holatga olib kelish topshirig'i)

---

## 1. Maqsad

Mavjud bir-faylli HTML demoni (`kadr_tizimi_demo.html`) production-darajali,
konteynerlashtirilgan full-stack ilovaga aylantirish. Demoning **butun
funksionalligi va vizual identifikatsiyasi saqlanadi**, faqat arxitektura
professional stackka ko'chiriladi.

## 2. Texnologiyalar (foydalanuvchi belgilagan)

| Qatlam | Texnologiya |
|--------|-------------|
| Framework | **Next.js 15** (App Router, `output: standalone`) + TypeScript |
| UI | **Tailwind CSS v3.4** + demo dizayn tili (`/ui-ux-pro-max` bilan sayqal) |
| ORM | **Prisma 6** |
| DB | **MySQL 8** (Docker volume bilan persistent) |
| Auth | `jose` (JWT, httpOnly cookie) + `bcryptjs` (parol hash) |
| QR | `qrcode.react` (buyruq QR-imzosi, demo bilan bir xil) |
| Orkestratsiya | **Docker Compose** (mysql + app + nginx) |
| Reverse proxy | **Nginx** → `localhost:80` (yagona kirish nuqtasi) |

## 3. Domen tahlili (demodan)

### Rollar (5 ta)
- **rahbar** — direktor: dashboard, buyruq chiqarish (QR-imzo), ariza yozish
- **kadr** — HR bo'limi: xodimlar boshqaruvi, buyruqlar arxivi, arizalar, GPX hisobotlari
- **xodim** — xodim: shaxsiy obyektivka, ariza yozish, mening buyruqlarim, (GPX bo'lsa) ish hisobotlari
- **buxgalteriya** — buxgalteriya: menga yo'naltirilgan arizalar
- **it** — IT bo'lim: menga yo'naltirilgan arizalar

### "2-3 panel" talqini
Foydalanuvchi "2-3ta max panel, bitta link" dedi. Bu **3 ta panel arxetipi**
sifatida amalga oshiriladi, bittagina URL (`http://localhost`) orqali:
1. **Boshqaruv paneli** (rahbar)
2. **Kadr paneli** (kadr)
3. **Xodim/Bo'lim paneli** (xodim, buxgalteriya, it — umumiy layout, rolga qarab kontent)

Barcha 5 rol saqlanadi (domen qiymati yo'qolmasligi uchun), lekin ular 3 layout
arxetipi va bitta nginx kirish nuqtasi orqali xizmat qiladi.

### Ma'lumot modellari
- **Account**: username, password(hash), role, fio, lavozim, bolim, shartnoma?
- **Order** (buyruq): turi, employee, rahbar, izoh?, holat, sana
- **Request** (ariza): employee, bolim, turi, matn, holat, sana
- **Report** (hisobot/GPX): employee, matn, holat, sana

### Asosiy workflow'lar
1. **Login** — rol + username/parol (demo hisoblar, parol `1234`)
2. **Buyruq** — rahbar chiqaradi → QR-imzo (`BUYRUQ:id|turi|xodim|sana`)
3. **Xodim boshqaruvi** — kadr yangi xodim qo'shadi
4. **Ariza** — xodim yuboradi → bo'limga (Kadrlar/Buxgalteriya/IT) yo'naltiriladi → tasdiq/rad
5. **GPX hisobot** — GPX xodim hisobot topshiradi → kadr tasdiq/rad qiladi

## 4. Arxitektura

```
Browser → http://localhost:80
            │
         [nginx]  reverse proxy (listen 80 → app:3000)
            │
         [app]    Next.js standalone (SSR + API routes)
            │      Prisma Client
            │
         [db]     MySQL 8  ── volume: mysql_data
```

### Papka tuzilishi
```
kadr-app/
├─ docker-compose.yml
├─ .env                     # DB creds, SESSION_SECRET
├─ Dockerfile               # multi-stage Next.js standalone
├─ nginx/default.conf       # listen 80 → app:3000
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts               # 6 demo hisob
├─ src/
│  ├─ app/
│  │  ├─ login/page.tsx
│  │  ├─ (panel)/…          # rolga oid sahifalar, umumiy shell
│  │  └─ api/…              # auth, employees, orders, requests, reports
│  ├─ lib/{prisma,auth,session}.ts
│  └─ components/…
└─ …konfiguratsiya
```

## 5. Auth dizayni
- Parollar **bcrypt** bilan hash (demo `1234` seed'da hash qilinadi).
- Login muvaffaqiyatli → **JWT** (`jose`) httpOnly, SameSite=Lax cookie'da (`kadr_session`).
- `middleware.ts` himoyalangan yo'llarni tekshiradi; login yo'q bo'lsa `/login`ga.
- Har API route serverda rolni qayta tekshiradi (authorization).

## 6. API yo'llari
| Metod | Yo'l | Rol | Vazifa |
|-------|------|-----|--------|
| POST | /api/auth/login | * | Kirish |
| POST | /api/auth/logout | * | Chiqish |
| GET | /api/auth/me | auth | Joriy sessiya |
| GET/POST | /api/employees | kadr | Xodimlar ro'yxati / qo'shish |
| GET | /api/orders | rahbar,kadr,xodim | Buyruqlar (rolga qarab filtr) |
| POST | /api/orders | rahbar | Buyruq chiqarish |
| GET | /api/requests | kadr,buxgalteriya,it,xodim | Arizalar (rolga qarab) |
| POST | /api/requests | auth | Ariza yuborish |
| PATCH | /api/requests/:id | kadr,buxgalteriya,it | Tasdiq/rad |
| GET | /api/reports | kadr,xodim | GPX hisobotlar |
| POST | /api/reports | xodim(GPX) | Hisobot topshirish |
| PATCH | /api/reports/:id | kadr | Tasdiq/rad |

## 7. Dizayn tili (demodan saqlanadi, sayqallanadi)
- Font: **IBM Plex Sans**
- Ranglar: `--primary:#0F6E56` (teal), bg `#F3F4F0`, surface `#FFFFFF`,
  danger `#A32D2D`, success `#3B6D11`, warn `#854F0B`
- Radius 10px, muted enterprise/gov estetikasi
- `/ui-ux-pro-max` skill bilan: tipografiya, bo'shliq, holatlar, mikro-animatsiya,
  a11y va data-viz (rahbar dashboard) sayqallanadi.

## 8. Docker Compose
- **db** (mysql:8): `mysql_data` named volume, healthcheck, `.env` creds
- **app** (build .): `depends_on: db(healthy)`, ishga tushganda
  `prisma migrate deploy` + seed, keyin `node server.js`
- **nginx** (nginx:alpine): `ports: 80:80`, `depends_on: app`, config mount
- Named volume: `mysql_data` (DB persistensiya)

## 9. Yagona kirish nuqtasi
`http://localhost` (port 80, nginx) → butun ilova. Boshqa portlar tashqariga
ochilmaydi (app:3000 va db:3306 faqat ichki tarmoqda).

## 10. Ideal holat ta'rifi (Definition of Done)
- [ ] `docker compose up -d` → 3 konteyner sog'lom
- [ ] `http://localhost` login sahifasini ochadi
- [ ] 5 rolning har biri demo hisob bilan kiradi va o'z panelini ko'radi
- [ ] Buyruq/ariza/hisobot workflow'lari DBda saqlanadi (qayta ishga tushishdan keyin ham)
- [ ] QR-imzo ishlaydi
- [ ] MySQL ma'lumotlari volume'da saqlanadi (persistent)
- [ ] Docker daemon xatosi tuzatilgan
- [ ] `/code-review` topilmalari hal qilingan
- [ ] `/ui-ux-pro-max` dizayn qo'llangan

## 11. Qabul qilingan qarorlar (foydalanuvchi yo'qligida)
- **Barcha 5 rol saqlanadi** — kesib tashlash domen qiymatini yo'qotardi;
  "2-3 panel" 3 layout arxetipi sifatida talqin qilindi.
- **Tailwind v3.4** (v4 emas) — Docker build barqarorligi uchun.
- **JWT cookie auth** — tashqi xizmatsiz, Dockerda toza ishlaydi.
- **Seed parollari `1234`** — demo bilan mos, lekin bcrypt bilan hash qilinadi.
- Ma'lumotlar demo bilan bir xil (o'zbekcha terminologiya to'liq saqlanadi).

## 12. As-built (amalga oshirilgan holat)
- **API route'lar o'rniga server action'lar** ishlatildi (App Router idiomatikasi,
  kamroq xato yuzasi). Faqat `/api/health` route sifatida qoldi (Docker healthcheck).
- **Prisma migration o'rniga `db push`** — konteyner startida sxemani yoyadi
  (idempotent, migration tarixi shart emas). `--accept-data-loss` olib tashlandi.
- **Auth**: JWT (jose) httpOnly cookie + bcrypt. `requirePanelUser` guard barcha
  panel sahifalarini himoya qiladi; server action'lar `requireRole` bilan tekshiradi.
- **Docker daemon xatosi** tuzatildi: eskirgan AF_UNIX socket papkalari (`run`,
  `docker-secrets-engine`) rename qilinib, Docker yangi socket bilan ishga tushdi
  (factory reset qilinmadi — mavjud image/konteynerlar saqlandi).
- **Code-review** (high effort): 8 topilma, 7 tasi tuzatildi (CVE patch, forma
  reset, timezone, db push xavfsizligi, badge reuse, jadval sarlavha, auth guard);
  1 tasi (layout query efficiency) maqbul deb qoldirildi.
- **Verifikatsiya**: 3 konteyner sog'lom, login/dashboard/buyruq/QR-imzo brauzerda
  sinovdan o'tdi. Yagona kirish: `http://localhost`.
