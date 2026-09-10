import Link from "next/link";
import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { CONTRACT_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { PageHeader, Panel, EmptyState, btn } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const user = await requirePanelUser("xodim");
  const anketa = await prisma.anketa.findUnique({ where: { accountId: user.id } });

  const basic: [string, string][] = [
    ["F.I.O.", user.fio],
    ["Lavozim", user.lavozim],
    ["Bo‘lim", user.bolim],
    ["Shartnoma turi", CONTRACT_LABELS[user.shartnoma ?? "MEHNAT"]],
    ["Login", user.username],
  ];

  const anketaRows: [string, string | null][] = anketa
    ? [
        ["Tug‘ilgan sana", anketa.tugilganSana ? formatDate(anketa.tugilganSana) : null],
        ["Tug‘ilgan joy", anketa.tugilganJoy],
        ["Millati", anketa.millati],
        ["Ma‘lumoti", anketa.malumoti],
        ["Mutaxassisligi", anketa.mutaxassisligi],
        ["Manzil", anketa.manzil],
        ["Telefon", anketa.telefon],
        ["JSHSHIR (PINFL)", anketa.pinfl],
        [
          "Passport",
          anketa.passportSeriya || anketa.passportRaqam
            ? `${anketa.passportSeriya ?? ""} ${anketa.passportRaqam ?? ""}`.trim()
            : null,
        ],
        ["Oilaviy holati", anketa.oilaviyHolati],
        ["Qo‘shimcha", anketa.qoshimcha],
      ]
    : [];

  const filledRows = anketaRows.filter(([, v]) => v);

  return (
    <>
      <PageHeader title="Mening ma‘lumotlarim" sub="Shaxsiy obyektivka ma‘lumotlari" />

      <Panel title="Asosiy ma‘lumotlar">
        <dl className="divide-y divide-border">
          {basic.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <dt className="text-sm text-text-mute">{k}</dt>
              <dd className="text-right text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Anketa (shaxsiy ma‘lumotlar)">
        {filledRows.length ? (
          <>
            <dl className="divide-y divide-border">
              {filledRows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3 first:pt-0">
                  <dt className="text-sm text-text-mute">{k}</dt>
                  <dd className="max-w-[60%] text-right text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/panel/anketa" className={`${btn.base} ${btn.ghost} ${btn.sm} mt-4`}>
              Anketani tahrirlash
            </Link>
          </>
        ) : (
          <div className="space-y-3">
            <EmptyState>Anketa hali to‘ldirilmagan</EmptyState>
            <Link href="/panel/anketa" className={`${btn.base} ${btn.primary} ${btn.md}`}>
              Anketani to‘ldirish
            </Link>
          </div>
        )}
      </Panel>
    </>
  );
}
