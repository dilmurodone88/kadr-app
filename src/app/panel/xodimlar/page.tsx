import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { CONTRACT_LABELS } from "@/lib/labels";
import { PageHeader, Panel, EmptyState, TableWrap, Thead } from "@/components/ui";
import { EmployeeForm } from "@/components/forms/EmployeeForm";

export const dynamic = "force-dynamic";

export default async function XodimlarPage() {
  await requirePanelUser("kadr");

  const xodimlar = await prisma.account.findMany({
    where: { role: "xodim" },
    orderBy: { createdAt: "desc" },
    select: { id: true, fio: true, lavozim: true, bolim: true, shartnoma: true, username: true },
  });

  return (
    <>
      <PageHeader title="Xodimlar" sub="Xodimlar ro‘yxati va yangi xodim hisobini ochish" />

      <Panel title="Yangi xodim qo‘shish">
        <EmployeeForm />
      </Panel>

      <Panel title={`Xodimlar ro‘yxati (${xodimlar.length})`}>
        {xodimlar.length ? (
          <TableWrap>
            <Thead columns={["F.I.O.", "Lavozim", "Bo‘lim", "Shartnoma turi", "Login"]} />
            <tbody>
              {xodimlar.map((x) => (
                <tr key={x.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium">{x.fio}</td>
                  <td className="px-3 py-2.5 text-text-soft">{x.lavozim}</td>
                  <td className="px-3 py-2.5 text-text-soft">{x.bolim}</td>
                  <td className="px-3 py-2.5 text-text-soft">
                    {CONTRACT_LABELS[x.shartnoma ?? "MEHNAT"]}
                  </td>
                  <td className="px-3 py-2.5 text-text-mute">{x.username}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Hozircha xodimlar yo‘q</EmptyState>
        )}
      </Panel>
    </>
  );
}
