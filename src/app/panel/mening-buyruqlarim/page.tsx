import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { homeHref } from "@/lib/nav";
import { PageHeader, Panel } from "@/components/ui";
import { OrdersTable } from "@/components/OrdersTable";

export const dynamic = "force-dynamic";

export default async function MeningBuyruqlarimPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "xodim") redirect(homeHref(user.role, user.shartnoma));

  const orders = await prisma.order.findMany({
    where: { employeeId: user.id },
    orderBy: { sana: "desc" },
    include: { employee: { select: { fio: true, username: true } } },
  });

  return (
    <>
      <PageHeader title="Mening buyruqlarim" sub="Sizga tegishli chiqarilgan buyruqlar" />
      <Panel>
        <OrdersTable orders={orders} showEmployee={false} />
      </Panel>
    </>
  );
}
