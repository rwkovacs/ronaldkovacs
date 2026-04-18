import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, calcInvoiceTotal } from "@/lib/utils";
import Link from "next/link";

export default async function InvoicesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const invoices = await db.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <Link href="/dashboard/invoices/new">
          <Button>New invoice</Button>
        </Link>
      </div>

      <Card>
        {invoices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No invoices yet</p>
            <Link href="/dashboard/invoices/new">
              <Button>Create your first invoice</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Invoice</th>
                <th className="px-6 py-3 font-medium text-gray-500">Client</th>
                <th className="px-6 py-3 font-medium text-gray-500">Issue date</th>
                <th className="px-6 py-3 font-medium text-gray-500">Due date</th>
                <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const { total } = calcInvoiceTotal(inv.items);
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/dashboard/invoices/${inv.id}`} className="font-medium text-brand-600 hover:underline">
                        #{inv.number}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{inv.client.name}</td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(inv.issueDate)}</td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(inv.dueDate)}</td>
                    <td className="px-6 py-3 font-medium">{formatCurrency(total, inv.currency)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={statusToBadgeVariant(inv.status)}>{inv.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
