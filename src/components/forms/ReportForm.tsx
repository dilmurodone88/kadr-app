"use client";

import { useActionState, useEffect, useRef } from "react";
import { createReport, type ReportState } from "@/lib/actions/reports";
import { btn } from "@/components/ui";
import { Field, FormNote, inputCls } from "@/components/form-fields";

export function ReportForm() {
  const [state, action, pending] = useActionState<ReportState, FormData>(createReport, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      <Field label="Bajarilgan ish tavsifi" htmlFor="matn">
        <textarea
          id="matn"
          name="matn"
          rows={4}
          required
          placeholder="Qaysi ish/xizmat bajarilgani, hajmi va natijasini yozing"
          className={`${inputCls} resize-y`}
        />
      </Field>
      <button type="submit" disabled={pending} className={`${btn.base} ${btn.primary} ${btn.md}`}>
        {pending ? "Topshirilmoqda…" : "Hisobotni topshirish"}
      </button>
      {state.error && <FormNote tone="danger">{state.error}</FormNote>}
      {state.ok && <FormNote>Hisobot topshirildi. Kadr bo‘limi ko‘rib chiqadi.</FormNote>}
    </form>
  );
}
