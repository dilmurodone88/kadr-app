import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState, TableWrap, Thead } from "@/components/ui";
import { HujjatForm } from "@/components/forms/HujjatForm";
import { templatesByCategory } from "@/lib/hujjatlar";

export const dynamic = "force-dynamic";

export default async function ShartnomalarPage() {
  await requirePanelUser("rahbar", "kadr");

  // Anketaga kiritilgan shaxslar (nomzodlar) — shartnoma tuzish uchun ro'yxat
  const nomzodlar = await prisma.anketa.findMany({
    where: { accountId: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, fio: true, lavozim: true, bolim: true, pinfl: true },
  });

  return (
    <>
      <PageHeader
        title="Shartnomalar"
        sub="Mehnat va GPX shartnoma hujjatlarini tayyorlang — xodimni tanlang, ma‘lumotlar avtomatik to‘ldiriladi"
      />
      <Panel>
        <HujjatForm templates={templatesByCategory("shartnoma")} />
      </Panel>

      <Panel title={`Anketadagi shaxslar (${nomzodlar.length})`}>
        {nomzodlar.length ? (
          <TableWrap>
            <Thead columns={["F.I.O.", "Lavozim", "Bo‘lim", "PINFL"]} />
            <tbody>
              {nomzodlar.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium">{a.fio}</td>
                  <td className="px-3 py-2.5 text-text-soft">{a.lavozim || "—"}</td>
                  <td className="px-3 py-2.5 text-text-soft">{a.bolim || "—"}</td>
                  <td className="px-3 py-2.5 text-text-mute">{a.pinfl || "—"}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Anketaga hali shaxs kiritilmagan. «Anketa» bo‘limidan qo‘shing.</EmptyState>
        )}
      </Panel>
    </>
  );
}
