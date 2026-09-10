import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel } from "@/components/ui";
import { AnketaForm } from "@/components/forms/AnketaForm";

export const dynamic = "force-dynamic";

export default async function AnketaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePanelUser("kadr");
  const { id } = await params;

  const account = await prisma.account.findUnique({
    where: { id },
    include: { anketa: true },
  });
  if (!account || account.role !== "xodim") notFound();

  return (
    <>
      <PageHeader title={`Anketa — ${account.fio}`} sub={`${account.lavozim} · ${account.bolim}`} />
      <Panel>
        <AnketaForm accountId={account.id} anketa={account.anketa} />
      </Panel>
      <Link href="/panel/anketalar" className="text-sm text-primary hover:text-primary-dark">
        ← Anketalar ro‘yxatiga qaytish
      </Link>
    </>
  );
}
