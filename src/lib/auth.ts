import "server-only";
import { getSession, type SessionUser } from "./session";
import type { Role } from "@prisma/client";

/** Sessiya bo'lmasa xato tashlaydi (API route'larda ishlatiladi) */
export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new AuthError("Avtorizatsiya talab qilinadi", 401);
  }
  return user;
}

/** Berilgan rollardan biri bo'lishini talab qiladi */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireSession();
  if (!roles.includes(user.role)) {
    throw new AuthError("Ruxsat yo'q", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}
