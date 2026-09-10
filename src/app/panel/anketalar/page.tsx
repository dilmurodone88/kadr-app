import Link from "next/link";
import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState, TableWrap, Thead, btn } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AnketalarPage() {
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

  return (
    <>
      <PageHeader title="Anketalar" sub="Xodimlarning shaxsiy anketalari" />
      <Panel>
        {xodimlar.length ? (
          <TableWrap>
            <Thead columns={["F.I.O.", "Lavozim", "Bo‘lim", "Anketa holati", ""]} />
            <tbody>
              {xodimlar.map((x) => (
                <tr key={x.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium">{x.fio}</td>
                  <td className="px-3 py-2.5 text-text-soft">{x.lavozim}</td>
                  <td className="px-3 py-2.5 text-text-soft">{x.bolim}</td>
                  <td className="px-3 py-2.5">
                    {x.anketa ? (
                      <span className="rounded-full bg-success-tint px-2.5 py-0.5 text-xs font-medium text-success">
                        To‘ldirilgan
                      </span>
                    ) : (
                      <span className="rounded-full bg-warn-tint px-2.5 py-0.5 text-xs font-medium text-warn">
                        To‘ldirilmagan
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Link href={`/panel/anketalar/${x.id}`} className={`${btn.base} ${btn.ghost} ${btn.sm}`}>
                      {x.anketa ? "Ko‘rish / tahrirlash" : "To‘ldirish"}
                    </Link>
                  </td>
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
