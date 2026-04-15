import { NextRequest, NextResponse } from "next/server";
import { generateList, ICP } from "@/lib/generator";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ICP;
  const rows = await generateList(body);
  return NextResponse.json({ rows, total: rows.length });
}
