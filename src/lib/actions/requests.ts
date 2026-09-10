"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession, requireRole, AuthError } from "@/lib/auth";
import { BOLIM_OPTIONS, REQUEST_TYPES, ROLE_TO_BOLIM } from "@/lib/labels";
import type { Holat } from "@prisma/client";

export interface RequestState {
  error?: string;
  ok?: boolean;
}

export async function createRequest(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const user = await requireSession();

  const turi = String(formData.get("turi") ?? "");
  const bolim = String(formData.get("bolim") ?? "");
  const matn = String(formData.get("matn") ?? "").trim();

  if (!REQUEST_TYPES.includes(turi as (typeof REQUEST_TYPES)[number])) {
    return { error: "Ariza turi noto‘g‘ri." };
  }
  if (!BOLIM_OPTIONS.includes(bolim as (typeof BOLIM_OPTIONS)[number])) {
    return { error: "Bo‘limni tanlang." };
  }
  if (!matn) {
    return { error: "Ariza matnini yozing." };
  }

  await prisma.request.create({
    data: { employeeId: user.id, bolim, turi, matn, holat: "KORIB_CHIQILMOQDA" },
  });

  revalidatePath("/panel/arizalar");
  revalidatePath("/panel");
  return { ok: true };
}

const ALLOWED_STATUS: Holat[] = ["TASDIQLANDI", "RAD_ETILDI"];

export async function updateRequestStatus(formData: FormData): Promise<void> {
  const user = await requireRole("kadr", "buxgalteriya", "it");
  const id = String(formData.get("id") ?? "");
  const holat = String(formData.get("holat") ?? "") as Holat;

  if (!id || !ALLOWED_STATUS.includes(holat)) {
    throw new AuthError("Noto‘g‘ri so‘rov", 400);
  }

  const req = await prisma.request.findUnique({ where: { id } });
  if (!req) throw new AuthError("Ariza topilmadi", 404);

  // Faqat o'z bo'limiga tushgan arizani o'zgartira oladi
  const myBolim = ROLE_TO_BOLIM[user.role];
  if (myBolim && req.bolim !== myBolim) {
    throw new AuthError("Bu ariza sizning bo‘limingizga tegishli emas", 403);
  }

  await prisma.request.update({ where: { id }, data: { holat } });
  revalidatePath("/panel/arizalar");
}
