"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Invoice } from "@prisma/client";

export function InvoiceActions({
  invoice,
  publicUrl,
}: {
  invoice: Pick<Invoice, "id" | "status">;
  publicUrl: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: string) {
    setLoading(status);
    const res = await fetch(`/api/invoices/${invoice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Invoice marked as ${status.toLowerCase()}`);
      router.refresh();
    } else {
      toast.error("Failed to update status");
    }
    setLoading(null);
  }

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Client link copied");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={copyLink}>
        Copy client link
      </Button>
      {invoice.status === "DRAFT" && (
        <Button size="sm" loading={loading === "SENT"} onClick={() => updateStatus("SENT")}>
          Mark as sent
        </Button>
      )}
      {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
        <Button size="sm" loading={loading === "PAID"} onClick={() => updateStatus("PAID")}>
          Mark as paid
        </Button>
      )}
      {invoice.status !== "CANCELLED" && invoice.status !== "PAID" && (
        <Button variant="danger" size="sm" loading={loading === "CANCELLED"} onClick={() => updateStatus("CANCELLED")}>
          Cancel
        </Button>
      )}
    </div>
  );
}
