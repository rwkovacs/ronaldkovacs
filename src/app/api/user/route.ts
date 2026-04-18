import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  businessName: z.string().optional(),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessAddress: z.string().optional(),
  businessCity: z.string().optional(),
  businessCountry: z.string().optional(),
  businessPhone: z.string().optional(),
  taxId: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await db.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });
  return NextResponse.json(user);
}
