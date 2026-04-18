import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [invoices, clientCount] = await Promise.all([
    db.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.client.count({ where: { userId } }),
  ]);

  const totalRevenue = invoices
    .filter((inv) => inv.status === "PAID")
    .flatMap((inv) => inv.items)
    .reduce((sum, item) => sum + item.quantity * item.unitPrice * (1 + item.taxRate / 100), 0);

  const outstanding = invoices
    .filter((inv) => inv.status === "SENT" || inv.status === "OVERDUE")
    .flatMap((inv) => inv.items)
    .reduce((sum, item) => sum + item.quantity * item.unitPrice * (1 + item.taxRate / 100), 0);

  const stats = [
    { label: "Total revenue", value: formatCurrency(totalRevenue), color: "text-green-600" },
    { label: "Outstanding", value: formatCurrency(outstanding), color: "text-yellow-600" },
    { label: "Total invoices", value: invoices.length.toString(), color: "text-brand-600" },
    { label: "Clients", value: clientCount.toString(), color: "text-purple-600" },
  ];

  const recent = invoices.slice(0, 5);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {session!.user!.name?.split(" ")[0]}</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>New invoice</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <p className="text-sm text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent invoices</h2>
          <Link href="/dashboard/invoices" className="text-sm text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-4">No invoices yet</p>
              <Link href="/dashboard/invoices/new">
                <Button size="sm">Create your first invoice</Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((inv) => {
              const total = inv.items.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice * (1 + item.taxRate / 100),
                0
              );
              return (
                <Link
                  key={inv.id}
                  href={`/dashboard/invoices/${inv.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{inv.number}</p>
                      <p className="text-xs text-gray-500">{inv.client.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusToBadgeVariant(inv.status)}>{inv.status}</Badge>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(total, inv.currency)}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(inv.dueDate)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
