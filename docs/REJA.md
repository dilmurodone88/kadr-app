# Kadr Boshqaruv Tizimi — IDEAL REJA (4 modul + E-IMZO)

> Sintez: 5 parallel dizayn (sxema, skelet, formalar, UI, E-IMZO) + 3 adversarial tanqid
> (xavfsizlik, O'zR muvofiqlik, izchillik) asosida. Ziddiyatlar hal qilingan, xavfsizlik
> topilmalari singdirilgan.

---

## 0. Asosiy me'moriy qarorlar (ziddiyatlar hal qilindi)

Dizaynlar orasidagi ziddiyatlar quyidagicha yechildi (izchillik tanqidi tavsiyasi asosida):

| # | Qaror | Sabab |
|---|---|---|
| **Q1** | **`Account` saqlanadi** (User/Employee/Anketa 3-ga bo'linmaydi *hozircha*). Anketa kengaytiriladi + `Organization`, `Document`, `Signature`, `AuditLog` qo'shiladi. | 3-way normalizatsiya 1 tashkilot·5 rol uchun over-engineering; formalar/UI/E-IMZO dizaynlari `Account`ga tayanadi. Employee ajratish — **keyingi faza**. |
| **Q2** | **Yagona o'zbekcha `Holat` enum** (imzoli hujjatlar) + **alohida `ReviewStatus`** (arizalar/hisobotlar). Tranzient imzo fazalari (IMZOLANMOQDA/IMZO_XATO) — **faqat frontend**, DBga yozilmaydi. | 4 dizaynda 4 xil enum edi; tranzient holatni DBga muzlatish hujjatni "qotirib" qo'yadi. |
| **Q3** | **Challenge YO'Q**; imzo payloadi = **kanonik JCS manifest** (ichida muzlatilgan .docx `docxHash`). "Generate once, freeze". | Tashqi login yo'q; .docx deterministik emas — bir marta yaratib muzlatiladi. |
| **Q4** | **Bitta `Organization` yozuvi** (rekvizitlar koddan ko'chadi). `organizationId` har modelga tarqatilmaydi — multi-tenant keyingi faza. | Hozir 1 tashkilot; har query'ga org-scope ballast. |
| **Q5** | **Greenfield migratsiya** (`prisma migrate dev --name init`). Real prod ma'lumot yo'q. | `prisma/migrations/` yo'q, faqat seed demo. |
| **Q6** | Imzo egasi asosan **rahbar shaxsiy PINFL** kaliti bilan bog'lanadi (STIR ixtiyoriy). | Rahbar odatda jismoniy shaxs (PINFL) kaliti bilan imzolaydi; "faqat STIR" ko'p holatda bloklaydi. |
| **Q7** | **Ikki tomonlama imzo**: shartnoma = rahbar(ish beruvchi) + xodim; buyruq = rahbar + xodim **tanishtirish** imzosi. `@@unique([documentId, signerRole])`. | O'zR MK: shartnoma ikki tomon imzolaydi; buyruq bilan xodim imzo qo'yib tanishtiriladi. |

### Xavfsizlik majburiyatlari (fail-closed, chetlab o'tilmaydi)

| # | Talab |
|---|---|
| **X1** | **CA ishonch zanjiri MAJBURIY** (E-IMZO/DShM root+intermediate). Aks holda soxta sertifikatga rahbar PINFL'ini qo'yib spoofing mumkin. Prodda o'chirilsa — dastur ishga tushmasin (`env.ts` fail-fast). |
| **X2** | **O'zDSt 1092/1106 (GOST) haqiqati**: real E-IMZO imzosi sha256/RSA emas. pkijs/WebCrypto uni tekshira olmaydi. Verifikatsiya milliy kripto orqali (E-IMZO verify / GOST lib) — hash algoritmga qarab (`algo:` prefiks). Bu **1-raqamli ochiq savol** (7-bo'lim). |
| **X3** | `verified=false` imzo **HECH QACHON** hujjatni IMZOLANGAN qilmaydi. `EIMZO_ALLOW_UNVERIFIED`/`VERIFY_CHAIN=0` prodda bootni bloklaydi. "unverified-bypass" yo'l yo'q. |
| **X4** | **PII himoyasi**: PINFL/passport uchun qidiruv — keyed HMAC blind-index; asl qiymat AES-GCM shifrlangan. Skanlar public emas — auth+RBAC+owner stream orqali. `/verify` `?h=` majburiy (enumeratsiyaga qarshi). |
| **X5** | **expectedSigner** faqat server tomon (Organization/tayinlangan rahbar profili)dan; hujjat yaratuvchi (kadr) belgilay olmaydi. |
| **X6** | `relationMode = "foreignKeys"`; `Signature`/`AuditLog`/`Document` — `onDelete: Restrict` (o'chirilmaydi, faqat BEKOR). AuditLog — append-only + `prevHash` (hash-chain, buzilish aniqlanadi). |
| **X7** | RBAC default-deny; owner-scope alohida action nomi (`document:read:own` ≠ `:all`); har Prisma so'rovida org-scope. Sign/download route'da `requireRole` + owner tekshiruvi. Replay: `pkcs7Sha256 @unique` + atomik status o'tishi (`WHERE holat='TASDIQ_KUTILMOQDA'`). |

---

## 1. Ideal Prisma sxemasi (yakuniy, mustahkamlangan)

```prisma
generator client { provider = "prisma-client-js" }
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "foreignKeys"   // X6: DB-level butunlik
}

// ── ENUMLAR ──
enum Role { rahbar kadr xodim buxgalteriya it }
enum Contract { MEHNAT GPX }
enum UserStatus { FAOL BLOKLANGAN ARXIV }

/// Imzoli hujjatlar holati (Q2). Tranzient fazalar bu yerda YO'Q (frontend).
enum Holat { LOYIHA TASDIQ_KUTILMOQDA IMZOLANGAN RAD_ETILDI BEKOR }
/// Imzosiz workflow (ariza/hisobot)
enum ReviewStatus { KORIB_CHIQILMOQDA TASDIQLANDI RAD_ETILDI }
enum DocKategoriya { MALUMOTNOMA SHARTNOMA BUYRUQ }
enum SignerRole { ISH_BERUVCHI XODIM }          // Q7 ikki tomonlama
enum SignMode { SERVER CLIENT }
enum AuditAction { LOGIN LOGIN_FAILED LOGOUT PAROL_OZGARDI CREATE UPDATE
  DOC_YARATILDI DOC_YUBORILDI DOC_IMZOLANDI DOC_IMZO_RAD DOC_BEKOR STATUS_OZGARDI ROL_OZGARDI }

// ── TASHKILOT (bitta yozuv, Q4) ──
model Organization {
  id            String  @id @default(cuid())
  nomi          String
  nomiKirill    String?
  stir          String  @db.VarChar(9)
  manzil        String?
  telefon       String?
  direktorFio   String?
  direktorPinflBidx String? @db.VarChar(64)   // X4: blind-index (HMAC) qidiruv uchun
  direktorPinflEnc  String? @db.Text          // X4: AES-GCM shifrlangan
  huquqshunosFio String?
  kadrMenejerFio String?
  bankNomi      String?
  bankHisob     String? @db.VarChar(24)
  bankMfo       String? @db.VarChar(5)
  minIshHaqi    Decimal? @db.Decimal(15,2)     // yiliga o'zgaradi — sozlamada
  logo          Bytes?  @db.MediumBlob
  blankHeader   String? @db.Text
  blankFooter   String? @db.Text
  updatedAt     DateTime @updatedAt
  @@map("tashkilot")
}

// ── LOGIN / RBAC (Account saqlanadi, Q1) ──
model Account {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  role      Role
  status    UserStatus @default(FAOL)
  fio       String
  lavozim   String
  bolim     String
  shartnoma Contract?
  pinflBidx String?  @db.VarChar(64)  // X4 (rahbar imzo bog'lash uchun ham)
  // Parol siyosati / sessiya (yengil revoke)
  mustChangePassword Boolean @default(true)
  sessionVersion     Int     @default(0)   // JWT ichida "v"; +1 => barcha eski token yaroqsiz
  failedLoginCount   Int     @default(0)
  lockedUntil        DateTime?
  passwordChangedAt  DateTime?
  createdAt DateTime @default(now())

  anketa    Anketa?
  orders    Order[]
  requests  Request[]
  reports   Report[]
  createdDocuments Document[] @relation("DocCreatedBy")
  signatures Signature[]
  @@map("accounts")
}

// ── ANKETA (yagona manba, kengaytirilgan) ──
model Anketa {
  id             String   @id @default(cuid())
  account        Account? @relation(fields: [accountId], references: [id], onDelete: SetNull)
  accountId      String?  @unique
  status         String   @default("QORALAMA")  // QORALAMA | TOLIQ | ARXIV

  familiya       String   @default("")
  ism            String   @default("")
  otasiIsmi      String   @default("")            // (D3 "sharif" — nom birlashtirildi)
  fio            String   @default("")            // derived, qidiruv
  jinsi          String?
  tugilganSana   String?                          // yyyy-mm-dd (forma), konvertatsiya action'da
  tugilganJoy    String?
  millati        String?
  fuqaroligi     String?  @default("O'zbekiston")

  malumoti       String?
  mutaxassisligi String?
  bitirganOquv   String?
  bitirganYil    Int?
  diplomRaqam    String?

  oilaviyHolati  String?
  farzandlarSoni Int?
  manzilDoimiy   String?  @db.Text
  manzilFaktik   String?  @db.Text
  telefon        String?  @db.VarChar(20)
  email          String?

  // PII — X4: blind-index (qidiruv/unique) + shifrlangan asl
  pinflBidx      String?  @db.VarChar(64)
  pinflEnc       String?  @db.Text
  passportSeriya String?  @db.VarChar(2)
  passportRaqam  String?  @db.VarChar(7)
  passportBeruvchi String?
  passportSana   String?
  kartaEnc       String?  @db.Text
  bankNomi       String?
  hisobRaqam     String?  @db.VarChar(20)
  inps           String?  @db.VarChar(14)
  harbiyHolati   String?

  qoshimcha      String?  @db.Text
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  mehnatFaoliyati MehnatFaoliyati[]   // strukturaviy mehnat daftarchasi
  documentsAsSubject Document[] @relation("DocSubjectAnketa")
  @@index([pinflBidx])
  @@index([fio])
  @@map("anketalar")
}

/// Mehnat daftarchasi — strukturaviy (erkin matn emas; staj/hisobot uchun)
model MehnatFaoliyati {
  id            String  @id @default(cuid())
  anketa        Anketa  @relation(fields: [anketaId], references: [id], onDelete: Cascade)
  anketaId      String
  tashkilotNomi String
  tashkilotStir String? @db.VarChar(9)
  lavozim       String
  qabulSana     String
  boshatishSana String?
  buyruqRaqami  String?
  boshatishAsos String?
  @@index([anketaId])
  @@map("mehnat_faoliyati")
}

// ── HUJJAT ARXIVI (immutable, freeze-once) ──
model Document {
  id            String   @id @default(cuid())
  kategoriya    DocKategoriya
  templateId    String
  templateVersion String @default("1")
  title         String
  docNumber     String?
  year          Int
  holat         Holat    @default(LOYIHA)

  // Subyekt (biri to'ladi) — nomzod (Anketa) yoki xodim (Account)
  subjectAccount   Account? @relation("DocSubjectAccount", fields: [subjectAccountId], references: [id], onDelete: Restrict)
  subjectAccountId String?
  subjectAnketa    Anketa?  @relation("DocSubjectAnketa", fields: [subjectAnketaId], references: [id], onDelete: Restrict)
  subjectAnketaId  String?

  valuesSnapshot Json                       // imzo paytidagi qiymatlar (immutable)
  signManifest  String?  @db.Text           // muzlatilgan kanonik JCS (imzo payloadi)
  expectedSignerId String?                  // X5: server belgilaydi (rahbar Account.id)
  storageKey    String?                     // storage/<yil>/<id>.docx (baytlar muzlatilgan)
  docxHash      String?  @db.VarChar(80)    // algo:hex (X2)
  mimeType      String   @default("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  supersedesId  String?                     // yangi versiya bo'lsa eskiga havola
  saqlashMuddatiYil Int?                    // 75 | 50 | 5 (arxiv nomenklatura)

  createdBy     Account  @relation("DocCreatedBy", fields: [createdById], references: [id], onDelete: Restrict)
  createdById   String
  issuedAt      DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  signatures    Signature[]
  contract      Contract2?
  order         Order?
  @@unique([kategoriya, templateId, year, docNumber])   // raqam takrorlanmasin (scope=templateId)
  @@index([holat])
  @@index([subjectAccountId])
  @@index([subjectAnketaId])
  @@map("hujjatlar")
}

/// Atomik raqamlash — saqlash guruhiga qarab (U6: -ш/т 75y, -б 5y alohida seriya)
model DocumentSequence {
  scope      String   @id     // "SHARTNOMA-MEHNAT" | "BUYRUQ-QABUL" | "BUYRUQ-TATIL" ...
  year       Int
  lastNumber Int      @default(0)
  updatedAt  DateTime @updatedAt
  @@map("hujjat_raqamlari")
}

// ── E-IMZO IMZOSI (per signerRole, Q7) ──
model Signature {
  id            String   @id @default(cuid())
  document      Document @relation(fields: [documentId], references: [id], onDelete: Restrict)  // X6
  documentId    String
  signer        Account? @relation(fields: [signerAccountId], references: [id], onDelete: SetNull)
  signerAccountId String?
  signerRole    SignerRole
  mode          SignMode
  pkcs7         String   @db.LongText          // dalil
  pkcs7Sha256   String   @unique               // X7 replay
  signedHash    String   @db.VarChar(80)       // algo:hex — imzolangan kanonik (X2)
  signerPinflBidx String? @db.VarChar(64)      // blind-index (ko'rsatishda maskalanadi)
  signerCn      String?
  certSerial    String?
  certValidTo   DateTime?
  chainVerified Boolean  @default(false)       // X1
  revocationChecked Boolean @default(false)    // U8
  verified      Boolean  @default(false)       // X3: true bo'lmasa IMZOLANGAN emas
  signedAt      DateTime @default(now())
  ipHmac        String?                        // X (keyed HMAC, xom IP emas)
  @@unique([documentId, signerRole])           // Q7: rol bo'yicha bitta, ikkala tomon mumkin
  @@index([documentId])
  @@map("imzolar")
}

// ── SHARTNOMA / BUYRUQ ──
model Contract2 {
  id            String   @id @default(cuid())
  account       Account? @relation(fields: [accountId], references: [id], onDelete: SetNull)
  accountId     String?
  type          Contract
  contractNumber String
  startDate     String?
  endDate       String?
  salary        Decimal? @db.Decimal(15,2)
  holat         Holat    @default(LOYIHA)
  document      Document? @relation(fields: [documentId], references: [id])
  documentId    String?  @unique
  createdAt     DateTime @default(now())
  @@unique([contractNumber])
  @@map("shartnomalar")
}

model Order {
  id            String   @id @default(cuid())
  employee      Account? @relation(fields: [employeeId], references: [id], onDelete: SetNull)
  employeeId    String?
  subjectAnketaId String?               // nomzod ishga qabuli uchun (U4.1)
  type          String
  orderNumber   String
  effectiveDate String?
  reason        String?  @db.Text
  payload       Json?
  holat         Holat    @default(LOYIHA)
  document      Document? @relation(fields: [documentId], references: [id])
  documentId    String?  @unique
  createdAt     DateTime @default(now())
  @@unique([orderNumber])
  @@index([employeeId])
  @@map("buyruqlar")
}

// ── ARIZA / HISOBOT (imzosiz) ──
model Request {
  id         String   @id @default(cuid())
  employee   Account  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  employeeId String
  bolim      String
  turi       String
  matn       String   @db.Text
  holat      ReviewStatus @default(KORIB_CHIQILMOQDA)
  reviewedById String?
  reviewedAt DateTime?
  sana       DateTime @default(now())
  @@index([employeeId]); @@index([bolim])
  @@map("requests")
}

model Report {
  id         String   @id @default(cuid())
  employee   Account  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  employeeId String
  davrBoshi  String?
  davrOxiri  String?
  matn       String   @db.Text
  holat      ReviewStatus @default(KORIB_CHIQILMOQDA)
  sana       DateTime @default(now())
  @@index([employeeId])
  @@map("reports")
}

// ── AUDIT (append-only, hash-chain X6) ──
model AuditLog {
  id         String   @id @default(cuid())
  actor      Account? @relation(fields: [actorId], references: [id], onDelete: SetNull)
  actorId    String?
  action     AuditAction
  entityType String
  entityId   String?
  detail     Json?
  ipHmac     String?
  prevHash   String?  @db.VarChar(64)   // oldingi yozuv hash'i (buzilish aniqlanadi)
  hash       String   @db.VarChar(64)
  createdAt  DateTime @default(now())
  @@index([entityType, entityId]); @@index([actorId, createdAt])
  @@map("audit_log")
}
```

> Eslatma: `Contract` (enum, mavjud) va `Contract2` (model) nom to'qnashuvini oldini olish uchun
> shartnoma modeli `Contract2` deb nomlangan (yoki enum `ContractType`ga renom qilinadi — implementatsiyada aniqlanadi).

---

## 2. Loyiha skeleti + RBAC

Papka tuzilishi (App Router): `(auth)/login·parol-almashtirish`, `(panel)/{anketalar,shartnomalar,buyruqlar,hujjatlar,xodimlar,arizalar,arxiv,sozlamalar}`, `api/{health,hujjat/[id]/{sign-payload,sign,download}}`, `verify/[id]`.
Lib qatlamlari: `env.ts`(zod fail-fast), `rbac.ts`(⭐ yagona matritsa), `rate-limit.ts`, `crypto.ts`(HMAC blind-index + AES-GCM), `audit.ts`(hash-chain), `documents/{canonical,builder,storage,numbering,snapshot}.ts`, `eimzo/{mode,capiws,manifest,verify,cert}.ts`.

### RBAC ruxsat matritsasi

| Modul / amal | rahbar | kadr | xodim | buxg. | it |
|---|---|---|---|---|---|
| Anketa — ko'rish | ✔ | ✔ | o'ziniki | – | – |
| Anketa — yaratish/tahrir (nomzod) | – | ✔ | – | – | – |
| Anketa — self-tahrir | – | – | ✔ (o'z) | – | – |
| Shartnoma/Buyruq — tayyorlash (LOYIHA) | – | ✔ | – | – | – |
| Shartnoma/Buyruq — **E-IMZO imzolash** | ✔ (ish beruvchi) | – | ✔ (o'z tomoni) | – | – |
| Ma'lumotnoma yaratish | ✔ | ✔ | – | – | – |
| Arxiv/qidiruv | ✔ | ✔ | o'ziniki | – | – |
| Arizalar (menga) | – | ✔ | – | ✔ | ✔ |
| Org sozlamalari / foydalanuvchilar | ✔ | – | – | – | ✔ |
| Audit log | ✔ | – | – | – | ✔ |

Prinsip: **kadr tayyorlaydi → rahbar E-IMZO bilan imzolaydi → (shartnomada) xodim ikkinchi imzo / (buyruqda) xodim tanishtirish imzosi**. Default-deny; xodim faqat o'z ma'lumoti (`ownerScope`).

---

## 3. Modul spetsifikatsiyalari

### Modul 1 — Kirish / Rollar
- Login (bajarildi: demo olib tashlangan, toza). Qo'shiladi: **rate-limit** (10/daq), **majburiy parol almashtirish** birinchi kirishda (`mustChangePassword`), **sessionVersion** revoke.
- `env.ts` (zod) — `SESSION_SECRET` (≥32), `EIMZO_*` majburiy tekshiruv.

### Modul 2 — Anketa (yagona manba)
- 6-qadamli wizard: Shaxsiy → Hujjatlar(passport/PINFL) → Ta'lim → Oila/manzil → Bank → Mehnat daftarchasi(strukturaviy)+fayllar.
- Validatsiya (`validation.ts`, client+server bir manba): PINFL `^\d{14}$` + sana/jins mosligi; passport `^[A-Z]{2}$`+`^\d{7}$`; telefon `^\+998\d{9}$`; karta 16; STIR 9.
- PII — X4: PINFL/karta blind-index + shifrlab saqlanadi. Skanlar — himoyalangan stream.
- Har qadam draft avtosaqlash; `QORALAMA → TOLIQ` (faqat TOLIQ dan hujjat).

### Modul 3 — Shartnoma (mehnat / GPX)
- Oqim: shaxs qidiruv (PINFL/FIO) → anketadan avto-to'ldirish (readonly, kulrang + ⓘ) → tur → shartli maydonlar → jonli preview → LOYIHA → tasdiqlashga.
- **Mehnat majburiy shartlari to'liq** (U3): ish boshlash sanasi, stavka, ish vaqti rejimi, **haq to'lash sanalari (oyiga ≥2 marta)**, **mehnat sharoiti**, **ijtimoiy sug'urta bandi**, sinov muddati (≤3 oy), yillik ta'til (≥15 kun).
- **GPX — xodim/shtatga OLINMAYDI** (U5): tabel/lavozim/"ishga qabul buyrug'i" GPX uchun yo'q; faqat shartnoma + akt + hisobot. Ijrochi `Contract2(type=GPX)` orqali, `Employee` emas.
- summa → so'zlarda avto (`son-sozlarda.ts`, lotin+kirill).
- **Ikki tomonlama imzo** (Q7): rahbar(ISH_BERUVCHI) → xodim(XODIM) → IMZOLANGAN.

### Modul 4 — Buyruq (shaxsiy tarkib)
- Turlar: ishga qabul, bo'shatish, otpusk, ish haqisiz ta'til, stavka, lavozimga o'tkazish, qo'shimcha vazifa. **"GPX ishga qabul" — YO'Q** (U5).
- MK modda raqamlari — **versiyalangan jadval** (`LegalReference`, 2023 kodeks), koddan chiqariladi (U4).
- Raqamlash saqlash guruhiga qarab (U6): `-ш/т` (75y) va `-б` (5y) alohida seriya.
- **Xodim tanishtirish imzosi** (U2): rahbar imzolagach `Signature(signerRole=XODIM)` bilan tanishtiriladi; rad etsa — dalolatnoma.
- Nomzod ishga qabuli: `Order.subjectAnketaId`; imzolangach Account/Employee backfill (aniq tranzaksiya).

---

## 4. E-IMZO — rahbar tasdiqlash oqimi

**Payload (Q3):** kanonik JCS manifest (v, docId, docType, docNo, issuedAt, org{name,stir}, subject{fio,pinflBidx}, signerRole, expectedSignerPinfl, **docxHash="algo:hex"**, docxSize). `.docx` bir marta yaratiladi va **muzlatiladi** (storage), qayta generatsiya qilinmaydi → hash barqaror. `create_pkcs7(base64(canonical), keyId, detached='yes')`.

**Rejim:** `client` (brauzer → foydalanuvchi E-IMZO'si; remote/Linux, **default**) / `server` (Node lokal CAPIWS; desktop). `public/e-imzo/eimzo-browser.js` + `KeyPicker.tsx` (5 faza: loading→ready→signing→verifying→done, PINFL mos kelmasa UI blok — ammo yagona to'siq server).

**Verifikatsiya (server, fail-closed) — REJECT shartlari:**
1. SignerInfo tuzilmasi noto'g'ri
2. Signer sertifikati topilmadi
3. **CA ishonch zanjiri** E-IMZO/DShM root'ga ulanmaydi (X1 — MAJBURIY)
4. Imzo **matematik** yaroqsiz (X2 — algoritmga mos kripto bilan)
5. `messageDigest` ≠ server `hash_by_algo(canonical)` (X2)
6. Signer PINFL ≠ `expectedSignerPinfl` (server-belgilangan, X5)
7. Sertifikat muddati o'tgan (+ imkon bo'lsa OCSP/CRL bekor holati — U8)
8. Hujjat holati ≠ TASDIQ_KUTILMOQDA (atomik `WHERE` bilan)
9. `pkcs7Sha256` allaqachon bor (replay)
10. Shu `signerRole` uchun imzo allaqachon bor
→ Barchasi AND. `verified=true` bo'lmasa hujjat **IMZOLANGAN bo'lmaydi** (X3).

**QR/tekshiruv:** imzolangan hujjatga imzo bloki + QR = `/verify/[id]?h=<docxHash>` (ichki tekshiruv; `?h` majburiy — enumeratsiyaga qarshi). Cheklovlar ochiq aytiladi (davlat e-imzo.uz emas).

**Kutubxonalar:** `ws` (server rejim CAPIWS); PKCS7 tekshiruv — **O'zDSt uchun milliy kripto** (7-bo'lim ochiq savol); `qrcode.react`; Node `crypto` (HMAC/AES-GCM/timingSafeEqual).

---

## 5. Amalga oshirish yo'l xaritasi (avtonom, bosqichma-bosqich)

Har bosqich: deliverable + tayyorlik mezoni. **Imzo qarorlari + sxema birga birinchi** (izchillik tanqidi 7.1).

| Bosqich | Ish | Tayyorlik mezoni |
|---|---|---|
| **B0** | Sxema (yuqoridagi) + `env.ts` + greenfield migratsiya + seed (Organization + demo). `crypto.ts` (blind-index/AES-GCM). | `migrate dev` o'tadi, seed ishlaydi, typecheck toza |
| **B1** | Auth/RBAC: `rbac.ts`, rate-limit, sessionVersion, majburiy parol almashtirish, `audit.ts`(hash-chain). | Login/logout/parol oqimi + audit yoziladi |
| **B2** | Anketa (yagona manba): 6-qadam wizard, `validation.ts`, PII shifrlash, MehnatFaoliyati, qidiruv (blind-index). | Anketa yaratish/tahrir/qidiruv ishlaydi, PII shifrlangan |
| **B3** | Hujjat qatlami: `documents/{snapshot,builder,storage,numbering}`, `Document` saqlash, arxiv sahifasi, download stream (owner-scope). | Shartnoma/buyruq LOYIHA yaratiladi, .docx muzlatiladi, arxivda ko'rinadi |
| **B4** | Shartnoma moduli (mehnat to'liq shartlar + GPX ajratilgan) + son→so'zlarda. | Anketadan shartnoma .docx to'g'ri shakllanadi |
| **B5** | Buyruq moduli (versiyalangan MK, saqlash-guruh raqamlash, tanishtirish). | Barcha buyruq turlari .docx shakllanadi |
| **B6** | E-IMZO: `eimzo/*`, KeyPicker, manifest, verify (fail-closed R1-R10), sign/sign-payload route, ikki tomonlama imzo, /verify sahifa. **TDD** (verify/cert/numbering/canonical). | Rahbar imzolaydi, server verify o'tadi, QR tekshiruv ishlaydi |
| **B7** | Arxiv nomenklatura (saqlash muddati), audit ko'rish, sayqal (loading/empty/dark mode), testlar. | To'liq oqim uchidan-uchiga ishlaydi |

---

## 6. Ochiq savollar (qaror talab qiladi — B6 dan oldin)

1. **⭐ O'zDSt verifikatsiya (X2):** Real E-IMZO O'zDSt 1092/1106 (GOST) ishlatadi — `pkijs`/sha256 tekshira olmaydi. Variantlar:
   (a) E-IMZO'ning o'z `verify_pkcs7` / DSKEYS verify xizmati orqali; (b) milliy GOST kutubxona (FFI); (c) rasmiy davlat verify servisi; (d) MVP: imzoni **dalil** sifatida saqlab, cert+OID+chain tekshiruvi bilan (matematik verify keyin). — **Qaysi yo'l?**
2. **CA root sertifikatlari (X1):** E-IMZO/DShM root+intermediate PEM'larini qayerdan olamiz (deploy artefaktiga)?
3. **Imzo kaliti:** rahbar **shaxsiy (PINFL)** kaliti bilanmi (tavsiya) yoki tashkilot (STIR) kaliti bilanmi? Ikkalasi ham?
4. **Deploy rejimi:** `client` (remote/Linux, tavsiya) yoki `server` (desktop)?
5. **PDF kerakmi** (.docx dan tashqari) — arxiv/QR uchun?
6. **Ikki tomonlama imzo (Q7)** hozir kerakmi yoki B6'da faqat rahbar imzosi, xodim imzosi keyinmi?
7. **Shifrlash (X4)** darajasi: to'liq AES-GCM PII hozircha kerakmi yoki B2'da blind-index+plaintext, shifrlash keyinmi?

> Bu savollar **B0–B5 ni bloklamaydi** — ular imzosiz (sxema, auth, anketa, hujjat, shartnoma, buyruq) qismlardir. Avtonom rejimda B0 dan boshlanadi; B6 (E-IMZO) oldidan ochiq savollar hal qilinadi.
