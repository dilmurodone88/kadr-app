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

      {/* Bitta karta, ichida 2 qism yonma-yon */}
      <Panel>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <section>
            <h3 className="mb-4 text-[15px] font-semibold text-primary">Shartnomalar (Mehnat / GPX)</h3>
            <HujjatForm templates={templatesByCategory("shartnoma")} />
          </section>

          <section className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="mb-4 text-[15px] font-semibold text-primary">Buyruqlar (shaxsiy tarkibga oid)</h3>
            <HujjatForm templates={templatesByCategory("buyruq")} />
          </section>
        </div>
      </Panel>
    </>
  );
}
