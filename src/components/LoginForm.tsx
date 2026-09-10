"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { ROLE_LABELS } from "@/lib/labels";
import { btn } from "@/components/ui";
import type { Role } from "@prisma/client";

const ROLE_HINT: Record<Role, string> = {
  rahbar: "rahbar1",
  kadr: "kadr1",
  xodim: "xodim1",
  buxgalteriya: "buxgalter1",
  it: "it1",
};

const ROLES = Object.keys(ROLE_LABELS) as Role[];

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );
  const [role, setRole] = useState<Role>("xodim");
  const [username, setUsername] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[420px] animate-in rounded-card border border-border bg-surface p-8 shadow-card">
        <h1 className="text-xl font-semibold">Kadr boshqaruv tizimi</h1>
        <p className="mb-6 mt-1 text-sm text-text-soft">
          Hisobingiz turini tanlang va kiring
        </p>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setUsername(ROLE_HINT[r]);
              }}
              aria-pressed={role === r}
              className={`cursor-pointer rounded-lg border px-1.5 py-2.5 text-[13px] transition-colors duration-200 ${
                role === r
                  ? "border-primary bg-primary-tint font-medium text-primary-dark"
                  : "border-border bg-surface hover:bg-surface-2"
              }`}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>

        <form action={formAction} className="space-y-3.5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-[13px] text-text-soft">
              Login
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="masalan: xodim1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] text-text-soft">
              Parol
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="masalan: 1234"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`${btn.base} ${btn.primary} ${btn.block}`}
          >
            {pending ? "Kirilmoqda…" : "Kirish"}
          </button>

          {state.error && (
            <p role="alert" className="text-[13px] text-danger">
              {state.error}
            </p>
          )}
        </form>

        <div className="mt-5 rounded-lg bg-surface-2 px-3.5 py-3 text-xs leading-relaxed text-text-soft">
          Demo hisoblar (parol: <span className="font-medium">1234</span>):
          <br />
          rahbar1, kadr1, xodim1, xodim2, buxgalter1, it1
          <br />
          Kadr bo‘limi yangi xodim hisoblarini «Xodimlar» bo‘limidan qo‘sha oladi.
        </div>
      </div>
    </div>
  );
}
