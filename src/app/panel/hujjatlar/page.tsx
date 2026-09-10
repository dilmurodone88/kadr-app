import { requirePanelUser } from "@/lib/guard";
import { PageHeader, Panel } from "@/components/ui";
import { HujjatForm } from "@/components/forms/HujjatForm";

export const dynamic = "force-dynamic";

export default async function HujjatlarPage() {
  await requirePanelUser("kadr", "rahbar");

  return (
    <>
      <PageHeader
        title="Hujjat yaratish"
        sub="Xodimni PINFL yoki F.I.O. bilan tanlang — ma‘lumotlar avtomatik to‘ldiriladi, qolganini kiriting va DOCX yuklab oling"
      />
      <Panel>
        <HujjatForm />
      </Panel>
    </>
  );
}
