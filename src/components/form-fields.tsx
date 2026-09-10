import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-primary";

/** Yashil ramkali variant (dropdown/select uchun) */
export const selectCls =
  "w-full rounded-lg border border-primary bg-surface px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-primary-dark";

export const labelCls = "mb-1.5 block text-[13px] text-text-soft";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
    </div>
  );
}

/** Ikki ustunli forma qatori (mobil: bitta ustun) */
export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">{children}</div>;
}

export function FormNote({ tone = "success", children }: { tone?: "success" | "danger"; children: ReactNode }) {
  const cls = tone === "success" ? "text-success" : "text-danger";
  return (
    <p role="status" className={`text-[13px] ${cls}`}>
      {children}
    </p>
  );
}
