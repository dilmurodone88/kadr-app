import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { OrdersTable } from "@/components/OrdersTable";

export const dynamic = "force-dynamic";

export default async function BuyruqlarPage() {
  const user = await requirePanelUser("rahbar", "kadr");

  const orders = await prisma.order.findMany({
    orderBy: { sana: "desc" },
    include: { employee: { select: { fio: true, username: true } } },
  });

  return (
    <>
      <PageHeader
        title={user.role === "kadr" ? "Buyruqlar arxivi" : "Buyruqlar"}
        sub="Chiqarilgan buyruqlar ro‘yxati"
      />
      <Panel>
        <OrdersTable orders={orders} showEmployee />
      </Panel>
    </>
  );
}
