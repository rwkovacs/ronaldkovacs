import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Professional Invoices",
    desc: "Create and send beautiful invoices in seconds. Add your logo, customize line items, and set payment terms.",
    icon: "📄",
  },
  {
    title: "Online Payments",
    desc: "Accept credit cards directly from your invoice. Stripe-powered, secure, and instant.",
    icon: "💳",
  },
  {
    title: "Client Portal",
    desc: "Give clients a dedicated link to view and pay their invoices without creating an account.",
    icon: "🔗",
  },
  {
    title: "Track Everything",
    desc: "See what's paid, overdue, or pending. Get notified the moment a client pays.",
    icon: "📊",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$15",
    desc: "Perfect for freelancers just getting started.",
    features: ["10 invoices / month", "5 clients", "PDF export", "Email delivery"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For serious freelancers who need everything.",
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "Online payments",
      "Custom branding",
      "Priority support",
    ],
    cta: "Get started",
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            InvoiceKit
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/login">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-brand-500 rounded-full" />
          Invoicing made for freelancers
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Get paid faster.<br />
          <span className="text-brand-600">Stop chasing invoices.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Create professional invoices, send them to clients, and accept online payments — all from one simple dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Start for free</Button>
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            View pricing →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to get paid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple, transparent pricing</h2>
        <p className="text-center text-gray-500 mb-12">No hidden fees. Cancel anytime.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.highlight ? "border-brand-500 shadow-md ring-1 ring-brand-500" : "border-gray-200"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">Most popular</div>
              )}
              <div className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {plan.price}<span className="text-lg font-normal text-gray-500">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block">
                <Button variant={plan.highlight ? "primary" : "secondary"} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} InvoiceKit. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
