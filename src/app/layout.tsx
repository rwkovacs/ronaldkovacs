import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvoiceKit — Invoicing for Freelancers",
  description: "Create professional invoices, get paid online, and manage your clients — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
