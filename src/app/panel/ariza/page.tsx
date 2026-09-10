import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { RequestForm } from "@/components/forms/RequestForm";

export const dynamic = "force-dynamic";

export default async function ArizaPage() {
  await requirePanelUser();

  return (
    <>
      <PageHeader title="Ariza yozish" sub="So‘rovingizni tegishli bo‘limga yuboring" />
      <Panel>
        <RequestForm />
      </Panel>
    </>
  );
}
