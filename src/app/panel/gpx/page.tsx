import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { homeHref } from "@/lib/nav";
import { formatDate } from "@/lib/format";
import { PageHeader, Panel, Badge, EmptyState, TableWrap } from "@/components/ui";
import { StatusActions } from "@/components/StatusActions";
import { updateReportStatus } from "@/lib/actions/reports";

export const dynamic = "force-dynamic";

export default async function GpxPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "kadr") redirect(homeHref(user.role, user.shartnoma));

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
            <thead>
              <tr>
                {["Xodim", "Sana", "Tavsif", "Holat", ""].map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-3 py-2.5 text-left text-xs font-medium text-text-mute"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
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
