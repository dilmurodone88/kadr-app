"use client";

import { useActionState } from "react";
import { saveAnketa, type AnketaState } from "@/lib/actions/anketa";
import { MALUMOT_OPTIONS, OILAVIY_OPTIONS } from "@/lib/labels";
import { btn } from "@/components/ui";
import { Field, FormRow, FormNote, inputCls } from "@/components/form-fields";

export interface AnketaValues {
  tugilganSana: string | null;
  tugilganJoy: string | null;
  millati: string | null;
  malumoti: string | null;
  mutaxassisligi: string | null;
  manzil: string | null;
  telefon: string | null;
  passportSeriya: string | null;
  passportRaqam: string | null;
  pinfl: string | null;
  oilaviyHolati: string | null;
  qoshimcha: string | null;
}

export function AnketaForm({
  accountId,
  anketa,
  submitLabel = "Anketani saqlash",
}: {
  accountId: string;
  anketa?: AnketaValues | null;
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState<AnketaState, FormData>(saveAnketa, {});
  const v = (k: keyof AnketaValues) => anketa?.[k] ?? "";

  return (
    <form action={action} className="space-y-3.5">
      <input type="hidden" name="accountId" value={accountId} />

      <FormRow>
        <Field label="Tug‘ilgan sana" htmlFor="tugilganSana">
          <input id="tugilganSana" name="tugilganSana" type="date" defaultValue={v("tugilganSana")} className={inputCls} />
        </Field>
        <Field label="Tug‘ilgan joy" htmlFor="tugilganJoy">
          <input id="tugilganJoy" name="tugilganJoy" defaultValue={v("tugilganJoy")} placeholder="masalan: Toshkent sh." className={inputCls} />
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Millati" htmlFor="millati">
          <input id="millati" name="millati" defaultValue={v("millati")} placeholder="masalan: o‘zbek" className={inputCls} />
        </Field>
        <Field label="Oilaviy holati" htmlFor="oilaviyHolati">
          <select id="oilaviyHolati" name="oilaviyHolati" defaultValue={v("oilaviyHolati")} className={inputCls}>
            <option value="">— tanlanmagan —</option>
            {OILAVIY_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Ma‘lumoti" htmlFor="malumoti">
          <select id="malumoti" name="malumoti" defaultValue={v("malumoti")} className={inputCls}>
            <option value="">— tanlanmagan —</option>
            {MALUMOT_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Mutaxassisligi" htmlFor="mutaxassisligi">
          <input id="mutaxassisligi" name="mutaxassisligi" defaultValue={v("mutaxassisligi")} className={inputCls} />
        </Field>
      </FormRow>

      <Field label="Manzil (yashash joyi)" htmlFor="manzil">
        <input id="manzil" name="manzil" defaultValue={v("manzil")} placeholder="Viloyat, tuman, ko‘cha, uy" className={inputCls} />
      </Field>

      <FormRow>
        <Field label="Telefon" htmlFor="telefon">
          <input id="telefon" name="telefon" defaultValue={v("telefon")} placeholder="+998 __ ___ __ __" className={inputCls} />
        </Field>
        <Field label="JSHSHIR (PINFL)" htmlFor="pinfl">
          <input id="pinfl" name="pinfl" defaultValue={v("pinfl")} inputMode="numeric" maxLength={14} placeholder="14 raqam" className={inputCls} />
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Passport seriyasi" htmlFor="passportSeriya">
          <input id="passportSeriya" name="passportSeriya" defaultValue={v("passportSeriya")} maxLength={2} placeholder="AA" className={inputCls} />
        </Field>
        <Field label="Passport raqami" htmlFor="passportRaqam">
          <input id="passportRaqam" name="passportRaqam" defaultValue={v("passportRaqam")} inputMode="numeric" maxLength={7} placeholder="1234567" className={inputCls} />
        </Field>
      </FormRow>

      <Field label="Qo‘shimcha ma‘lumot" htmlFor="qoshimcha">
        <textarea id="qoshimcha" name="qoshimcha" rows={3} defaultValue={v("qoshimcha")} placeholder="Mehnat faoliyati, qarindoshlari yoki boshqa izohlar" className={`${inputCls} resize-y`} />
      </Field>

      <button type="submit" disabled={pending} className={`${btn.base} ${btn.primary} ${btn.md}`}>
        {pending ? "Saqlanmoqda…" : submitLabel}
      </button>
      {state.error && <FormNote tone="danger">{state.error}</FormNote>}
      {state.ok && <FormNote>Anketa saqlandi.</FormNote>}
    </form>
  );
}
