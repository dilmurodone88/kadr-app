import "server-only";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { formatDate } from "@/lib/format";

type Vals = Record<string, string>;

const FONT = "Times New Roman";
const SIZE = 24; // 12pt

function val(v: Vals, k: string): string {
  return (v[k] ?? "").trim() || "________";
}

function title(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text, bold: true, size: 32, font: FONT })],
  });
}

function body(runs: TextRun[]): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 320 },
    children: runs,
  });
}

function t(text: string, bold = false): TextRun {
  return new TextRun({ text, bold, size: SIZE, font: FONT });
}

function sanaVal(v: Vals): string {
  const s = (v.sana ?? "").trim();
  return s ? formatDate(s) : "«___» __________ 20___ y.";
}

function signature(): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 400 }, children: [t("Tashkilot rahbari: _______________________")] }),
    new Paragraph({ spacing: { before: 120 }, children: [t("M.O‘.")] }),
  ];
}

/** Yorliq: qiymat qatorli jadval (obyektivka uchun) */
function kvTable(rows: [string, string][]): Table {
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
    rows: rows.map(
      ([k, val]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 38, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [t(k)] })],
            }),
            new TableCell({
              width: { size: 62, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [t(val || "________", true)] })],
            }),
          ],
        }),
    ),
  });
}

function malumotnoma(v: Vals): (Paragraph | Table)[] {
  const passport = `${val(v, "passportSeriya")} ${val(v, "passportRaqam")}`.trim();
  return [
    title("MA‘LUMOTNOMA"),
    body([
      t("Ushbu ma‘lumotnoma "),
      t(val(v, "fio"), true),
      t("ga berilib, u haqiqatan ham "),
      t(val(v, "bolim"), true),
      t(" bo‘limida "),
      t(val(v, "lavozim"), true),
      t(" lavozimida faoliyat yuritayotganligini tasdiqlaydi."),
    ]),
    body([t(`Passport ma‘lumotlari: ${passport}. Yashash manzili: ${val(v, "manzil")}.`)]),
    body([
      t("Mazkur ma‘lumotnoma "),
      t(val(v, "maqsad"), true),
      t(" taqdim etish uchun berildi."),
    ]),
    new Paragraph({ spacing: { before: 200 }, children: [t(`Sana: ${sanaVal(v)}`)] }),
    ...signature(),
  ];
}

function obyektivka(v: Vals): (Paragraph | Table)[] {
  const passport = `${val(v, "passportSeriya")} ${val(v, "passportRaqam")}`.trim();
  const ts = (v.tugilganSana ?? "").trim();
  return [
    title("OBYEKTIVKA"),
    kvTable([
      ["F.I.O.", val(v, "fio")],
      ["Tug‘ilgan sana", ts ? formatDate(ts) : "________"],
      ["Tug‘ilgan joy", val(v, "tugilganJoy")],
      ["Millati", val(v, "millati")],
      ["Ma‘lumoti", val(v, "malumoti")],
      ["Mutaxassisligi", val(v, "mutaxassisligi")],
      ["Lavozimi", val(v, "lavozim")],
      ["Bo‘limi", val(v, "bolim")],
      ["Yashash manzili", val(v, "manzil")],
      ["Telefon", val(v, "telefon")],
      ["JSHSHIR (PINFL)", val(v, "pinfl")],
      ["Passport", passport],
      ["Oilaviy holati", val(v, "oilaviyHolati")],
    ]),
    new Paragraph({ spacing: { before: 300 }, children: [t(`Sana: ${sanaVal(v)}`)] }),
    new Paragraph({ spacing: { before: 200 }, children: [t("Imzo: _______________________")] }),
  ];
}

function mehnatShartnoma(v: Vals): (Paragraph | Table)[] {
  const passport = `${val(v, "passportSeriya")} ${val(v, "passportRaqam")}`.trim();
  return [
    title("MEHNAT SHARTNOMASI"),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 240 },
      children: [t(sanaVal(v))],
    }),
    body([
      t("Ish beruvchi (tashkilot) bir tomondan va xodim "),
      t(val(v, "fio"), true),
      t(` (JSHSHIR: ${val(v, "pinfl")}, passport: ${passport}, yashash manzili: ${val(v, "manzil")}) ikkinchi tomondan quyidagilar to‘g‘risida ushbu shartnomani tuzdilar:`),
    ]),
    body([t("1. Xodim "), t(val(v, "bolim"), true), t(" bo‘limiga "), t(val(v, "lavozim"), true), t(" lavozimiga ishga qabul qilinadi.")]),
    body([t(`2. Xodimga oylik ish haqi ${val(v, "oylikMaosh")} so‘m miqdorida belgilanadi.`)]),
    body([t(`3. Shartnoma muddati: ${val(v, "shartnomaMuddati")}.`)]),
    body([t("4. Tomonlarning huquq va majburiyatlari O‘zbekiston Respublikasi Mehnat kodeksi bilan tartibga solinadi.")]),
    new Paragraph({
      spacing: { before: 500 },
      children: [t("Ish beruvchi: __________________         Xodim: __________________")],
    }),
  ];
}

