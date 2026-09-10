import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { homeHref } from "@/lib/nav";
import { PageHeader, Panel } from "@/components/ui";
import { OrdersTable } from "@/components/OrdersTable";

export const dynamic = "force-dynamic";

export default async function BuyruqlarPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "rahbar" && user.role !== "kadr") {
    redirect(homeHref(user.role, user.shartnoma));
  }

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
