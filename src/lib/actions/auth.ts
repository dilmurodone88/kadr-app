"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Login va parolni kiriting." };
  }

  const acc = await prisma.account.findUnique({ where: { username } });
  if (!acc || !(await bcrypt.compare(password, acc.password))) {
    return { error: "Login yoki parol noto‘g‘ri." };
  }

  await createSession({
    id: acc.id,
    username: acc.username,
    role: acc.role,
    fio: acc.fio,
    lavozim: acc.lavozim,
    bolim: acc.bolim,
    shartnoma: acc.shartnoma,
  });

  redirect("/panel");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
