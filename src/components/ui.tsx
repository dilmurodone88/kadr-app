import type { ReactNode } from "react";
import type { Holat } from "@prisma/client";
import { HOLAT_LABELS, holatTint } from "@/lib/labels";

/** Tugma uslublari — Tailwind class satrlarini qaytaradi */
export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer",
  primary: "bg-primary text-white hover:bg-primary-dark",
  ghost: "bg-transparent border border-border text-text hover:bg-surface-2",
  danger: "bg-danger-tint text-danger border border-transparent hover:bg-danger hover:text-white",
  success: "bg-success-tint text-success border border-transparent hover:bg-success hover:text-white",
  md: "px-[18px] py-2.5 text-sm",
  sm: "px-3 py-1.5 text-[13px] rounded-md",
  block: "w-full py-3",
};

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-7">
      <h1 className="text-[22px] font-semibold leading-tight">{title}</h1>
      {sub && <p className="mt-1 text-sm text-text-soft">{sub}</p>}
    </header>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`mb-6 rounded-card border border-border bg-surface p-6 shadow-card ${className}`}
    >
      {title && <h2 className="mb-4 text-[15px] font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function StatCard({ num, label }: { num: number | string; label: string }) {
  return (
    <div className="min-w-[140px] flex-1 rounded-card border border-border bg-surface px-5 py-4 shadow-card">
      <div className="text-[26px] font-semibold tabular-nums leading-none">{num}</div>
      <div className="mt-1.5 text-xs text-text-mute">{label}</div>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-8 text-center text-sm text-text-mute">
      {children}
    </div>
  );
}

export function Badge({ holat }: { holat: Holat }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${holatTint(holat)}`}
    >
      {HOLAT_LABELS[holat]}
    </span>
  );
}

/** Jadval uchun yordamchi konteyner (mobil skroll uchun overflow-x) */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-2 overflow-x-auto px-2">
      <table className="w-full min-w-[520px] border-collapse text-[13.5px]">{children}</table>
    </div>
  );
}

/** Jadval sarlavhasi — barcha sahifalar uchun umumiy */
export function Thead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr>
        {columns.map((c, i) => (
          <th
            key={i}
            className="border-b border-border px-3 py-2.5 text-left text-xs font-medium text-text-mute"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}
