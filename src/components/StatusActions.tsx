import { btn } from "@/components/ui";
import { IconCheck, IconX } from "@/components/icons";

/**
 * Tasdiqlash / rad etish tugmalari — server action bilan ishlaydigan formalar.
 * `action` — updateRequestStatus yoki updateReportStatus (server action).
 */
export function StatusActions({
  action,
  id,
  approveLabel = "Tasdiqlash",
  rejectLabel = "Rad etish",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  approveLabel?: string;
  rejectLabel?: string;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="holat" value="TASDIQLANDI" />
        <button type="submit" className={`${btn.base} ${btn.success} ${btn.sm}`}>
          <IconCheck className="h-4 w-4" />
          {approveLabel}
        </button>
      </form>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="holat" value="RAD_ETILDI" />
        <button type="submit" className={`${btn.base} ${btn.danger} ${btn.sm}`}>
          <IconX className="h-4 w-4" />
          {rejectLabel}
        </button>
      </form>
    </div>
  );
}
