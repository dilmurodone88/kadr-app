"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export interface XodimMatch {
  id: string;
  fio: string;
  lavozim: string;
  bolim: string;
  manba: "xodim" | "nomzod"; // ma'lumot manbai
  anketa: Record<string, string | null> | null;
}

function anketaFields(a: {
  tugilganSana: string | null;
  tugilganJoy: string | null;
  millati: string | null;
  malumoti: string | null;
  mutaxassisligi: string | null;
  manzil: string | null;
  telefon: string | null;
  pinfl: string | null;
  passportSeriya: string | null;
  passportRaqam: string | null;
  kartaRaqami: string | null;
  oilaviyHolati: string | null;
  qoshimcha: string | null;
}): Record<string, string | null> {
  return {
    tugilganSana: a.tugilganSana,
    tugilganJoy: a.tugilganJoy,
    millati: a.millati,
    malumoti: a.malumoti,
    mutaxassisligi: a.mutaxassisligi,
    manzil: a.manzil,
    telefon: a.telefon,
    pinfl: a.pinfl,
    passportSeriya: a.passportSeriya,
    passportRaqam: a.passportRaqam,
    kartaRaqami: a.kartaRaqami,
    oilaviyHolati: a.oilaviyHolati,
    qoshimcha: a.qoshimcha,
  };
}

/**
 * PINFL yoki F.I.O. bo'yicha qidirish (hujjat avto-to'ldirish uchun).
 * Ham mavjud xodimlar, ham nomzod anketalari (ishga qabul buyruqlari uchun).
 */
export async function searchXodim(query: string): Promise<XodimMatch[]> {
  await requireRole("kadr", "rahbar");
  const q = query.trim();
  if (!q) return [];

  // 1. Mavjud xodimlar (account + self-anketa)
  const accounts = await prisma.account.findMany({
    where: {
      role: "xodim",
      OR: [{ fio: { contains: q } }, { anketa: { pinfl: { contains: q } } }],
    },
    take: 10,
    orderBy: { fio: "asc" },
    include: { anketa: true },
  });

  // 2. Nomzod anketalari (standalone, accountId yo'q)
  const candidates = await prisma.anketa.findMany({
    where: {
      accountId: null,
      OR: [{ fio: { contains: q } }, { pinfl: { contains: q } }],
    },
    take: 10,
    orderBy: { fio: "asc" },
  });

  const nomzodMatches: XodimMatch[] = candidates.map((c) => ({
    id: `anketa:${c.id}`,
    fio: c.fio,
    lavozim: c.lavozim ?? "",
    bolim: c.bolim ?? "",
    manba: "nomzod",
    anketa: anketaFields(c),
  }));

  const xodimMatches: XodimMatch[] = accounts.map((a) => ({
    id: a.id,
    fio: a.fio,
    lavozim: a.lavozim,
    bolim: a.bolim,
    manba: "xodim",
    anketa: a.anketa ? anketaFields(a.anketa) : null,
  }));

  return [...nomzodMatches, ...xodimMatches];
}
