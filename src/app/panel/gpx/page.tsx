import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { formatDate } from "@/lib/format";
import { PageHeader, Panel, Badge, EmptyState, TableWrap, Thead } from "@/components/ui";
import { StatusActions } from "@/components/StatusActions";
import { updateReportStatus } from "@/lib/actions/reports";

export const dynamic = "force-dynamic";

export default async function GpxPage() {
  await requirePanelUser("kadr");

  const reports = await prisma.report.findMany({
    orderBy: { sana: "desc" },
    include: { employee: { select: { fio: true, username: true } } },
  });

  return (
    <>
      <PageHeader
        title="GPX ish hisobotlari"
        sub="GPX shartnomasi asosida ishlaydigan xodimlarning ish hisobotlari"
      />
      <Panel>
        {reports.length ? (
          <TableWrap>
            <Thead columns={["Xodim", "Sana", "Tavsif", "Holat", ""]} />
            <tbody>
              {reports.map((h) => (
                <tr key={h.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-3 py-2.5 font-medium">{h.employee.fio}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-text-soft">{formatDate(h.sana)}</td>
                  <td className="px-3 py-2.5 max-w-[320px] text-text-soft">{h.matn}</td>
                  <td className="px-3 py-2.5">
                    <Badge holat={h.holat} />
                  </td>
                  <td className="px-3 py-2.5">
                    {h.holat === "KORIB_CHIQILMOQDA" && (
                      <StatusActions
                        action={updateReportStatus}
                        id={h.id}
                        approveLabel="Qabul qilish"
                        rejectLabel="Qaytarish"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Hozircha hisobot yo‘q</EmptyState>
        )}
      </Panel>
    </>
  );
}
