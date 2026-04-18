import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  clientId: z.string(),
  number: z.string().min(1),
  issueDate: z.string(),
  dueDate: z.string(),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().positive(),
      unitPrice: z.number().min(0),
      taxRate: z.number().min(0).max(100),
    })
  ).min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await db.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { items, ...data } = parsed.data;

  const invoice = await db.invoice.create({
    data: {
      ...data,
      userId: session.user.id,
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      items: { create: items },
    },
    include: { items: true, client: true },
  });

  return NextResponse.json(invoice, { status: 201 });
}
