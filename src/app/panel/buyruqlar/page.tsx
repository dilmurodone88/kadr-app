import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { HujjatForm } from "@/components/forms/HujjatForm";
import { templatesByCategory } from "@/lib/hujjatlar";

export const dynamic = "force-dynamic";

export default async function BuyruqlarPage() {
  await requirePanelUser("rahbar", "kadr");

  return (
    <>
      <PageHeader
        title="Buyruqlar"
        sub="Shartnoma va shaxsiy tarkibga oid buyruq hujjatlarini tayyorlang"
      />

      <Panel title="Shartnomalar (Mehnat / GPX)">
        <HujjatForm templates={templatesByCategory("shartnoma")} />
      </Panel>

      <Panel title="Buyruqlar (shaxsiy tarkibga oid)">
        <HujjatForm templates={templatesByCategory("buyruq")} />
      </Panel>
    </>
  );
}
