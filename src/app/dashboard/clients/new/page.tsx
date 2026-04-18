"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success("Client added");
      router.push("/dashboard/clients");
      router.refresh();
    } else {
      toast.error("Failed to add client");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add client</h1>
      <Card>
        <CardHeader><p className="font-medium text-gray-900">Client details</p></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" label="Name *" required placeholder="Jane Smith" />
              <Input name="company" label="Company" placeholder="Acme Inc." />
            </div>
            <Input name="email" type="email" label="Email *" required placeholder="jane@example.com" />
            <Input name="phone" label="Phone" placeholder="+1 555 000 0000" />
            <Input name="address" label="Address" placeholder="123 Main St" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="city" label="City" placeholder="New York" />
              <Input name="country" label="Country" placeholder="US" />
            </div>
            <Textarea name="notes" label="Notes" rows={3} placeholder="Any notes about this client..." />
            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading}>Add client</Button>
              <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
