"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession, requireRole, AuthError } from "@/lib/auth";

export interface AnketaState {
  error?: string;
  ok?: boolean;
  savedAt?: number; // har muvaffaqiyatli saqlashda yangi qiymat (formani reset qilish uchun)
}

/** Shaxsiy ma'lumot maydonlari (identity'dan tashqari) */
const FIELDS = [
  "tugilganSana",
  "tugilganJoy",
  "millati",
  "malumoti",
  "mutaxassisligi",
  "manzil",
  "telefon",
  "passportSeriya",
  "passportRaqam",
  "pinfl",
  "oilaviyHolati",
  "qoshimcha",
] as const;

function collectFields(formData: FormData): Record<string, string | null> {
  return Object.fromEntries(
    FIELDS.map((f) => {
      const v = String(formData.get(f) ?? "").trim();
      return [f, v || null];
    }),
  );
}

/**
 * Xodimning O'Z anketasi (self) yoki kadr tomonidan mavjud xodim anketasi.
 * accountId bo'yicha upsert qiladi.
 */
export async function saveAnketa(
  _prev: AnketaState,
  formData: FormData,
): Promise<AnketaState> {
  const user = await requireSession();
  const accountId = String(formData.get("accountId") ?? "");
  if (!accountId) return { error: "Xodim aniqlanmadi." };

  if (user.id !== accountId && user.role !== "kadr") {
    throw new AuthError("Ruxsat yo‘q", 403);
  }

  const target = await prisma.account.findUnique({ where: { id: accountId } });
  if (!target) return { error: "Xodim topilmadi." };

  const data = collectFields(formData);
  await prisma.anketa.upsert({
    where: { accountId },
    update: data,
    create: { accountId, ...data },
  });

  revalidatePath("/panel/anketa");
  revalidatePath("/panel/profil");
  return { ok: true, savedAt: Date.now() };
}

/**
 * NOMZOD anketasi (kadr): hali ishga olinmagan yangi odam uchun standalone
 * anketa. accountId = null (Xodimlar ro'yxatida ko'rinmaydi). anketaId
 * berilsa — tahrirlaydi, aks holda yangi yaratadi.
 */
export async function saveCandidateAnketa(
  _prev: AnketaState,
  formData: FormData,
): Promise<AnketaState> {
  await requireRole("kadr");

  const fio = String(formData.get("fio") ?? "").trim();
  if (!fio) return { error: "F.I.O. majburiy." };

  const lavozim = String(formData.get("lavozim") ?? "").trim() || null;
  const bolim = String(formData.get("bolim") ?? "").trim() || null;
  const data = { fio, lavozim, bolim, ...collectFields(formData) };

  const anketaId = String(formData.get("anketaId") ?? "").trim();
  if (anketaId) {
    const existing = await prisma.anketa.findUnique({ where: { id: anketaId } });
    if (!existing) return { error: "Anketa topilmadi." };
    await prisma.anketa.update({ where: { id: anketaId }, data });
  } else {
    await prisma.anketa.create({ data });
  }

  revalidatePath("/panel/anketalar");
  return { ok: true, savedAt: Date.now() };
}
