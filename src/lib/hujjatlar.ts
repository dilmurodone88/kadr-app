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

export type DocCategory = "malumotnoma" | "shartnoma" | "buyruq";

export interface DocTemplate {
  id: string;
  title: string;
  description: string;
  category: DocCategory;
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
    category: "malumotnoma",
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
    category: "malumotnoma",
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
    category: "shartnoma",
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
  {
    id: "gpx-shartnoma",
    title: "GPX shartnomasi",
    description: "Fuqarolik-huquqiy (GPX) shartnoma loyihasi",
    category: "shartnoma",
    fields: [
      F.fio,
      F.pinfl,
      F.passportSeriya,
      F.passportRaqam,
      F.manzil,
      { name: "ishTavsifi", label: "Bajariladigan ish/xizmat", type: "textarea", required: true, placeholder: "Bajariladigan ish yoki xizmat tavsifi" },
      { name: "summa", label: "Shartnoma summasi (so‘m)", type: "number", required: true, placeholder: "masalan: 3000000" },
      { name: "muddat", label: "Bajarilish muddati", required: true, placeholder: "masalan: 30 kun" },
      { name: "sana", label: "Shartnoma sanasi", type: "date", required: true },
    ],
  },

  // ── Shaxsiy tarkibga oid buyruqlar ──────────────────────────────
  {
    id: "buyruq-ishga-qabul",
    title: "Ishga qabul",
    description: "Ishga qabul qilish to‘g‘risida buyruq (real shablon asosida)",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      F.pinfl,
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 132" },
      { name: "shartnomaRaqami", label: "Mehnat shartnomasi raqami", required: true, placeholder: "masalan: 64" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
  {
    id: "buyruq-ishdan-boshatish",
    title: "Ishdan bo‘shatish",
    description: "Xodimni ishdan bo‘shatish to‘g‘risida buyruq",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      { name: "asos", label: "Asos / sabab", required: true, placeholder: "masalan: shaxsiy arizasiga ko‘ra" },
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 13-b" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
  {
    id: "buyruq-otpusk",
    title: "Otpusk (mehnat ta‘tili)",
    description: "Xodimni mehnat ta‘tiliga chiqarish to‘g‘risida buyruq",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      { name: "tatilKunlari", label: "Ta‘til kunlari (necha kun)", type: "number", required: true, placeholder: "masalan: 15" },
      { name: "boshlanishSana", label: "Ta‘til boshlanish sanasi", type: "date", required: true },
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 14-b" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
  {
    id: "buyruq-stavka",
    title: "Stavka o‘zgartirish",
    description: "Xodim stavkasini (ish haqi) o‘zgartirish to‘g‘risida buyruq",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      { name: "yangiStavka", label: "Yangi stavka / oylik (so‘m)", type: "number", required: true, placeholder: "masalan: 6000000" },
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 15-b" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
  {
    id: "buyruq-lavozim-otkazish",
    title: "Boshqa lavozimga o‘tkazish",
    description: "Xodimni boshqa lavozimga o‘tkazish to‘g‘risida buyruq",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      { name: "yangiLavozim", label: "Yangi lavozim", required: true, placeholder: "masalan: Bosh menejer" },
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 16-b" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
  {
    id: "buyruq-qoshimcha-vazifa",
    title: "Qo‘shimcha vazifa yuklash",
    description: "Xodimga qo‘shimcha vazifa yuklash to‘g‘risida buyruq",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      { name: "qoshimchaVazifa", label: "Qo‘shimcha vazifa", required: true, placeholder: "masalan: hujjatlar arxivini yuritish" },
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 17-b" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
  {
    id: "buyruq-ish-haqisiz-tatil",
    title: "Ish haqisiz ta‘til (B.S)",
    description: "Ish haqi saqlanmaydigan ta‘tilga chiqarish to‘g‘risida buyruq",
    category: "buyruq",
    fields: [
      F.fio,
      F.lavozim,
      F.bolim,
      { name: "tatilKunlari", label: "Ta‘til kunlari (necha kun)", type: "number", required: true, placeholder: "masalan: 10" },
      { name: "boshlanishSana", label: "Ta‘til boshlanish sanasi", type: "date", required: true },
      { name: "asos", label: "Sabab", required: true, placeholder: "masalan: oilaviy sharoitga ko‘ra" },
      { name: "buyruqRaqami", label: "Buyruq raqami", required: true, placeholder: "masalan: 18-b" },
      { name: "sana", label: "Buyruq sanasi", type: "date", required: true },
    ],
  },
];

export function templatesByCategory(cat: DocCategory): DocTemplate[] {
  return DOC_TEMPLATES.filter((t) => t.category === cat);
}

export function getTemplate(id: string): DocTemplate | undefined {
  return DOC_TEMPLATES.find((t) => t.id === id);
}
