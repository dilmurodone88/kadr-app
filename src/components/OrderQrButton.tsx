"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { btn } from "@/components/ui";
import { IconQr, IconClose } from "@/components/icons";

export interface OrderQrData {
  id: string;
  turi: string;
  employee: string;
  sana: string;
}

export function OrderQrButton({ order }: { order: OrderQrData }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const qrText = `BUYRUQ:${order.id}|${order.turi}|${order.employee}|${order.sana}`;

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${btn.base} ${btn.ghost} ${btn.sm}`}>
        <IconQr className="h-4 w-4" />
        QR ko‘rish
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Buyruq QR-imzosi"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          style={{ animation: "kadr-overlay 0.18s ease" }}
        >
          <div className="animate-in relative w-[340px] max-w-full rounded-card bg-surface p-7 text-center shadow-pop">
            <button
              aria-label="Yopish"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 cursor-pointer rounded-md p-1 text-text-mute hover:bg-surface-2"
            >
              <IconClose className="h-5 w-5" />
            </button>
            <h3 className="text-base font-semibold">Buyruq QR-imzosi</h3>
            <p className="mb-4 mt-1 text-[13px] text-text-soft">
              {order.turi}
              <br />
              {order.employee} · {order.sana}
            </p>
            <div className="flex justify-center">
              <div className="rounded-lg border border-border bg-white p-3">
                <QRCodeCanvas value={qrText} size={168} level="M" />
              </div>
            </div>
            <p className="mt-4 text-xs text-text-mute">Buyruq ID: {order.id}</p>
          </div>
        </div>
      )}
    </>
  );
}
