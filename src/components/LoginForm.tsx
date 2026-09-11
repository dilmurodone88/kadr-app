"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { btn } from "@/components/ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[400px] animate-in rounded-card border border-border bg-surface p-8 shadow-card">
        <h1 className="text-xl font-semibold">Kadr boshqaruv tizimi</h1>
        <p className="mb-6 mt-1 text-sm text-text-soft">Tizimga kirish</p>

        <form action={formAction} className="space-y-3.5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-[13px] text-text-soft">
              Login
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="Login"
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
              placeholder="Parol"
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
      </div>
    </div>
  );
}
