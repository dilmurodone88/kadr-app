"use client";

import { useEffect, useState } from "react";
import { previewHujjatHtml } from "@/lib/actions/preview";

/**
 * Real hujjatning jonli ko'rinishi — server'da buildHujjatDocx → mammoth (HTML).
 * Maydonlar o'zgarganda (debounce) yangilanadi; download bilan bir xil hujjat.
 */
export function HujjatLivePreview({
  templateId,
  values,
}: {
  templateId: string;
  values: Record<string, string>;
}) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const valuesKey = JSON.stringify(values);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await previewHujjatHtml(templateId, JSON.parse(valuesKey));
      if (cancelled) return;
      if (res.error) setError(res.error);
      else {
        setHtml(res.html ?? "");
        setError("");
      }
      setLoading(false);
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [templateId, valuesKey]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] text-text-soft">Shablon ko‘rinishi (real hujjat)</p>
        {loading && <span className="text-[11px] text-text-mute">yangilanmoqda…</span>}
      </div>
      <div className="max-h-[72vh] overflow-y-auto rounded-lg border border-border bg-white px-8 py-9 shadow-card">
        {error ? (
          <p className="text-[13px] text-danger">{error}</p>
        ) : html ? (
          <div className="hujjat-doc" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="text-[13px] text-text-mute">Ko‘rinish tayyorlanmoqda…</p>
        )}
      </div>
    </div>
  );
}
