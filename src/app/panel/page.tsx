import { prisma } from "@/lib/prisma";
import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel, StatCard } from "@/components/ui";
import { OrderForm } from "@/components/forms/OrderForm";

export const dynamic = "force-dynamic";

export default async function PanelHome() {
  // Faqat rahbar bosh sahifada dashboard ko'radi; qolganlar o'z bo'limiga
  await requirePanelUser("rahbar");

  const [employees, ordersCount, requestsCount] = await Promise.all([
    prisma.account.findMany({
      where: { role: "xodim" },
      orderBy: { fio: "asc" },
      select: { id: true, fio: true, lavozim: true },
    }),
    prisma.order.count(),
    prisma.request.count(),
  ]);

  return (
    <>
      <PageHeader
        title="Umumiy holat"
        sub="Tashkilotdagi xodimlar va buyruqlar bo‘yicha qisqacha ma‘lumot"
      />
      <div className="mb-7 flex flex-wrap gap-4">
        <StatCard num={employees.length} label="Jami xodimlar" />
        <StatCard num={ordersCount} label="Jami buyruqlar" />
        <StatCard num={requestsCount} label="Jami arizalar" />
      </div>
      <Panel title="Yangi buyruq chiqarish">
        <OrderForm employees={employees} />
      </Panel>
    </>
  );
}
