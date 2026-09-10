"use client";

import { useActionState, useEffect, useRef } from "react";
import { createEmployee, type EmployeeState } from "@/lib/actions/employees";
import { CONTRACT_LABELS } from "@/lib/labels";
import { btn } from "@/components/ui";
import { Field, FormRow, FormNote, inputCls } from "@/components/form-fields";
import type { Contract } from "@prisma/client";

const CONTRACTS = Object.entries(CONTRACT_LABELS) as [Contract, string][];

export function EmployeeForm() {
  const [state, action, pending] = useActionState<EmployeeState, FormData>(createEmployee, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      <FormRow>
        <Field label="F.I.O." htmlFor="fio">
          <input id="fio" name="fio" required className={inputCls} />
        </Field>
        <Field label="Lavozim" htmlFor="lavozim">
          <input id="lavozim" name="lavozim" required className={inputCls} />
        </Field>
      </FormRow>
      <FormRow>
        <Field label="Bo‘lim" htmlFor="bolim">
          <input id="bolim" name="bolim" required placeholder="masalan: Savdo" className={inputCls} />
        </Field>
        <Field label="Login" htmlFor="username">
          <input id="username" name="username" required placeholder="masalan: xodim3" className={inputCls} />
        </Field>
      </FormRow>
      <FormRow>
        <Field label="Shartnoma turi" htmlFor="shartnoma">
          <select id="shartnoma" name="shartnoma" className={inputCls} defaultValue="MEHNAT">
            {CONTRACTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Vaqtinchalik parol" htmlFor="password">
          <input id="password" name="password" defaultValue="1234" required className={inputCls} />
        </Field>
      </FormRow>
      <button type="submit" disabled={pending} className={`${btn.base} ${btn.primary} ${btn.md}`}>
        {pending ? "Ochilmoqda…" : "Hisob ochish"}
      </button>
      {state.error && <FormNote tone="danger">{state.error}</FormNote>}
      {state.ok && <FormNote>Yangi xodim hisobi ochildi.</FormNote>}
    </form>
  );
}
