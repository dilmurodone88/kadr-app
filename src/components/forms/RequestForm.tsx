"use client";

import { useActionState, useEffect, useRef } from "react";
import { createRequest, type RequestState } from "@/lib/actions/requests";
import { REQUEST_TYPES, BOLIM_OPTIONS } from "@/lib/labels";
import { btn } from "@/components/ui";
import { Field, FormRow, FormNote, inputCls } from "@/components/form-fields";

export function RequestForm() {
  const [state, action, pending] = useActionState<RequestState, FormData>(createRequest, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      <FormRow>
        <Field label="Ariza turi" htmlFor="turi">
          <select id="turi" name="turi" className={inputCls} defaultValue={REQUEST_TYPES[0]}>
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Kimga yuborilsin" htmlFor="bolim">
          <select id="bolim" name="bolim" className={inputCls} defaultValue={BOLIM_OPTIONS[0]}>
            {BOLIM_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </FormRow>
      <Field label="Matn" htmlFor="matn">
        <textarea
          id="matn"
          name="matn"
          rows={4}
          required
          placeholder="Arizangiz matnini yozing"
          className={`${inputCls} resize-y`}
        />
      </Field>
      <button type="submit" disabled={pending} className={`${btn.base} ${btn.primary} ${btn.md}`}>
        {pending ? "Yuborilmoqda…" : "Yuborish"}
      </button>
      {state.error && <FormNote tone="danger">{state.error}</FormNote>}
      {state.ok && (
        <FormNote>Ariza yuborildi. Holatini yuqoridagi profil menyusidan kuzatishingiz mumkin.</FormNote>
      )}
    </form>
  );
}
