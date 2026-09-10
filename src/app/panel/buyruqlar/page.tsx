import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { OrdersTable } from "@/components/OrdersTable";
import { HujjatForm } from "@/components/forms/HujjatForm";
import { templatesByCategory } from "@/lib/hujjatlar";

export const dynamic = "force-dynamic";

export default async function BuyruqlarPage() {
  await requirePanelUser("rahbar", "kadr");

  const orders = await prisma.order.findMany({
    orderBy: { sana: "desc" },
    include: { employee: { select: { fio: true, username: true } } },
  });

  return (
    <>
      <PageHeader
        title="Buyruqlar"
        sub="Shartnoma hujjatlarini (Mehnat / GPX) tayyorlang va barcha chiqarilgan buyruqlarni ko‘ring"
      />
      <Panel title="Shartnoma hujjati yaratish (Mehnat / GPX)">
        <HujjatForm templates={templatesByCategory("buyruq")} />
      </Panel>
      <Panel title={`Barcha buyruqlar (${orders.length})`}>
        <OrdersTable orders={orders} showEmployee />
      </Panel>
    </>
  );
}
