import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { Role, Contract } from "@prisma/client";

const COOKIE_NAME = "kadr_session";
const MAX_AGE = 60 * 60 * 8; // 8 soat

export interface SessionUser {
  id: string;
  username: string;
  role: Role;
  fio: string;
  lavozim: string;
  bolim: string;
  shartnoma: Contract | null;
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET aniqlanmagan");
  return new TextEncoder().encode(secret);
}

/** JWT yaratib, httpOnly cookie'ga yozadi */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.FORCE_INSECURE_COOKIE !== "1",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Cookie'dan sessiyani o'qiydi va tekshiradi. Yaroqsiz bo'lsa null. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return (payload.user as SessionUser) ?? null;
  } catch {
    return null;
  }
}

/** Cookie'ni o'chiradi (logout) */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const SESSION_COOKIE = COOKIE_NAME;
