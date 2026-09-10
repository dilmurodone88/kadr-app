"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveCandidateAnketa, type AnketaState } from "@/lib/actions/anketa";
import { MALUMOT_OPTIONS, OILAVIY_OPTIONS } from "@/lib/labels";
import { btn } from "@/components/ui";
import { Field, FormRow, FormNote, inputCls } from "@/components/form-fields";

export interface CandidateValues {
  id: string;
  fio: string;
  lavozim: string | null;
  bolim: string | null;
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
  kartaRaqami: string | null;
  oilaviyHolati: string | null;
  qoshimcha: string | null;
}

export function AnketaCandidateForm({ anketa }: { anketa?: CandidateValues | null }) {
  const [state, action, pending] = useActionState<AnketaState, FormData>(saveCandidateAnketa, {});
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(anketa?.id);
  const v = (k: keyof CandidateValues) => (anketa?.[k] as string | null) ?? "";

  // Yangi yaratishda muvaffaqiyatdan keyin formani tozalaymiz (yana qo'shish uchun)
  useEffect(() => {
    if (state.savedAt && !isEdit) formRef.current?.reset();
  }, [state.savedAt, isEdit]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      {isEdit && <input type="hidden" name="anketaId" value={anketa!.id} />}

      <FormRow>
        <Field label="F.I.O. *" htmlFor="fio">
          <input id="fio" name="fio" required defaultValue={v("fio")} placeholder="Familiya Ism Otasining ismi" className={inputCls} />
        </Field>
        <Field label="Ko‘zlanayotgan lavozim" htmlFor="lavozim">
          <input id="lavozim" name="lavozim" defaultValue={v("lavozim")} placeholder="masalan: Menejer" className={inputCls} />
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Bo‘lim" htmlFor="bolim">
          <input id="bolim" name="bolim" defaultValue={v("bolim")} placeholder="masalan: Savdo" className={inputCls} />
        </Field>
        <Field label="Tug‘ilgan sana" htmlFor="tugilganSana">
          <input id="tugilganSana" name="tugilganSana" type="date" defaultValue={v("tugilganSana")} className={inputCls} />
        </Field>
      </FormRow>

      <FormRow>
        <Field label="Tug‘ilgan joy" htmlFor="tugilganJoy">
          <input id="tugilganJoy" name="tugilganJoy" defaultValue={v("tugilganJoy")} placeholder="masalan: Toshkent sh." className={inputCls} />
        </Field>
        <Field label="Millati" htmlFor="millati">
          <input id="millati" name="millati" defaultValue={v("millati")} placeholder="masalan: o‘zbek" className={inputCls} />
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
        <Field label="Oilaviy holati" htmlFor="oilaviyHolati">
          <select id="oilaviyHolati" name="oilaviyHolati" defaultValue={v("oilaviyHolati")} className={inputCls}>
            <option value="">— tanlanmagan —</option>
            {OILAVIY_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </FormRow>

      <Field label="Mutaxassisligi" htmlFor="mutaxassisligi">
        <input id="mutaxassisligi" name="mutaxassisligi" defaultValue={v("mutaxassisligi")} className={inputCls} />
      </Field>

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

      <Field label="Karta raqami" htmlFor="kartaRaqami">
        <div className="relative">
          <input
            id="kartaRaqami"
            name="kartaRaqami"
            inputMode="numeric"
            maxLength={19}
            defaultValue={v("kartaRaqami")}
            placeholder="0000 0000 0000 0000"
            className={`${inputCls} pr-36`}
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-primary-tint px-2 py-1 text-xs font-medium text-primary-dark">
            Anor bank (Xumo)
          </span>
        </div>
      </Field>

      <Field label="Qo‘shimcha ma‘lumot" htmlFor="qoshimcha">
        <textarea id="qoshimcha" name="qoshimcha" rows={3} defaultValue={v("qoshimcha")} placeholder="Mehnat faoliyati, qo‘shimcha ma‘lumotlar" className={`${inputCls} resize-y`} />
      </Field>

      <button type="submit" disabled={pending} className={`${btn.base} ${btn.primary} ${btn.md}`}>
        {pending ? "Saqlanmoqda…" : isEdit ? "Saqlash" : "Anketa yaratish"}
      </button>
      {state.error && <FormNote tone="danger">{state.error}</FormNote>}
      {state.ok && <FormNote>{isEdit ? "Anketa saqlandi." : "Anketa yaratildi va pastdagi ro‘yxatga qo‘shildi."}</FormNote>}
    </form>
  );
}
