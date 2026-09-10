"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ORDER_TYPES } from "@/lib/labels";

export interface OrderState {
  error?: string;
  ok?: boolean;
}

export async function createOrder(
  _prev: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const user = await requireRole("rahbar");

  const turi = String(formData.get("turi") ?? "");
  const employeeId = String(formData.get("employeeId") ?? "");
  const izoh = String(formData.get("izoh") ?? "").trim();

  if (!ORDER_TYPES.includes(turi as (typeof ORDER_TYPES)[number])) {
    return { error: "Buyruq turi noto‘g‘ri." };
  }
  if (!employeeId) {
    return { error: "Xodimni tanlang." };
  }

  const employee = await prisma.account.findUnique({ where: { id: employeeId } });
  if (!employee) return { error: "Xodim topilmadi." };

  await prisma.order.create({
    data: {
      turi,
      employeeId,
      rahbar: user.username,
      izoh: izoh || null,
      holat: "IMZOLANGAN",
    },
  });

  revalidatePath("/panel/buyruqlar");
  revalidatePath("/panel");
  return { ok: true };
}
