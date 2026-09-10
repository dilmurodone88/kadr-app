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

// Demodagi seedData() bilan bir xil hisoblar (parol: 1234)
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

  for (const acc of ACCOUNTS) {
    await prisma.account.upsert({
      where: { username: acc.username },
      update: {}, // mavjud bo'lsa tegmaymiz (idempotent)
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
  }

  const count = await prisma.account.count();
  console.log(`✅ Seed tugadi. Jami hisoblar: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed xatosi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
