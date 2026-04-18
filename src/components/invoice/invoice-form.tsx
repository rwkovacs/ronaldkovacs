"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@prisma/client";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

const emptyItem = (): LineItem => ({ description: "", quantity: 1, unitPrice: 0, taxRate: 0 });

export function InvoiceForm({
  clients,
  defaultNumber,
}: {
  clients: Client[];
  defaultNumber: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);

  const today = new Date().toISOString().split("T")[0];
  const due = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const tax = items.reduce((s, i) => s + i.quantity * i.unitPrice * (i.taxRate / 100), 0);
  const total = subtotal + tax;

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const body = {
      clientId: form.get("clientId"),
      number: form.get("number"),
      issueDate: form.get("issueDate"),
      dueDate: form.get("dueDate"),
      currency: form.get("currency"),
      notes: form.get("notes"),
      items,
    };

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const inv = await res.json();
      toast.success("Invoice created");
      router.push(`/dashboard/invoices/${inv.id}`);
    } else {
      toast.error("Failed to create invoice");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader><p className="font-medium text-gray-900">Invoice details</p></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            {clients.length === 0 ? (
              <p className="text-sm text-gray-400">
                No clients yet.{" "}
                <a href="/dashboard/clients/new" className="text-brand-600 hover:underline">Add one first</a>
              </p>
            ) : (
              <select
                name="clientId"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</option>
                ))}
              </select>
            )}
          </div>
          <Input name="number" label="Invoice number *" defaultValue={defaultNumber} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              name="currency"
              defaultValue="USD"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {["USD", "EUR", "GBP", "CAD", "AUD"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input name="issueDate" type="date" label="Issue date *" defaultValue={today} required />
          <Input name="dueDate" type="date" label="Due date *" defaultValue={due} required />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><p className="font-medium text-gray-900">Line items</p></CardHeader>
        <div className="px-6 pb-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 uppercase tracking-wide pb-2 border-b border-gray-100">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Unit price</div>
            <div className="col-span-2 text-right">Tax %</div>
            <div className="col-span-1" />
          </div>
          <div className="space-y-2 py-2">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                    placeholder="Service or product description"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-right focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-right focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={item.taxRate}
                    onChange={(e) => updateItem(idx, "taxRate", parseFloat(e.target.value) || 0)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-right focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, emptyItem()])}
            className="text-sm text-brand-600 hover:underline mt-1 mb-4"
          >
            + Add line item
          </button>

          <div className="flex justify-end border-t border-gray-100 pt-4">
            <div className="space-y-1.5 w-48 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardContent>
          <Textarea name="notes" label="Notes (optional)" rows={3} placeholder="Payment terms, bank details, or a thank-you note..." />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Create invoice</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
