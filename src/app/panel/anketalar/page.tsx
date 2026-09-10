import Link from "next/link";
import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState, TableWrap, Thead, btn } from "@/components/ui";
import { AnketaCreator } from "@/components/forms/AnketaCreator";

export const dynamic = "force-dynamic";

export default async function AnketaPage() {
  await requirePanelUser("kadr");

  const xodimlar = await prisma.account.findMany({
    where: { role: "xodim" },
    orderBy: { fio: "asc" },
    select: {
      id: true,
      fio: true,
      lavozim: true,
      bolim: true,
      anketa: { select: { id: true } },
    },
  });

  const anketasiz = xodimlar
    .filter((x) => !x.anketa)
    .map((x) => ({ id: x.id, fio: x.fio, lavozim: x.lavozim }));
  const anketali = xodimlar.filter((x) => x.anketa);

  return (
    <>
      <PageHeader title="Anketa" sub="Xodimlar uchun anketa yarating va yaratilgan anketalarni ko‘ring" />

      <Panel title="Anketa yaratish">
        <AnketaCreator employees={anketasiz} />
      </Panel>

      <Panel title={`Anketalar (${anketali.length})`}>
        {anketali.length ? (
          <TableWrap>
            <Thead columns={["F.I.O.", "Lavozim", "Bo‘lim", ""]} />
            <tbody>
              {anketali.map((x) => (
                <tr key={x.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium">{x.fio}</td>
                  <td className="px-3 py-2.5 text-text-soft">{x.lavozim}</td>
                  <td className="px-3 py-2.5 text-text-soft">{x.bolim}</td>
                  <td className="px-3 py-2.5 text-right">
                    <Link href={`/panel/anketalar/${x.id}`} className={`${btn.base} ${btn.ghost} ${btn.sm}`}>
                      Ko‘rish / tahrirlash
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Hozircha yaratilgan anketa yo‘q. Yuqoridan xodim tanlab anketa yarating.</EmptyState>
        )}
      </Panel>
    </>
  );
}
