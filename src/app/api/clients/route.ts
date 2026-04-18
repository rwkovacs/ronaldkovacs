import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const client = await db.client.create({
    data: { ...parsed.data, userId: session.user.id },
  });
  return NextResponse.json(client, { status: 201 });
}
