import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatDate, calcInvoiceTotal } from "@/lib/utils";
import { InvoiceActions } from "@/components/invoice/invoice-actions";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session!.user!.id!;

  const invoice = await db.invoice.findFirst({
    where: { id: params.id, userId },
    include: { client: true, items: true },
  });

  if (!invoice) notFound();

  const user = await db.user.findUnique({ where: { id: userId } });
  const { subtotal, tax, total } = calcInvoiceTotal(invoice.items);
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.publicToken}`;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.number}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={statusToBadgeVariant(invoice.status)}>{invoice.status}</Badge>
            <span className="text-sm text-gray-500">Due {formatDate(invoice.dueDate)}</span>
          </div>
        </div>
        <InvoiceActions invoice={invoice} publicUrl={publicUrl} />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">From</p>
            <p className="font-semibold text-gray-900">{user?.businessName ?? user?.name}</p>
            {user?.businessEmail && <p className="text-sm text-gray-500">{user.businessEmail}</p>}
            {user?.businessAddress && <p className="text-sm text-gray-500">{user.businessAddress}</p>}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">To</p>
            <p className="font-semibold text-gray-900">{invoice.client.name}</p>
            {invoice.client.company && <p className="text-sm text-gray-500">{invoice.client.company}</p>}
            <p className="text-sm text-gray-500">{invoice.client.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Issue date</p>
            <p className="text-sm text-gray-900">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Due date</p>
            <p className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left font-medium text-gray-500">Description</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500">Qty</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500">Unit price</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500">Tax</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3 text-gray-700">{item.description}</td>
                <td className="px-6 py-3 text-right text-gray-500">{item.quantity}</td>
                <td className="px-6 py-3 text-right text-gray-500">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="px-6 py-3 text-right text-gray-500">{item.taxRate}%</td>
                <td className="px-6 py-3 text-right font-medium">
                  {formatCurrency(item.quantity * item.unitPrice * (1 + item.taxRate / 100), invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <div className="space-y-1.5 w-52">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>{formatCurrency(tax, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </Card>

      {invoice.notes && (
        <Card>
          <CardHeader><p className="text-sm font-medium text-gray-700">Notes</p></CardHeader>
          <CardContent><p className="text-sm text-gray-500 whitespace-pre-wrap">{invoice.notes}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
