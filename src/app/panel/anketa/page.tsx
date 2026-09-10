import { requirePanelUser } from "@/lib/guard";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel } from "@/components/ui";
import { AnketaForm } from "@/components/forms/AnketaForm";

export const dynamic = "force-dynamic";

export default async function MeningAnketam() {
  const user = await requirePanelUser("xodim");
  const anketa = await prisma.anketa.findUnique({ where: { accountId: user.id } });

  return (
    <>
      <PageHeader
        title="Mening anketam"
        sub="Shaxsiy ma‘lumotlaringizni to‘ldiring va saqlang. Kadr bo‘limi bu ma‘lumotlarni ko‘ra oladi."
      />
      <Panel>
        <AnketaForm accountId={user.id} anketa={anketa} />
      </Panel>
    </>
  );
}
