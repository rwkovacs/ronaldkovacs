# InvoiceKit

A lightweight invoicing + client portal SaaS for freelancers. Built with Next.js 15, Prisma, Stripe, and NextAuth.

## Features

- Create and send professional invoices
- Accept online payments via Stripe
- Client-facing public invoice page (no login required for clients)
- Subscription billing (Starter $15/mo, Pro $29/mo)
- Dashboard with revenue overview
- Client management

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL via Prisma (works with Supabase, Neon, Railway)
- **Auth**: NextAuth v5 (Google + GitHub OAuth)
- **Payments**: Stripe (subscriptions + invoice payments)
- **Styles**: Tailwind CSS

## Getting started

### 1. Clone and install

```bash
git clone <your-repo>
cd invoicekit
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `AUTH_SECRET` — run `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — [Google Cloud Console](https://console.cloud.google.com/)
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — [GitHub Developer Settings](https://github.com/settings/developers)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — [Stripe Dashboard](https://dashboard.stripe.com/)
- `STRIPE_STARTER_PRICE_ID` / `STRIPE_PRO_PRICE_ID` — create recurring prices in Stripe

### 3. Set up the database

```bash
npm run db:push
```

### 4. Run locally

```bash
npm run dev
```

### 5. Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Deploy

Works out of the box on [Vercel](https://vercel.com). Set all env vars in the Vercel dashboard, then:

```bash
vercel deploy
```

## Pricing model

| Plan | Price | Target |
|------|-------|--------|
| Starter | $15/mo | Freelancers sending up to 10 invoices/month |
| Pro | $29/mo | Power users needing unlimited invoices + online payments |

To hit $5k/month: ~172 Starter subscribers or ~173 Pro subscribers (or a mix).
