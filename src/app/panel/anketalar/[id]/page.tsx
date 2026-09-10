import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel } from "@/components/ui";
import { AnketaCandidateForm } from "@/components/forms/AnketaCandidateForm";

export const dynamic = "force-dynamic";

export default async function AnketaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePanelUser("kadr");
  const { id } = await params;

  // Nomzod anketasi (accountId yo'q)
  const anketa = await prisma.anketa.findUnique({ where: { id } });
  if (!anketa || anketa.accountId) notFound();

  return (
    <>
      <PageHeader title={`Anketa — ${anketa.fio || "nomsiz"}`} sub="Nomzod anketasini ko‘rish va tahrirlash" />
      <Panel>
        <AnketaCandidateForm anketa={anketa} />
      </Panel>
      <Link href="/panel/anketalar" className="text-sm text-primary hover:text-primary-dark">
        ← Anketa bo‘limiga qaytish
      </Link>
    </>
  );
}
