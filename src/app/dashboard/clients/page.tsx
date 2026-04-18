import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const clients = await db.client.findMany({
    where: { userId },
    include: { _count: { select: { invoices: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Link href="/dashboard/clients/new">
          <Button>Add client</Button>
        </Link>
      </div>

      <Card>
        {clients.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No clients yet</p>
            <Link href="/dashboard/clients/new">
              <Button>Add your first client</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
                  <p className="text-sm text-gray-400">{client.email}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-500">{client._count.invoices} invoice{client._count.invoices !== 1 ? "s" : ""}</span>
                  <Link href={`/dashboard/invoices/new?clientId=${client.id}`}>
                    <Button size="sm" variant="secondary">Invoice</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