function gpxShartnoma(v: Vals): (Paragraph | Table)[] {
  const passport = `${val(v, "passportSeriya")} ${val(v, "passportRaqam")}`.trim();
  return [
    title("FUQAROLIK-HUQUQIY (GPX) SHARTNOMA"),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 240 },
      children: [t(sanaVal(v))],
    }),
    body([
      t("Buyurtmachi (tashkilot) bir tomondan va ijrochi "),
      t(val(v, "fio"), true),
      t(` (JSHSHIR: ${val(v, "pinfl")}, passport: ${passport}, manzil: ${val(v, "manzil")}) ikkinchi tomondan quyidagi shartnomani tuzdilar:`),
    ]),
    body([t("1. Ijrochi quyidagi ish/xizmatni bajarish majburiyatini oladi: "), t(val(v, "ishTavsifi"), true), t(".")]),
    body([t(`2. Ish/xizmat uchun to‘lov ${val(v, "summa")} so‘m miqdorida belgilanadi.`)]),
    body([t(`3. Bajarilish muddati: ${val(v, "muddat")}.`)]),
    body([t("4. Tomonlarning huquq va majburiyatlari O‘zbekiston Respublikasi Fuqarolik kodeksi bilan tartibga solinadi.")]),
    new Paragraph({
      spacing: { before: 500 },
      children: [t("Buyurtmachi: __________________         Ijrochi: __________________")],
    }),
  ];
}

// ── Shaxsiy tarkibga oid buyruqlar ────────────────────────────────
function dateVal(v: Vals, key: string): string {
  const s = (v[key] ?? "").trim();
  return s ? formatDate(s) : "________";
}

/** Buyruq hujjatining umumiy karkasi: sarlavha, raqam/sana, mazmun, imzo */
function buyruqDoc(v: Vals, subtitle: string, bodyParas: Paragraph[]): (Paragraph | Table)[] {
  return [
    title("BUYRUQ"),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [t(`№ ${val(v, "buyruqRaqami")}`)] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [t(sanaVal(v))] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [t(subtitle, true)] }),
    ...bodyParas,
    ...signature(),
  ];
}

function buyruqIshgaQabul(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Ishga qabul qilish to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "bolim")} bo‘limiga ${val(v, "lavozim")} lavozimiga ${sanaVal(v)} dan ishga qabul qilinsin.`)]),
    ...(v.oylikMaosh?.trim() ? [body([t(`Unga oylik ish haqi ${val(v, "oylikMaosh")} so‘m miqdorida belgilansin.`)])] : []),
    body([t("Asos: xodimning shaxsiy arizasi va mehnat shartnomasi.")]),
  ]);
}

function buyruqIshdanBoshatish(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Ishdan bo‘shatish to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "lavozim")} lavozimidan ${sanaVal(v)} dan ishdan bo‘shatilsin.`)]),
    body([t(`Asos: ${val(v, "asos")}.`)]),
  ]);
}

function buyruqOtpusk(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Mehnat ta‘tiliga chiqarish to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "lavozim")} ga ${dateVal(v, "boshlanishSana")} dan boshlab ${val(v, "tatilKunlari")} kun mehnat ta‘tili berilsin.`)]),
    body([t("Asos: mehnat ta‘tillari jadvali va xodimning arizasi.")]),
  ]);
}

function buyruqStavka(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Stavka (ish haqi) o‘zgartirish to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "lavozim")} ning oylik ish haqi (stavkasi) ${sanaVal(v)} dan ${val(v, "yangiStavka")} so‘m etib belgilansin.`)]),
    body([t("Asos: tashkilot shtat jadvali.")]),
  ]);
}

function buyruqLavozimOtkazish(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Boshqa lavozimga o‘tkazish to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "lavozim")} lavozimidan ${val(v, "yangiLavozim")} lavozimiga ${sanaVal(v)} dan o‘tkazilsin.`)]),
    body([t("Asos: xodimning roziligi va tashkilot ehtiyoji.")]),
  ]);
}

function buyruqQoshimchaVazifa(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Qo‘shimcha vazifa yuklash to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "lavozim")} ga asosiy ish vazifalaridan tashqari ${sanaVal(v)} dan `), t(val(v, "qoshimchaVazifa"), true), t(" vazifasi yuklansin.")]),
    body([t("Asos: tashkilot ehtiyoji.")]),
  ]);
}

function buyruqIshHaqisizTatil(v: Vals): (Paragraph | Table)[] {
  return buyruqDoc(v, "Ish haqi saqlanmaydigan ta‘tilga chiqarish to‘g‘risida", [
    body([t(val(v, "fio"), true), t(` — ${val(v, "lavozim")} ga ${dateVal(v, "boshlanishSana")} dan boshlab ${val(v, "tatilKunlari")} kun ish haqi saqlanmagan holda ta‘til berilsin.`)]),
    body([t(`Asos: ${val(v, "asos")}.`)]),
  ]);
}

const BUILDERS: Record<string, (v: Vals) => (Paragraph | Table)[]> = {
  malumotnoma,
  obyektivka,
  "mehnat-shartnoma": mehnatShartnoma,
  "gpx-shartnoma": gpxShartnoma,
  "buyruq-ishga-qabul": buyruqIshgaQabul,
  "buyruq-ishdan-boshatish": buyruqIshdanBoshatish,
  "buyruq-otpusk": buyruqOtpusk,
  "buyruq-stavka": buyruqStavka,
  "buyruq-lavozim-otkazish": buyruqLavozimOtkazish,
  "buyruq-qoshimcha-vazifa": buyruqQoshimchaVazifa,
  "buyruq-ish-haqisiz-tatil": buyruqIshHaqisizTatil,
};

export async function buildHujjatDocx(templateId: string, values: Vals): Promise<Buffer> {
  const builder = BUILDERS[templateId];
  if (!builder) throw new Error("Noma'lum hujjat turi");

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: SIZE } },
      },
    },
    sections: [
      {
        properties: {},
        children: builder(values) as Paragraph[],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
