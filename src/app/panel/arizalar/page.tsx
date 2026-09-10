import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { homeHref } from "@/lib/nav";
import { ROLE_TO_BOLIM } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { PageHeader, Panel, Badge, EmptyState, TableWrap, Thead } from "@/components/ui";
import { StatusActions } from "@/components/StatusActions";
import { updateRequestStatus } from "@/lib/actions/requests";

export const dynamic = "force-dynamic";

export default async function ArizalarPage() {
  const user = await requirePanelUser("kadr", "buxgalteriya", "it");
  const bolim = ROLE_TO_BOLIM[user.role];
  if (!bolim) redirect(homeHref(user.role, user.shartnoma));

  const requests = await prisma.request.findMany({
    where: { bolim },
    orderBy: { sana: "desc" },
    include: { employee: { select: { fio: true, username: true } } },
  });

  return (
    <>
      <PageHeader
        title="Menga yo‘naltirilgan arizalar"
        sub={`${bolim} bo‘limiga tushgan so‘rovlar`}
      />
      <Panel>
        {requests.length ? (
          <TableWrap>
            <Thead columns={["Xodim", "Turi", "Matn", "Sana", "Holat", ""]} />
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-3 py-2.5 font-medium">{r.employee.fio}</td>
                  <td className="px-3 py-2.5 text-text-soft">{r.turi}</td>
                  <td className="px-3 py-2.5 max-w-[280px] text-text-soft">{r.matn}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-text-soft">{formatDate(r.sana)}</td>
                  <td className="px-3 py-2.5">
                    <Badge holat={r.holat} />
                  </td>
                  <td className="px-3 py-2.5">
                    {r.holat === "KORIB_CHIQILMOQDA" && (
                      <StatusActions action={updateRequestStatus} id={r.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Hozircha ariza yo‘q</EmptyState>
        )}
      </Panel>
    </>
  );
}
