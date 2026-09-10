import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { HujjatForm } from "@/components/forms/HujjatForm";
import { templatesByCategory } from "@/lib/hujjatlar";

export const dynamic = "force-dynamic";

export default async function ShartnomalarPage() {
  await requirePanelUser("rahbar", "kadr");

  return (
    <>
      <PageHeader
        title="Shartnomalar"
        sub="Mehnat va GPX shartnoma hujjatlarini tayyorlang — xodimni tanlang, ma‘lumotlar avtomatik to‘ldiriladi"
      />
      <Panel>
        <HujjatForm templates={templatesByCategory("shartnoma")} />
      </Panel>
    </>
  );
}
