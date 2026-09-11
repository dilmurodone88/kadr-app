import type { Role, Contract, Holat } from "@prisma/client";

/** Rol → o'zbekcha nom (demodagi ROLE_LABELS bilan bir xil) */
export const ROLE_LABELS: Record<Role, string> = {
  rahbar: "Rahbar",
  kadr: "Kadr bo‘limi",
  xodim: "Xodim",
  buxgalteriya: "Buxgalteriya",
  it: "IT bo‘limi",
};

/** Shartnoma turi → nom */
export const CONTRACT_LABELS: Record<Contract, string> = {
  MEHNAT: "Mehnat shartnomasi",
  GPX: "GPX shartnomasi",
};

/** Holat → nom */
export const HOLAT_LABELS: Record<Holat, string> = {
  KORIB_CHIQILMOQDA: "Ko‘rib chiqilmoqda",
  TASDIQLANDI: "Tasdiqlandi",
  RAD_ETILDI: "Rad etildi",
  IMZOLANGAN: "Imzolangan",
  LOYIHA: "Loyiha",
  TASDIQ_KUTILMOQDA: "Tasdiqlash kutilmoqda",
  BEKOR: "Bekor qilingan",
};

/** Ariza yuboriladigan bo'limlar (demodagi BOLIM_OPTIONS) */
export const BOLIM_OPTIONS = ["Kadrlar", "Buxgalteriya", "IT"] as const;

/** Bo'lim nomi → rol (arizani qaysi rol ko'radi) */
export const BOLIM_TO_ROLE: Record<string, Role> = {
  Kadrlar: "kadr",
  Buxgalteriya: "buxgalteriya",
  IT: "it",
};

/** Rol → u ko'radigan arizalar bo'limi (BOLIM_TO_ROLE teskarisi) */
export const ROLE_TO_BOLIM: Partial<Record<Role, string>> = {
  kadr: "Kadrlar",
  buxgalteriya: "Buxgalteriya",
  it: "IT",
};

/** Buyruq turlari (rahbar tanlaydi) */
export const ORDER_TYPES = [
  "Ishga olish (Mehnat shartnomasi)",
  "Ishga olish (GPX shartnomasi)",
  "Ishdan bo‘shatish",
  "Otpuska tasdiqlash",
  "Boshqa",
] as const;

/** Ariza turlari (xodim tanlaydi) */
export const REQUEST_TYPES = ["Otpuska", "Bolnichniy", "Boshqa"] as const;

/** Anketa: ma'lumot darajasi */
export const MALUMOT_OPTIONS = [
  "Oliy",
  "Tugallanmagan oliy",
  "O‘rta maxsus",
  "O‘rta",
] as const;

/** Anketa: oilaviy holat */
export const OILAVIY_OPTIONS = [
  "Uylangan",
  "Turmushga chiqqan",
  "Bo‘ydoq",
  "Turmushga chiqmagan",
  "Ajrashgan",
] as const;

/** Badge rangini holatga qarab tanlash uchun kategoriya */
export function holatTone(holat: Holat): "ok" | "no" | "wait" {
  if (holat === "TASDIQLANDI" || holat === "IMZOLANGAN") return "ok";
  if (holat === "RAD_ETILDI") return "no";
  return "wait";
}

/** Holatga mos Tailwind badge klasslari (Badge va MiniBadge uchun umumiy manba) */
export function holatTint(holat: Holat): string {
  const tone = holatTone(holat);
  if (tone === "ok") return "bg-success-tint text-success";
  if (tone === "no") return "bg-danger-tint text-danger";
  return "bg-warn-tint text-warn";
}
