import type { Order, Account } from "@prisma/client";
import { Badge, EmptyState, TableWrap } from "@/components/ui";
import { OrderQrButton } from "@/components/OrderQrButton";
import { formatDate } from "@/lib/format";

export type OrderWithEmployee = Order & { employee: Pick<Account, "fio" | "username"> };

export function OrdersTable({
  orders,
  showEmployee,
}: {
  orders: OrderWithEmployee[];
  showEmployee: boolean;
}) {
  if (!orders.length) {
    return <EmptyState>Hozircha buyruq yo‘q</EmptyState>;
  }

  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Turi</Th>
          {showEmployee && <Th>Xodim</Th>}
          <Th>Sana</Th>
          <Th>Holat</Th>
          <Th className="text-right">Amal</Th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="border-b border-border last:border-0">
            <Td>{o.turi}</Td>
            {showEmployee && <Td>{o.employee.fio}</Td>}
            <Td className="whitespace-nowrap text-text-soft">{formatDate(o.sana)}</Td>
            <Td>
              <Badge holat={o.holat} />
            </Td>
            <Td className="text-right">
              <OrderQrButton
                order={{
                  id: o.id,
                  turi: o.turi,
                  employee: o.employee.fio,
                  sana: formatDate(o.sana),
                }}
              />
            </Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`border-b border-border px-3 py-2.5 text-left text-xs font-medium text-text-mute ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 align-middle ${className}`}>{children}</td>;
}
