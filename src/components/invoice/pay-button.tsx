"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function PayButton({
  token,
  amount,
  currency,
}: {
  token: string;
  amount: number;
  currency: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const { clientSecret, error } = await res.json();
      if (error) {
        toast.error(error);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe || !clientSecret) return;

      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: { return_url: window.location.href + "?paid=1" },
      });

      if (stripeError) toast.error(stripeError.message ?? "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="lg" className="w-full" loading={loading} onClick={handlePay}>
      Pay {formatCurrency(amount, currency)} now
    </Button>
  );
}
