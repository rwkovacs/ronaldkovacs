import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export const PLANS = {
  starter: {
    name: "Starter",
    price: 15,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    invoiceLimit: 10,
    features: ["10 invoices/month", "5 clients", "PDF export", "Email delivery"],
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    invoiceLimit: Infinity,
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "PDF export",
      "Email delivery",
      "Online payments",
      "Custom branding",
      "Priority support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
