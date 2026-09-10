"use server";

import mammoth from "mammoth";
import { requireRole } from "@/lib/auth";
import { getTemplate } from "@/lib/hujjatlar";
import { buildHujjatDocx } from "@/lib/hujjat-docx";

export interface PreviewResult {
  html?: string;
  error?: string;
}

/**
 * Real hujjatni (download bilan bir xil) HTML ko'rinishga aylantiradi:
 * buildHujjatDocx(templateId, values) → .docx buffer → mammoth → HTML.
 * Shu tariqa preview aynan real shablonni (GPX = docxtemplater, Mehnat =
 * programmatik) ko'rsatadi va bo'sh maydonlar "________" bo'lib chiqadi.
 */
export async function previewHujjatHtml(
  templateId: string,
  values: Record<string, string>,
): Promise<PreviewResult> {
  await requireRole("kadr", "rahbar");

  const tpl = getTemplate(templateId);
  if (!tpl) return { error: "Noto‘g‘ri hujjat turi" };

  try {
    const buffer = await buildHujjatDocx(templateId, values);
    const { value } = await mammoth.convertToHtml({ buffer });
    return { html: value };
  } catch (e) {
    console.error("Preview xatosi:", e);
    return { error: "Ko‘rinishni yaratib bo‘lmadi" };
  }
}
