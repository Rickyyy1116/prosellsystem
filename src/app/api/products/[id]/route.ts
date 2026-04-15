import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct, getProduct } from "@/lib/products";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProduct(id);
  return NextResponse.json(p);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = await req.json();
  const updated = await updateProduct(id, patch);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  return NextResponse.json({ ok });
}
