"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import toast from "react-hot-toast";
import type { User } from "@prisma/client";

export function ProfileForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) toast.success("Settings saved");
    else toast.error("Failed to save");
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader><p className="font-medium text-gray-900">Business information</p></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="businessName" label="Business name" defaultValue={user.businessName ?? ""} placeholder="Your Business LLC" />
            <Input name="businessEmail" type="email" label="Business email" defaultValue={user.businessEmail ?? ""} placeholder="billing@yourbiz.com" />
          </div>
          <Input name="businessAddress" label="Address" defaultValue={user.businessAddress ?? ""} placeholder="123 Main St" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="businessCity" label="City" defaultValue={user.businessCity ?? ""} placeholder="New York" />
            <Input name="businessCountry" label="Country" defaultValue={user.businessCountry ?? ""} placeholder="US" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="businessPhone" label="Phone" defaultValue={user.businessPhone ?? ""} placeholder="+1 555 000 0000" />
            <Input name="taxId" label="Tax ID / VAT" defaultValue={user.taxId ?? ""} placeholder="US123456789" />
          </div>
          <Button type="submit" loading={loading}>Save changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
