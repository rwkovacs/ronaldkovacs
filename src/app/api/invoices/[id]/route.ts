import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await db.invoice.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { items: true, client: true },
  });

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await db.invoice.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await db.invoice.update({
    where: { id: params.id },
    data: { ...parsed.data, ...(parsed.data.status === "PAID" ? { paidAt: new Date() } : {}) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await db.invoice.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.invoice.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
