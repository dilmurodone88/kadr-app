"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export interface XodimMatch {
  id: string;
  fio: string;
  lavozim: string;
  bolim: string;
  anketa: Record<string, string | null> | null;
}

/** PINFL yoki F.I.O. bo'yicha xodimni qidirish (hujjat avto-to'ldirish uchun) */
export async function searchXodim(query: string): Promise<XodimMatch[]> {
  await requireRole("kadr", "rahbar");
  const q = query.trim();
  if (!q) return [];

  const accounts = await prisma.account.findMany({
    where: {
      role: "xodim",
      OR: [{ fio: { contains: q } }, { anketa: { pinfl: { contains: q } } }],
    },
    take: 10,
    orderBy: { fio: "asc" },
    include: { anketa: true },
  });

  return accounts.map((a) => ({
    id: a.id,
    fio: a.fio,
    lavozim: a.lavozim,
    bolim: a.bolim,
    anketa: a.anketa
      ? {
          tugilganSana: a.anketa.tugilganSana,
          tugilganJoy: a.anketa.tugilganJoy,
          millati: a.anketa.millati,
          malumoti: a.anketa.malumoti,
          mutaxassisligi: a.anketa.mutaxassisligi,
          manzil: a.anketa.manzil,
          telefon: a.anketa.telefon,
          pinfl: a.anketa.pinfl,
          passportSeriya: a.anketa.passportSeriya,
          passportRaqam: a.anketa.passportRaqam,
          oilaviyHolati: a.anketa.oilaviyHolati,
          qoshimcha: a.anketa.qoshimcha,
        }
      : null,
  }));
}
