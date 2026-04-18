import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { InvoiceForm } from "@/components/invoice/invoice-form";

export default async function NewInvoicePage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const clients = await db.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  const lastInvoice = await db.invoice.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { number: true },
  });

  const nextNumber = lastInvoice
    ? String(parseInt(lastInvoice.number.replace(/\D/g, "") || "0") + 1).padStart(4, "0")
    : "0001";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New invoice</h1>
      <InvoiceForm clients={clients} defaultNumber={nextNumber} />
    </div>
  );
}
