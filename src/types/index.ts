import type { Client, Invoice, InvoiceItem, InvoiceStatus, User } from "@prisma/client";

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
  client: Client;
};

export type InvoiceWithClient = Invoice & {
  client: Client;
};

export type ClientWithStats = Client & {
  _count: { invoices: number };
  totalBilled: number;
};

export type UserWithSubscription = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "image"
  | "stripeCustomerId"
  | "stripeSubscriptionId"
  | "stripePriceId"
  | "stripeCurrentPeriodEnd"
  | "businessName"
  | "businessAddress"
  | "businessCity"
  | "businessCountry"
  | "businessEmail"
  | "businessPhone"
  | "taxId"
>;

export type InvoiceFormData = {
  clientId: string;
  number: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }[];
};

export { InvoiceStatus };
