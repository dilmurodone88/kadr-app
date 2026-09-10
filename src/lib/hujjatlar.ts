// Hujjat shablonlari — client (forma) va server (docx) uchun umumiy ta'rif.

export type FieldType = "text" | "date" | "textarea" | "number";

export interface DocField {
  name: string;
  label: string;
  type?: FieldType;
  /** Avto-to'ldirish manbasi: xodim hisobi yoki anketasi */
  from?: "account" | "anketa";
  fromKey?: string;
  /** Qo'lda to'ldirilishi majburiy (avto-to'ldirilmaydigan qolgan maydonlar) */
  required?: boolean;
  placeholder?: string;
}

export interface DocTemplate {
  id: string;
  title: string;
  description: string;
  fields: DocField[];
}

// Umumiy avto-to'ldiriladigan asosiy maydonlar
const F = {
  fio: { name: "fio", label: "F.I.O.", from: "account", fromKey: "fio" } as DocField,
  lavozim: { name: "lavozim", label: "Lavozim", from: "account", fromKey: "lavozim" } as DocField,
  bolim: { name: "bolim", label: "Bo‘lim", from: "account", fromKey: "bolim" } as DocField,
  tugilganSana: { name: "tugilganSana", label: "Tug‘ilgan sana", type: "date", from: "anketa", fromKey: "tugilganSana" } as DocField,
  tugilganJoy: { name: "tugilganJoy", label: "Tug‘ilgan joy", from: "anketa", fromKey: "tugilganJoy" } as DocField,
  millati: { name: "millati", label: "Millati", from: "anketa", fromKey: "millati" } as DocField,
  malumoti: { name: "malumoti", label: "Ma‘lumoti", from: "anketa", fromKey: "malumoti" } as DocField,
  mutaxassisligi: { name: "mutaxassisligi", label: "Mutaxassisligi", from: "anketa", fromKey: "mutaxassisligi" } as DocField,
  manzil: { name: "manzil", label: "Manzil", from: "anketa", fromKey: "manzil" } as DocField,
  telefon: { name: "telefon", label: "Telefon", from: "anketa", fromKey: "telefon" } as DocField,
  pinfl: { name: "pinfl", label: "JSHSHIR (PINFL)", from: "anketa", fromKey: "pinfl" } as DocField,
  passportSeriya: { name: "passportSeriya", label: "Passport seriyasi", from: "anketa", fromKey: "passportSeriya" } as DocField,
  passportRaqam: { name: "passportRaqam", label: "Passport raqami", from: "anketa", fromKey: "passportRaqam" } as DocField,
  oilaviyHolati: { name: "oilaviyHolati", label: "Oilaviy holati", from: "anketa", fromKey: "oilaviyHolati" } as DocField,
};

export const DOC_TEMPLATES: DocTemplate[] = [
  {
    id: "malumotnoma",
    title: "Ma‘lumotnoma",
    description: "Xodimning tashkilotda ishlashi haqidagi rasmiy ma‘lumotnoma",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      F.passportSeriya,
      F.passportRaqam,
      F.manzil,
      { name: "maqsad", label: "Qayerga beriladi (maqsad)", required: true, placeholder: "masalan: Talab qilingan joyga" },
      { name: "sana", label: "Hujjat sanasi", type: "date", required: true },
    ],
  },
  {
    id: "obyektivka",
    title: "Obyektivka (shaxsiy varaqa)",
    description: "Xodimning to‘liq shaxsiy ma‘lumotlar varag‘i",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      F.tugilganSana,
      F.tugilganJoy,
      F.millati,
      F.malumoti,
      F.mutaxassisligi,
      F.manzil,
      F.telefon,
      F.pinfl,
      F.passportSeriya,
      F.passportRaqam,
      F.oilaviyHolati,
      { name: "sana", label: "Hujjat sanasi", type: "date", required: true },
    ],
  },
  {
    id: "mehnat-shartnoma",
    title: "Mehnat shartnomasi",
    description: "Xodim bilan tuziladigan mehnat shartnomasi loyihasi",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      F.pinfl,
      F.passportSeriya,
      F.passportRaqam,
      F.manzil,
      { name: "oylikMaosh", label: "Oylik maosh (so‘m)", type: "number", required: true, placeholder: "masalan: 5000000" },
      { name: "shartnomaMuddati", label: "Shartnoma muddati", required: true, placeholder: "masalan: 1 yil / Muddatsiz" },
      { name: "sana", label: "Shartnoma sanasi", type: "date", required: true },
    ],
  },
];

export function getTemplate(id: string): DocTemplate | undefined {
  return DOC_TEMPLATES.find((t) => t.id === id);
}
