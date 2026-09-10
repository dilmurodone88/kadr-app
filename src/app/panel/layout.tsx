import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getNavItems } from "@/lib/nav";
import { Shell } from "@/components/Shell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const navItems = getNavItems(user.role, user.shartnoma);

  const myRequests = await prisma.request.findMany({
    where: { employeeId: user.id },
    orderBy: { sana: "desc" },
    take: 8,
    select: { id: true, turi: true, bolim: true, holat: true },
  });

  return (
    <Shell user={user} navItems={navItems} myRequests={myRequests}>
      {children}
    </Shell>
  );
}
