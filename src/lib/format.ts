const TZ = "Asia/Tashkent";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Sanani dd.mm.yyyy ko'rinishida, Asia/Tashkent mintaqasida (ICU, tzdata shart emas) */
export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}`;
}
