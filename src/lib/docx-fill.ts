import "server-only";
import fs from "node:fs";
import path from "node:path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

/**
 * Real .docx shablonni {teg}lar bilan to'ldiradi (docxtemplater).
 * Shablonlar loyiha ildizidagi `templates/` papkasida.
 */
export function fillDocxTemplate(
  templateFile: string,
  data: Record<string, string>,
): Buffer {
  const filePath = path.join(process.cwd(), "templates", templateFile);
  const content = fs.readFileSync(filePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "{", end: "}" },
    nullGetter: () => "________", // to'ldirilmagan teglar uchun chiziqcha
  });
  doc.render(data);
  return doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });
}
