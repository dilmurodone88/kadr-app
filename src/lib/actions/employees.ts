"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { Contract } from "@prisma/client";

export interface EmployeeState {
  error?: string;
  ok?: boolean;
}

export async function createEmployee(
  _prev: EmployeeState,
  formData: FormData,
): Promise<EmployeeState> {
  await requireRole("kadr");

  const fio = String(formData.get("fio") ?? "").trim();
  const lavozim = String(formData.get("lavozim") ?? "").trim();
  const bolim = String(formData.get("bolim") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const shartnomaRaw = String(formData.get("shartnoma") ?? "MEHNAT");
  const password = String(formData.get("password") ?? "").trim() || "1234";

  if (!fio || !lavozim || !bolim || !username) {
    return { error: "Barcha maydonlarni to‘ldiring." };
  }

  const shartnoma: Contract = shartnomaRaw === "GPX" ? "GPX" : "MEHNAT";

  const exists = await prisma.account.findUnique({ where: { username } });
  if (exists) return { error: "Bu login band, boshqasini tanlang." };

  const hash = await bcrypt.hash(password, 10);
  await prisma.account.create({
    data: { username, password: hash, role: "xodim", fio, lavozim, bolim, shartnoma },
  });

  revalidatePath("/panel/xodimlar");
  return { ok: true };
}
