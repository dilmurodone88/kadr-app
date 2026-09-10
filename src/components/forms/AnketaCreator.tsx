"use client";

import { useEffect, useState } from "react";
import { AnketaForm } from "./AnketaForm";
import { Field, inputCls } from "@/components/form-fields";

type Emp = { id: string; fio: string; lavozim: string };

/**
 * Kadr bo'limi uchun "Anketa yaratish": anketasi yo'q xodimni tanlaydi va
 * shu yerda (inline) anketani to'ldiradi. Saqlangach xodim pastdagi
 * "Anketalar" ro'yxatiga o'tadi va bu tanlovdan chiqadi.
 */
export function AnketaCreator({ employees }: { employees: Emp[] }) {
  const [selectedId, setSelectedId] = useState("");
  const [justCreated, setJustCreated] = useState(false);

  // Tanlangan xodim ro'yxatdan chiqsa (anketa yaratildi) — tanlovni tozalaymiz
  useEffect(() => {
    if (selectedId && !employees.some((e) => e.id === selectedId)) {
      setSelectedId("");
      setJustCreated(true);
    }
  }, [employees, selectedId]);

  if (!employees.length) {
    return (
      <p className="text-sm text-text-soft">
        {justCreated ? "Anketa yaratildi va pastdagi ro‘yxatga qo‘shildi. " : ""}
        Barcha xodimlarning anketasi yaratilgan. Yangi xodim qo‘shsangiz, shu yerda paydo bo‘ladi.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {justCreated && (
        <p className="rounded-lg bg-success-tint px-3 py-2 text-sm text-success">
          Anketa yaratildi va pastdagi ro‘yxatga qo‘shildi.
        </p>
      )}
      <Field label="Xodimni tanlang" htmlFor="anketa-emp">
        <select
          id="anketa-emp"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setJustCreated(false);
          }}
          className={inputCls}
        >
          <option value="">— anketasi yo‘q xodimni tanlang —</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.fio} — {e.lavozim}
            </option>
          ))}
        </select>
      </Field>

      {selectedId && (
        <div className="border-t border-border pt-4">
          <AnketaForm key={selectedId} accountId={selectedId} anketa={null} submitLabel="Anketa yaratish" />
        </div>
      )}
    </div>
  );
}
