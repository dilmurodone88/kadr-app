import { requirePanelUser } from "@/lib/guard";
import { CONTRACT_LABELS } from "@/lib/labels";
import { PageHeader, Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const user = await requirePanelUser("xodim");

  const rows: [string, string][] = [
    ["F.I.O.", user.fio],
    ["Lavozim", user.lavozim],
    ["Bo‘lim", user.bolim],
    ["Shartnoma turi", CONTRACT_LABELS[user.shartnoma ?? "MEHNAT"]],
    ["Login", user.username],
  ];

  return (
    <>
      <PageHeader title="Mening ma‘lumotlarim" sub="Shaxsiy obyektivka ma‘lumotlari" />
      <Panel>
        <dl className="divide-y divide-border">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <dt className="text-sm text-text-mute">{k}</dt>
              <dd className="text-right text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </>
  );
}
