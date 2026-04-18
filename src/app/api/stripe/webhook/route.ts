import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      await db.user.update({
        where: { stripeCustomerId: session.customer as string },
        data: {
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      if (!inv.subscription) break;
      const sub = await stripe.subscriptions.retrieve(inv.subscription as string);
      await db.user.update({
        where: { stripeCustomerId: inv.customer as string },
        data: {
          stripePriceId: sub.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.user.update({
        where: { stripeCustomerId: sub.customer as string },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
