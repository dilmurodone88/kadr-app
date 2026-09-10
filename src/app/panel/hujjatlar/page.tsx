import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { HujjatForm } from "@/components/forms/HujjatForm";
import { templatesByCategory } from "@/lib/hujjatlar";

export const dynamic = "force-dynamic";

export default async function MalumotnomaPage() {
  await requirePanelUser("kadr", "rahbar");

  return (
    <>
      <PageHeader
        title="Ma‘lumotnoma"
        sub="Ma‘lumotnoma yoki obyektivka tayyorlang — xodimni PINFL yoki F.I.O. bilan tanlang, ma‘lumotlar avtomatik to‘ldiriladi"
      />
      <Panel>
        <HujjatForm templates={templatesByCategory("malumotnoma")} />
      </Panel>
    </>
  );
}
