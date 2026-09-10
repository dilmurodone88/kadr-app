import type { DocTemplate } from "@/lib/hujjatlar";

/**
 * Tanlangan shablonning to'ldirilgan ko'rinishi (jonli preview).
 * Foydalanuvchi Mehnat/GPX (yoki boshqa) tanlaganda, hujjat matni shu yerda
 * kiritilgan qiymatlar bilan ko'rsatiladi. DOCX bilan bir xil ma'lumot.
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
        {renderBody(template, v)}
      </div>
    </div>
  );
}

function Center({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-center ${className}`}>{children}</p>;
}

function renderBody(template: DocTemplate, v: (k: string) => string) {
  switch (template.id) {
    case "mehnat-shartnoma":
      return (
        <>
          <Center className="text-[15px] font-semibold uppercase tracking-wide">Mehnat shartnomasi</Center>
          <div className="mb-5 mt-1 flex justify-between text-xs text-text-mute">
            <span>Toshkent sh.</span>
            <span>{v("sana")}</span>
          </div>
          <p className="mb-3">
            Ish beruvchi tashkilot bir tomondan, va fuqaro{" "}
            <b>{v("fio")}</b> (keyingi o‘rinlarda «Xodim») ikkinchi tomondan
            quyidagilar to‘g‘risida ushbu mehnat shartnomasini tuzdilar:
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

    case "gpx-shartnoma":
      return (
        <>
          <Center className="text-[15px] font-semibold uppercase tracking-wide">
            Fuqarolik-huquqiy shartnoma (GPX)
          </Center>
          <div className="mb-5 mt-1 flex justify-between text-xs text-text-mute">
            <span>Toshkent sh.</span>
            <span>{v("sana")}</span>
          </div>
          <p className="mb-3">
            Buyurtmachi bir tomondan, va <b>{v("fio")}</b> (keyingi o‘rinlarda «Ijrochi»)
            ikkinchi tomondan quyidagilar to‘g‘risida ushbu shartnomani tuzdilar:
          </p>
          <Clause n={1}>
            Ijrochi quyidagi ish/xizmatni bajarish majburiyatini oladi: <b>{v("ishTavsifi")}</b>.
          </Clause>
          <Clause n={2}>
            Bajarilgan ish uchun shartnoma summasi <b>{v("summa")}</b> so‘mni tashkil etadi.
          </Clause>
          <Clause n={3}>
            Ishni bajarish muddati: <b>{v("muddat")}</b>.
          </Clause>
          <Clause n={4}>
            Ijrochining shaxsi: passport <b>{v("passportSeriya")} {v("passportRaqam")}</b>,
            JSHSHIR (PINFL): <b>{v("pinfl")}</b>, manzil: {v("manzil")}.
          </Clause>
          <Signatures left="Buyurtmachi" right="Ijrochi" rightName={v("fio")} />
        </>
      );

    default:
      // Umumiy ko'rinish — boshqa shablonlar uchun (ma'lumotnoma, obyektivka, buyruqlar)
      return (
        <>
          <Center className="mb-5 text-[15px] font-semibold uppercase tracking-wide">{template.title}</Center>
          <dl className="divide-y divide-border">
            {template.fields.map((f) => (
              <div key={f.name} className="flex justify-between gap-4 py-2">
                <dt className="text-text-mute">{f.label}</dt>
                <dd className="text-right font-medium">{v(f.name)}</dd>
              </div>
            ))}
          </dl>
        </>
      );
  }
}

function Clause({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="mb-2.5">
      <b>{n}.</b> {children}
    </p>
  );
}

function Signatures({
  left,
  right,
  rightName,
}: {
  left: string;
  right: string;
  rightName: string;
}) {
  return (
    <div className="mt-8 flex justify-between text-[13px]">
      <div>
        <p className="font-medium">{left}</p>
        <p className="mt-6 text-text-mute">_______________ (imzo)</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{right}</p>
        <p className="mt-1 text-text-mute">{rightName}</p>
        <p className="mt-6 text-text-mute">_______________ (imzo)</p>
      </div>
    </div>
  );
}
