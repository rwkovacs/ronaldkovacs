"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface BillingButtonProps {
  label: string;
  priceId?: string;
}

export function BillingButton({ label, priceId }: BillingButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Something went wrong");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="secondary" loading={loading} onClick={handleClick} className="w-full">
      {label}
    </Button>
  );
}
