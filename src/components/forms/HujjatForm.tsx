"use client";

import { useState } from "react";
import { getTemplate, type DocField, type DocTemplate } from "@/lib/hujjatlar";
import { searchXodim, type XodimMatch } from "@/lib/actions/hujjat";
import { btn } from "@/components/ui";
import { Field, inputCls, labelCls } from "@/components/form-fields";
import { IconSearch, IconDownload } from "@/components/icons";

function autofillValue(f: DocField, m: XodimMatch): string {
  if (!f.from) return "";
  if (f.from === "account") return (m[f.fromKey as "fio" | "lavozim" | "bolim"] as string) ?? "";
  if (f.from === "anketa") return m.anketa?.[f.fromKey ?? ""] ?? "";
  return "";
}

function buildValues(templateId: string, m: XodimMatch | null): Record<string, string> {
  const tpl = getTemplate(templateId);
  const out: Record<string, string> = {};
  tpl?.fields.forEach((f) => {
    out[f.name] = m ? autofillValue(f, m) : "";
  });
  return out;
}

export function HujjatForm({ templates }: { templates: DocTemplate[] }) {
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<XodimMatch[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<XodimMatch | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() => buildValues(templates[0].id, null));
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const template = getTemplate(templateId)!;

  function changeTemplate(id: string) {
    setTemplateId(id);
    setValues(buildValues(id, selected));
    setError("");
  }

  async function doSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setSearched(false);
    try {
      const res = await searchXodim(query);
      setMatches(res);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  }

  function selectMatch(m: XodimMatch) {
    setSelected(m);
    setValues(buildValues(templateId, m));
    setMatches([]);
    setSearched(false);
  }

  function setVal(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function download() {
    setError("");
    setDownloading(true);
    try {
      const res = await fetch("/api/hujjat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, values }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Hujjat yaratib bo‘lmadi");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateId}_${(values.fio || "hujjat").replace(/\s+/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Tarmoq xatosi — qayta urinib ko‘ring");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Hujjat turi */}
      <div>
        <p className={labelCls}>Hujjat turi</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => changeTemplate(tpl.id)}
              aria-pressed={templateId === tpl.id}
              className={`cursor-pointer rounded-lg border p-3 text-left transition-colors duration-200 ${
                templateId === tpl.id
                  ? "border-primary bg-primary-tint"
                  : "border-border bg-surface hover:bg-surface-2"
              }`}
            >
              <span className="block text-sm font-medium">{tpl.title}</span>
              <span className="mt-0.5 block text-xs text-text-mute">{tpl.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Xodimni qidirish */}
      <div>
        <p className={labelCls}>Xodimni qidirish (PINFL yoki F.I.O.) — ma‘lumotlar avtomatik to‘ldiriladi</p>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doSearch();
              }
            }}
            placeholder="masalan: Bobur Toshev yoki 12345678901234"
            className={inputCls}
          />
          <button type="button" onClick={doSearch} disabled={searching} className={`${btn.base} ${btn.ghost} ${btn.md} shrink-0`}>
            <IconSearch className="h-4 w-4" />
            {searching ? "Qidirilmoqda…" : "Qidirish"}
          </button>
        </div>

        {searched && matches.length === 0 && (
          <p className="mt-2 text-[13px] text-text-mute">Xodim topilmadi.</p>
        )}
        {matches.length > 0 && (
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
            {matches.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => selectMatch(m)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-surface-2"
                >
                  <span className="font-medium">{m.fio}</span>
                  <span className="text-xs text-text-mute">
                    {m.lavozim} · {m.anketa?.pinfl ? `PINFL: ${m.anketa.pinfl}` : "anketa yo‘q"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {selected && (
          <p className="mt-2 text-[13px] text-success">
            Tanlandi: <span className="font-medium">{selected.fio}</span>
            {!selected.anketa && " — anketasi to‘ldirilmagan, maydonlarni qo‘lda kiriting"}
          </p>
        )}
      </div>

      {/* 3. Maydonlar */}
      <div>
        <p className={labelCls}>Hujjat maydonlari (tahrirlash mumkin, * — majburiy)</p>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {template.fields.map((f) => {
            const isTextarea = f.type === "textarea";
            return (
              <div key={f.name} className={isTextarea ? "sm:col-span-2" : ""}>
                <Field
                  label={`${f.label}${f.required ? " *" : ""}`}
                  htmlFor={`hf-${f.name}`}
                >
                  {isTextarea ? (
                    <textarea
                      id={`hf-${f.name}`}
                      rows={3}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setVal(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className={`${inputCls} resize-y`}
                    />
                  ) : (
                    <input
                      id={`hf-${f.name}`}
                      type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setVal(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className={inputCls}
                    />
                  )}
                </Field>
                {f.from && (
                  <span className="mt-1 block text-[11px] text-text-mute">Anketadan avto-to‘ldirildi</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={download} disabled={downloading} className={`${btn.base} ${btn.primary} ${btn.md}`}>
          <IconDownload className="h-[18px] w-[18px]" />
          {downloading ? "Tayyorlanmoqda…" : "DOCX hujjatni yuklab olish"}
        </button>
        {error && <span className="text-[13px] text-danger">{error}</span>}
      </div>
    </div>
  );
}
