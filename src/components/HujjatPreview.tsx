import type { DocField, DocTemplate } from "@/lib/hujjatlar";

/**
 * Tanlangan shablonning to'ldirilgan ko'rinishi (jonli preview).
 * Mehnat shartnomasi uchun to'liq matn; qolgan (GPX, ma'lumotnoma, buyruq...)
 * uchun shablon maydonlaridan DINAMIK hujjat ko'rinishi — shablon maydonlari
 * o'zgarsa ham avtomatik moslashadi (drift bo'lmaydi).
 */
export function HujjatPreview({
  template,
  values,
}: {
  template: DocTemplate;
  values: Record<string, string>;
}) {
  const v = (key: string) => {
    const val = (values[key] ?? "").trim();
    return val || "____________";
  };

  return (
    <div>
      <p className="mb-2 text-[13px] text-text-soft">Shablon ko‘rinishi (jonli)</p>
      <div className="mx-auto max-w-[720px] rounded-lg border border-border bg-white px-8 py-9 leading-relaxed text-[13.5px] text-[#1b1b18] shadow-card">
        {template.id === "mehnat-shartnoma" ? (
          <MehnatShartnoma v={v} />
        ) : (
          <GenericHujjat template={template} v={v} />
        )}
      </div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-[15px] font-semibold uppercase tracking-wide">{children}</p>;
}

function Clause({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="mb-2.5">
      <b>{n}.</b> {children}
    </p>
  );
}

function Signatures({ left, right, rightName }: { left: string; right: string; rightName: string }) {
  return (
    <div className="mt-8 flex justify-between text-[13px]">
      <div>
        <p className="font-medium">{left}</p>
        <p className="mt-6 text-text-mute">_______________ (imzo)</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{right}</p>
        {rightName && <p className="mt-1 text-text-mute">{rightName}</p>}
        <p className="mt-6 text-text-mute">_______________ (imzo)</p>
      </div>
    </div>
  );
}

function MehnatShartnoma({ v }: { v: (k: string) => string }) {
  return (
    <>
      <Center>Mehnat shartnomasi</Center>
      <div className="mb-5 mt-1 flex justify-between text-xs text-text-mute">
        <span>Toshkent sh.</span>
        <span>{v("sana")}</span>
      </div>
      <p className="mb-3">
        Ish beruvchi tashkilot bir tomondan, va fuqaro <b>{v("fio")}</b> (keyingi
        o‘rinlarda «Xodim») ikkinchi tomondan quyidagilar to‘g‘risida ushbu mehnat
        shartnomasini tuzdilar:
      </p>
      <Clause n={1}>
        Xodim <b>{v("bolim")}</b> bo‘limiga <b>{v("lavozim")}</b> lavozimiga ishga qabul qilinadi.
      </Clause>
      <Clause n={2}>
        Xodimga oylik ish haqi <b>{v("oylikMaosh")}</b> so‘m miqdorida belgilanadi.
      </Clause>
      <Clause n={3}>
        Shartnoma muddati: <b>{v("shartnomaMuddati")}</b>.
      </Clause>
      <Clause n={4}>
        Xodimning shaxsini tasdiqlovchi hujjat: passport <b>{v("passportSeriya")} {v("passportRaqam")}</b>,
        JSHSHIR (PINFL): <b>{v("pinfl")}</b>, manzil: {v("manzil")}.
      </Clause>
      <Clause n={5}>
        Tomonlarning huquq va majburiyatlari O‘zbekiston Respublikasi Mehnat kodeksi bilan tartibga solinadi.
      </Clause>
      <Signatures left="Ish beruvchi" right="Xodim" rightName={v("fio")} />
    </>
  );
}

/** Dinamik hujjat: shablon maydonlaridan (label — qiymat) tuziladi */
function GenericHujjat({ template, v }: { template: DocTemplate; v: (k: string) => string }) {
  const dateField = template.fields.find((f) => f.type === "date");
  const bodyFields = template.fields.filter((f) => f.type !== "date");

  const isShartnoma = template.category === "shartnoma";
  const [left, right] = isShartnoma ? ["Buyurtmachi", "Ijrochi"] : ["Rahbar", "Tanishdim"];

  return (
    <>
      <Center>{template.title}</Center>
      <div className="mb-5 mt-1 flex justify-between text-xs text-text-mute">
        <span>Toshkent sh.</span>
        {dateField && <span>{v(dateField.name)}</span>}
      </div>

      {template.fields.some((f) => f.name === "fio") && (
        <p className="mb-4">
          Quyidagi shaxsga nisbatan ushbu hujjat rasmiylashtirildi:{" "}
          <b>{v("fio")}</b>.
        </p>
      )}

      <dl className="divide-y divide-border">
        {bodyFields.map((f: DocField) => (
          <div key={f.name} className="flex justify-between gap-4 py-2">
            <dt className="text-text-mute">{f.label}</dt>
            <dd className="max-w-[60%] text-right font-medium">{v(f.name)}</dd>
          </div>
        ))}
      </dl>

      <Signatures left={left} right={right} rightName={template.fields.some((f) => f.name === "fio") ? v("fio") : ""} />
    </>
  );
}
