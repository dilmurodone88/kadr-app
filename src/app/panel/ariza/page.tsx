import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { PageHeader, Panel } from "@/components/ui";
import { RequestForm } from "@/components/forms/RequestForm";

export const dynamic = "force-dynamic";

export default async function ArizaPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <>
      <PageHeader title="Ariza yozish" sub="So‘rovingizni tegishli bo‘limga yuboring" />
      <Panel>
        <RequestForm />
      </Panel>
    </>
  );
}
