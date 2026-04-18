import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { formatCurrency, formatDate, calcInvoiceTotal } from "@/lib/utils";
import { PayButton } from "@/components/invoice/pay-button";

export default async function PublicInvoicePage({ params }: { params: { token: string } }) {
  const invoice = await db.invoice.findUnique({
    where: { publicToken: params.token },
    include: { items: true, client: true, user: true },
  });

  if (!invoice) notFound();

  const { subtotal, tax, total } = calcInvoiceTotal(invoice.items);
  const canPay = invoice.status === "SENT" || invoice.status === "OVERDUE";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-brand-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brand-200 text-sm font-medium mb-1">Invoice</p>
                <p className="text-2xl font-bold">#{invoice.number}</p>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                {invoice.status}
              </Badge>
            </div>
          </div>

          <div className="px-8 py-6 border-b border-gray-100 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">From</p>
              <p className="font-semibold text-gray-900">{invoice.user.businessName ?? invoice.user.name}</p>
              {invoice.user.businessEmail && (
                <p className="text-sm text-gray-500">{invoice.user.businessEmail}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">To</p>
              <p className="font-semibold text-gray-900">{invoice.client.name}</p>
              {invoice.client.company && <p className="text-sm text-gray-500">{invoice.client.company}</p>}
              <p className="text-sm text-gray-500">{invoice.client.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Issue date</p>
              <p className="text-sm text-gray-700">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Due date</p>
              <p className="text-sm text-gray-700">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-8 py-3 text-left font-medium text-gray-400">Description</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">Qty</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">Price</th>
                <th className="px-8 py-3 text-right font-medium text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-8 py-3 text-gray-700">{item.description}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="px-8 py-3 text-right font-medium">
                    {formatCurrency(item.quantity * item.unitPrice, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-8 py-4 border-t border-gray-100 flex justify-end">
            <div className="space-y-1.5 w-48 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, invoice.currency)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax</span>
                  <span>{formatCurrency(tax, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="px-8 py-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-gray-500 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {invoice.status === "PAID" && (
            <div className="px-8 py-4 border-t border-green-100 bg-green-50 text-center">
              <p className="text-green-700 font-medium text-sm">
                Paid on {invoice.paidAt ? formatDate(invoice.paidAt) : "—"}
              </p>
            </div>
          )}

          {canPay && (
            <div className="px-8 py-6 border-t border-gray-100">
              <PayButton token={params.token} amount={total} currency={invoice.currency} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
