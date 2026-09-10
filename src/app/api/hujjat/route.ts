import { NextResponse, type NextRequest } from "next/server";
import { requireRole, AuthError } from "@/lib/auth";
import { getTemplate } from "@/lib/hujjatlar";
import { buildHujjatDocx } from "@/lib/hujjat-docx";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await requireRole("kadr", "rahbar");

    const { templateId, values } = (await req.json()) as {
      templateId?: string;
      values?: Record<string, string>;
    };

    const tpl = templateId ? getTemplate(templateId) : undefined;
    if (!tpl) {
      return NextResponse.json({ error: "Noto‘g‘ri hujjat turi" }, { status: 400 });
    }

    const v = values ?? {};
    const missing = tpl.fields
      .filter((f) => f.required && !(v[f.name] ?? "").trim())
      .map((f) => f.label);
    if (missing.length) {
      return NextResponse.json(
        { error: `Majburiy maydonlarni to‘ldiring: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    const buffer = await buildHujjatDocx(tpl.id, v);
    const fioPart = (v.fio ?? "hujjat").replace(/[^\p{L}\p{N}]+/gu, "_").slice(0, 40);
    const filename = `${tpl.id}_${fioPart}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="hujjat.docx"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    console.error("Hujjat xatosi:", e);
    return NextResponse.json({ error: "Hujjat yaratishda xato yuz berdi" }, { status: 500 });
  }
}
