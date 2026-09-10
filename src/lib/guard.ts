import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "@/lib/session";
import { homeHref } from "@/lib/nav";
import type { Role } from "@prisma/client";

/**
 * Panel sahifalari uchun yagona himoya:
 * - sessiya yo'q bo'lsa → /login
 * - rol ruxsat etilmagan bo'lsa → o'z bo'limining bosh sahifasiga
 * Ruxsat berilsa, joriy foydalanuvchini qaytaradi.
 */
export async function requirePanelUser(...roles: Role[]): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (roles.length > 0 && !roles.includes(user.role)) {
    redirect(homeHref(user.role, user.shartnoma));
  }
  return user;
}
