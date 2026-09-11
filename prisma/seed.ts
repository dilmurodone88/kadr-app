import { PrismaClient, type Role, type Contract } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedAccount {
  username: string;
  role: Role;
  fio: string;
  lavozim: string;
  bolim: string;
  shartnoma?: Contract;
}

// Demo hisoblar (parol: 1234)
const ACCOUNTS: SeedAccount[] = [
  { username: "rahbar1", role: "rahbar", fio: "Aziz Karimov", lavozim: "Direktor", bolim: "Rahbariyat" },
  { username: "kadr1", role: "kadr", fio: "Dilnoza Yusupova", lavozim: "Kadrlar bo‘limi boshlig‘i", bolim: "Kadrlar" },
  { username: "xodim1", role: "xodim", fio: "Bobur Toshev", lavozim: "Sotuv menejeri", bolim: "Savdo", shartnoma: "MEHNAT" },
  { username: "xodim2", role: "xodim", fio: "Nodira Rashidova", lavozim: "Tarjimon (loyiha asosida)", bolim: "Marketing", shartnoma: "GPX" },
  { username: "buxgalter1", role: "buxgalteriya", fio: "Malika Nabieva", lavozim: "Bosh buxgalter", bolim: "Buxgalteriya" },
  { username: "it1", role: "it", fio: "Sardor Aliyev", lavozim: "IT mutaxassis", bolim: "IT" },
];

