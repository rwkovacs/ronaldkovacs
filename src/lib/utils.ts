import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function calcInvoiceTotal(items: { quantity: number; unitPrice: number; taxRate: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.taxRate / 100), 0);
  return { subtotal, tax, total: subtotal + tax };
}

export function getInvoiceStatusColor(status: string) {
  const map: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SENT: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}
