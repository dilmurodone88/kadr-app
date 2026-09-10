import Link from "next/link";
import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState, TableWrap, Thead, btn } from "@/components/ui";
import { AnketaCandidateForm } from "@/components/forms/AnketaCandidateForm";

export const dynamic = "force-dynamic";

export default async function AnketaPage() {
  await requirePanelUser("kadr");

  // Faqat nomzod anketalari (hali ishga olinmagan — accountId yo'q)
  const nomzodlar = await prisma.anketa.findMany({
    where: { accountId: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, fio: true, lavozim: true, bolim: true, createdAt: true },
  });

  return (
    <>
      <PageHeader
        title="Anketa"
        sub="Ishga olinishi kerak bo‘lgan yangi nomzodlar uchun anketa yarating"
      />

      <Panel title="Anketa yaratish">
        <AnketaCandidateForm />
      </Panel>

      <Panel title={`Anketalar (${nomzodlar.length})`}>
        {nomzodlar.length ? (
          <TableWrap>
            <Thead columns={["F.I.O.", "Ko‘zlanayotgan lavozim", "Bo‘lim", "Qo‘shilgan", ""]} />
            <tbody>
              {nomzodlar.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium">{a.fio}</td>
                  <td className="px-3 py-2.5 text-text-soft">{a.lavozim || "—"}</td>
                  <td className="px-3 py-2.5 text-text-soft">{a.bolim || "—"}</td>
                  <td className="px-3 py-2.5 text-text-soft">
                    {a.createdAt.toLocaleDateString("uz-UZ")}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Link href={`/panel/anketalar/${a.id}`} className={`${btn.base} ${btn.ghost} ${btn.sm}`}>
                      Ko‘rish / tahrirlash
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState>Hozircha nomzod anketalari yo‘q. Yuqoridan yangi anketa yarating.</EmptyState>
        )}
      </Panel>
    </>
  );
}