async function main() {
  const passwordHash = await bcrypt.hash("1234", 10);

  // ── 1) Hisoblar (idempotent: mavjud bo'lsa tegmaymiz) ──────────────
  const idByUsername = new Map<string, string>();
  for (const acc of ACCOUNTS) {
    const row = await prisma.account.upsert({
      where: { username: acc.username },
      update: {}, // idempotent
      create: {
        username: acc.username,
        password: passwordHash,
        role: acc.role,
        fio: acc.fio,
        lavozim: acc.lavozim,
        bolim: acc.bolim,
        shartnoma: acc.shartnoma ?? null,
      },
    });
    idByUsername.set(acc.username, row.id);
  }

  // ── 1b) Tashkilot rekvizitlari (bitta yozuv — faqat bo'sh bo'lsa) ──
  if ((await prisma.organization.count()) === 0) {
    await prisma.organization.create({
      data: {
        nomi: "«DISTRI FOR COUNTRY» MChJ",
        nomiKirill: "«DISTRI FOR COUNTRY» МЧЖ",
        stir: "311976765",
        manzil: "Toshkent sh., Yunusobod t.",
        telefon: "+998 71 200 00 00",
        direktorFio: "Yuldashev O.X.",
        huquqshunosFio: "Xaitov O.O.",
        kadrMenejerFio: "Kucharov B.R.",
        bankNomi: "Anor bank",
        minIshHaqi: "1155000",
      },
    });
  }

  // ── 2) Xodimlarning o'z anketasi (accountId unique -> upsert) ──────
  const xodim1Id = idByUsername.get("xodim1")!;
  const xodim2Id = idByUsername.get("xodim2")!;

  await prisma.anketa.upsert({
    where: { accountId: xodim1Id },
    update: {},
    create: {
      accountId: xodim1Id,
      fio: "Bobur Toshev",
      lavozim: "Sotuv menejeri",
      bolim: "Savdo",
      tugilganSana: "1994-05-12",
      tugilganJoy: "Toshkent shahri",
      millati: "O‘zbek",
      malumoti: "Oliy",
      mutaxassisligi: "Menejment",
      manzil: "Toshkent sh., Chilonzor t., 12-uy",
      telefon: "+998 90 123 45 67",
      passportSeriya: "AA",
      passportRaqam: "1234567",
      pinfl: "31205946710011",
      kartaRaqami: "5614 6800 1234 5678",
      oilaviyHolati: "Uylangan",
    },
  });

  await prisma.anketa.upsert({
    where: { accountId: xodim2Id },
    update: {},
    create: {
      accountId: xodim2Id,
      fio: "Nodira Rashidova",
      lavozim: "Tarjimon (loyiha asosida)",
      bolim: "Marketing",
      tugilganSana: "1997-11-03",
      tugilganJoy: "Samarqand viloyati",
      millati: "O‘zbek",
      malumoti: "Oliy",
      mutaxassisligi: "Filologiya (ingliz tili)",
      manzil: "Samarqand sh., Registon ko‘chasi, 5-uy",
      telefon: "+998 91 765 43 21",
      passportSeriya: "AB",
      passportRaqam: "7654321",
      pinfl: "62511976520022",
      kartaRaqami: "8600 4900 8765 4321",
      oilaviyHolati: "Turmushga chiqqan",
    },
  });

  // ── 3) Nomzod anketalari (accountId=null; faqat bo'sh bo'lsa) ──────
  const nomzodCount = await prisma.anketa.count({ where: { accountId: null } });
  if (nomzodCount === 0) {
    await prisma.anketa.createMany({
      data: [
        {
          fio: "Jasur Ergashev",
          lavozim: "Buxgalter",
          bolim: "Buxgalteriya",
          tugilganSana: "1995-02-20",
          tugilganJoy: "Farg‘ona viloyati",
          millati: "O‘zbek",
          malumoti: "Oliy",
          mutaxassisligi: "Buxgalteriya hisobi va audit",
          manzil: "Farg‘ona sh., Yangi ko‘cha, 8-uy",
          telefon: "+998 93 111 22 33",
          passportSeriya: "AC",
          passportRaqam: "2233445",
          pinfl: "31902956730033",
          oilaviyHolati: "Bo‘ydoq",
        },
        {
          fio: "Sevara Islomova",
          lavozim: "HR menejer",
          bolim: "Kadrlar",
          tugilganSana: "1998-07-15",
          tugilganJoy: "Toshkent viloyati",
          millati: "O‘zbek",
          malumoti: "Oliy",
          mutaxassisligi: "Psixologiya",
          manzil: "Toshkent vil., Zangiota t., 3-uy",
          telefon: "+998 94 555 66 77",
          passportSeriya: "AD",
          passportRaqam: "5566778",
          pinfl: "62607986740044",
          oilaviyHolati: "Turmushga chiqmagan",
        },
      ],
    });
  }

  // ── 4) Namuna buyruq (faqat bo'sh bo'lsa) ─────────────────────────
  if ((await prisma.order.count()) === 0) {
    await prisma.order.create({
      data: {
        turi: "Ishga olish (Mehnat shartnomasi)",
        employeeId: xodim1Id,
        rahbar: "rahbar1",
        izoh: "Sotuv bo‘limiga menejer sifatida ishga qabul qilindi.",
        holat: "IMZOLANGAN",
      },
    });
  }

  // ── 5) Namuna ariza (faqat bo'sh bo'lsa) ──────────────────────────
  if ((await prisma.request.count()) === 0) {
    await prisma.request.create({
      data: {
        employeeId: xodim1Id,
        bolim: "Kadrlar",
        turi: "Otpuska",
        matn: "01.10.2026 dan 15 kunlik navbatdagi mehnat ta‘tili so‘rayman.",
        holat: "KORIB_CHIQILMOQDA",
      },
    });
  }

  // ── 6) Namuna GPX ish hisoboti (faqat bo'sh bo'lsa) ───────────────
  if ((await prisma.report.count()) === 0) {
    await prisma.report.create({
      data: {
        employeeId: xodim2Id,
        matn: "Sentyabr oyida 3 ta shartnoma hujjati ingliz tiliga tarjima qilindi.",
        holat: "KORIB_CHIQILMOQDA",
      },
    });
  }

  const [accounts, anketalar, orders, requests, reports] = await Promise.all([
    prisma.account.count(),
    prisma.anketa.count(),
    prisma.order.count(),
    prisma.request.count(),
    prisma.report.count(),
  ]);
  console.log(
    `✅ Seed tugadi. Hisoblar: ${accounts}, anketalar: ${anketalar}, buyruqlar: ${orders}, arizalar: ${requests}, hisobotlar: ${reports}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed xatosi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
