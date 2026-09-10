"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, AuthError } from "@/lib/auth";
import type { Holat } from "@prisma/client";

export interface ReportState {
  error?: string;
  ok?: boolean;
}

export async function createReport(
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const user = await requireRole("xodim");
  if (user.shartnoma !== "GPX") {
    return { error: "Ish hisoboti faqat GPX shartnomasi uchun." };
  }

  const matn = String(formData.get("matn") ?? "").trim();
  if (!matn) return { error: "Bajarilgan ish tavsifini yozing." };

  await prisma.report.create({
    data: { employeeId: user.id, matn, holat: "KORIB_CHIQILMOQDA" },
  });

  revalidatePath("/panel/hisobot");
  revalidatePath("/panel/gpx");
  return { ok: true };
}

const ALLOWED_STATUS: Holat[] = ["TASDIQLANDI", "RAD_ETILDI"];

export async function updateReportStatus(formData: FormData): Promise<void> {
  await requireRole("kadr");
  const id = String(formData.get("id") ?? "");
  const holat = String(formData.get("holat") ?? "") as Holat;

  if (!id || !ALLOWED_STATUS.includes(holat)) {
    throw new AuthError("Noto‘g‘ri so‘rov", 400);
  }

  await prisma.report.update({ where: { id }, data: { holat } });
  revalidatePath("/panel/gpx");
}
