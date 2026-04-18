import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { calcInvoiceTotal } from "@/lib/utils";

export async function POST(req: Request) {
  const { token } = await req.json();

  const invoice = await db.invoice.findUnique({
    where: { publicToken: token },
    include: { items: true, user: true },
  });

  if (!invoice || invoice.status === "PAID" || invoice.status === "CANCELLED") {
    return NextResponse.json({ error: "Invoice not payable" }, { status: 400 });
  }

  const { total } = calcInvoiceTotal(invoice.items);
  const amountInCents = Math.round(total * 100);

  let customerId = invoice.user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: invoice.user.email! });
    customerId = customer.id;
    await db.user.update({ where: { id: invoice.userId }, data: { stripeCustomerId: customerId } });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: invoice.currency.toLowerCase(),
    metadata: { invoiceId: invoice.id },
    automatic_payment_methods: { enabled: true },
  });

  await db.invoice.update({
    where: { id: invoice.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
