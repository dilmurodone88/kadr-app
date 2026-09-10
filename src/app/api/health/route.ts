import { NextResponse } from "next/server";

// Docker healthcheck uchun — Next ishga tushganini bildiradi
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", service: "kadr-tizimi" });
}
