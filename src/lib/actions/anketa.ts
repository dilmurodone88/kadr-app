"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession, AuthError } from "@/lib/auth";

export interface AnketaState {
  error?: string;
  ok?: boolean;
}

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

export async function saveAnketa(
  _prev: AnketaState,
  formData: FormData,
): Promise<AnketaState> {
  const user = await requireSession();
  const accountId = String(formData.get("accountId") ?? "");
  if (!accountId) return { error: "Xodim aniqlanmadi." };

  // Ruxsat: faqat o'z anketasi yoki kadr bo'limi
  if (user.id !== accountId && user.role !== "kadr") {
    throw new AuthError("Ruxsat yo‘q", 403);
  }

  const target = await prisma.account.findUnique({ where: { id: accountId } });
  if (!target) return { error: "Xodim topilmadi." };

  const data = Object.fromEntries(
    FIELDS.map((f) => {
      const v = String(formData.get(f) ?? "").trim();
      return [f, v || null];
    }),
  );

  await prisma.anketa.upsert({
    where: { accountId },
    update: data,
    create: { accountId, ...data },
  });

  revalidatePath("/panel/anketa");
  revalidatePath("/panel/anketalar");
  revalidatePath(`/panel/anketalar/${accountId}`);
  revalidatePath("/panel/profil");
  return { ok: true };
}
