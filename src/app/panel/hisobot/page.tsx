import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { homeHref } from "@/lib/nav";
import { formatDate } from "@/lib/format";
import { PageHeader, Panel, Badge, EmptyState, TableWrap, Thead } from "@/components/ui";
import { ReportForm } from "@/components/forms/ReportForm";

export const dynamic = "force-dynamic";

export default async function HisobotPage() {
  const user = await requirePanelUser("xodim");
  // Faqat GPX shartnomasidagi xodim
  if (user.shartnoma !== "GPX") {
    redirect(homeHref(user.role, user.shartnoma));
  }

  const reports = await prisma.report.findMany({
    where: { employeeId: user.id },
    orderBy: { sana: "desc" },
    select: { id: true, matn: true, holat: true, sana: true },
  });

  return (
    <>
      <PageHeader
        title="Ish hisobotlari"
        sub="GPX shartnomasi asosida bajarilgan ishlar bo‘yicha hisobot topshiring"
      />
      <Panel title="Yangi hisobot">
        <ReportForm />
      </Panel>
      <Panel title={`Topshirilgan hisobotlarim (${reports.length})`}>
        {reports.length ? (
          <TableWrap>
            <Thead columns={["Sana", "Tavsif", "Holat"]} />
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-3 py-2.5 whitespace-nowrap text-text-soft">{formatDate(r.sana)}</td>
                  <td className="px-3 py-2.5 max-w-[360px] text-text-soft">{r.matn}</td>
                  <td className="px-3 py-2.5">
                    <Badge holat={r.holat} />
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Hali hisobot topshirmagansiz</EmptyState>
        )}
      </Panel>
    </>
  );
}
