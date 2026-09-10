import type { Role, Contract } from "@prisma/client";

export type IconKey =
  | "home"
  | "users"
  | "user"
  | "clipboard"
  | "inbox"
  | "file"
  | "edit"
  | "chart"
  | "idcard"
  | "document";

export interface NavItem {
  href: string;
  label: string;
  icon: IconKey;
}

/** Rolga (va shartnomaga) qarab sidebar navigatsiyasi — demodagi getNavItems bilan mos */
export function getNavItems(role: Role, shartnoma: Contract | null): NavItem[] {
  switch (role) {
    case "rahbar":
      return [
        { href: "/panel", label: "Umumiy holat", icon: "home" },
        { href: "/panel/buyruqlar", label: "Buyruqlar", icon: "clipboard" },
        { href: "/panel/hujjatlar", label: "Ma‘lumotnoma", icon: "document" },
        { href: "/panel/ariza", label: "Ariza yozish", icon: "edit" },
      ];
    case "kadr":
      return [
        { href: "/panel/anketalar", label: "Anketa", icon: "idcard" },
        { href: "/panel/xodimlar", label: "Xodimlar", icon: "users" },
        { href: "/panel/hujjatlar", label: "Ma‘lumotnoma", icon: "document" },
        { href: "/panel/buyruqlar", label: "Buyruqlar", icon: "clipboard" },
        { href: "/panel/arizalar", label: "Menga tushgan arizalar", icon: "inbox" },
        { href: "/panel/gpx", label: "GPX ish hisobotlari", icon: "file" },
        { href: "/panel/ariza", label: "Ariza yozish", icon: "edit" },
      ];
    case "xodim": {
      const items: NavItem[] = [
        { href: "/panel/profil", label: "Mening ma‘lumotlarim", icon: "user" },
        { href: "/panel/anketa", label: "Mening anketam", icon: "idcard" },
        { href: "/panel/ariza", label: "Ariza yozish", icon: "edit" },
        { href: "/panel/mening-buyruqlarim", label: "Mening buyruqlarim", icon: "clipboard" },
      ];
      if (shartnoma === "GPX") {
        items.push({ href: "/panel/hisobot", label: "Ish hisobotlari", icon: "file" });
      }
      return items;
    }
    case "buxgalteriya":
    case "it":
      return [
        { href: "/panel/arizalar", label: "Menga yo‘naltirilgan arizalar", icon: "inbox" },
        { href: "/panel/ariza", label: "Ariza yozish", icon: "edit" },
      ];
    default:
      return [{ href: "/panel/ariza", label: "Ariza yozish", icon: "edit" }];
  }
}

/** Rolning bosh sahifasi (/panel bosilganda yo'naltirish uchun) */
export function homeHref(role: Role, shartnoma: Contract | null): string {
  return getNavItems(role, shartnoma)[0]?.href ?? "/panel/ariza";
}
