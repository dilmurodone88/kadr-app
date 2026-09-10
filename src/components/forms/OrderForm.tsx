"use client";

import { useActionState, useEffect, useRef } from "react";
import { createOrder, type OrderState } from "@/lib/actions/orders";
import { ORDER_TYPES } from "@/lib/labels";
import { btn } from "@/components/ui";
import { Field, FormRow, FormNote, inputCls } from "@/components/form-fields";

export interface EmployeeOption {
  id: string;
  fio: string;
  lavozim: string;
}

export function OrderForm({ employees }: { employees: EmployeeOption[] }) {
  const [state, action, pending] = useActionState<OrderState, FormData>(createOrder, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      <FormRow>
        <Field label="Buyruq turi" htmlFor="turi">
          <select id="turi" name="turi" className={inputCls} defaultValue={ORDER_TYPES[0]}>
            {ORDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Xodim" htmlFor="employeeId">
          <select id="employeeId" name="employeeId" className={inputCls} disabled={!employees.length}>
            {employees.length ? (
              employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fio} — {e.lavozim}
                </option>
              ))
            ) : (
              <option value="">Xodimlar mavjud emas</option>
            )}
          </select>
        </Field>
      </FormRow>
      <Field label="Izoh" htmlFor="izoh">
        <textarea
          id="izoh"
          name="izoh"
          rows={3}
          placeholder="Qo‘shimcha izoh (ixtiyoriy)"
          className={`${inputCls} resize-y`}
        />
      </Field>
      <button type="submit" disabled={pending || !employees.length} className={`${btn.base} ${btn.primary} ${btn.md}`}>
        {pending ? "Chiqarilmoqda…" : "Chiqarish va QR bilan imzolash"}
      </button>
      {state.error && <FormNote tone="danger">{state.error}</FormNote>}
      {state.ok && <FormNote>Buyruq chiqarildi va imzolandi. «Buyruqlar» bo‘limida ko‘rishingiz mumkin.</FormNote>}
    </form>
  );
}
