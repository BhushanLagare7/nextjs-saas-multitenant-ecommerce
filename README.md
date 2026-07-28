<div align="center">

<img src="./public/icon.svg" alt="Storegrid logo" height="80" />

# Storegrid

## Multi-tenant SaaS e-commerce platform built with Next.js, Payload CMS, and Stripe Connect

<br />

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-087ea4?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-3-000?style=for-the-badge)](https://payloadcms.com)
[![Stripe](https://img.shields.io/badge/Stripe-Connect-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![Bun](https://img.shields.io/badge/Bun-runtime-f9f1e1?style=for-the-badge&logo=bun&logoColor=14151a)](https://bun.sh)

<br />

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [Development](#-development) · [Deployment](#-deployment)

<br />

---

</div>

<br />

Storegrid is a full-stack, multi-tenant marketplace where each seller gets their own **isolated storefront** — complete with subdomain routing, Stripe-powered payments, and a headless CMS admin panel. Buyers can discover products across all stores, purchase digital goods, and manage their library of purchases.

<br />

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏪 Multi-Tenant Storefronts

Each store is fully isolated with its own products, media, and checkout flow. Served on custom subdomains in production or path-based routes in development.

</td>
<td width="50%">

### 💳 Stripe Connect Payments

Sellers onboard via Stripe Connect. The platform automatically collects a configurable fee (10%) on every transaction.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Headless CMS Admin

Built-in Payload CMS admin panel at `/admin` for managing products, media, categories, tags, tenants, orders, and users.

</td>
<td width="50%">

### 🔍 Product Discovery

Browse and filter products across all stores by category, tags, price range, and sorting — with infinite scroll pagination.

</td>
</tr>
<tr>
<td width="50%">

### ⭐ Reviews & Ratings

Authenticated users can leave star ratings and written reviews on products they've purchased.

</td>
<td width="50%">

### 📚 Purchase Library

Buyers have a personal library tracking all their purchased digital products in one place.

</td>
</tr>
<tr>
<td width="50%">

### ⚡ Server-Side Rendering

tRPC procedures are prefetched on the server for instant page loads with full SEO support and hydration.

</td>
<td width="50%">

### 🔐 Role-Based Access

`super-admin` users manage the entire platform; regular users operate their assigned tenant stores.

</td>
</tr>
</table>

<br />

## 🧰 Tech Stack

<table>
<tr><th align="left">Layer</th><th align="left">Technology</th></tr>
<tr><td><strong>Framework</strong></td><td><img src="https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=fff" alt="Next.js" /> <img src="https://img.shields.io/badge/React_19-087ea4?logo=react&logoColor=fff" alt="React" /> <img src="https://img.shields.io/badge/Turbopack-000?logo=webpack&logoColor=fff" alt="Turbopack" /></td></tr>
<tr><td><strong>CMS / ORM</strong></td><td><img src="https://img.shields.io/badge/Payload_CMS_3-000?logoColor=fff" alt="Payload" /> <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff" alt="MongoDB" /></td></tr>
<tr><td><strong>API</strong></td><td><img src="https://img.shields.io/badge/tRPC_v11-2596BE?logo=trpc&logoColor=fff" alt="tRPC" /> <img src="https://img.shields.io/badge/TanStack_Query_v5-ef4444?logo=reactquery&logoColor=fff" alt="TanStack Query" /></td></tr>
<tr><td><strong>Payments</strong></td><td><img src="https://img.shields.io/badge/Stripe_Connect-635bff?logo=stripe&logoColor=fff" alt="Stripe" /></td></tr>
<tr><td><strong>UI</strong></td><td><img src="https://img.shields.io/badge/shadcn/ui-000?logo=shadcnui&logoColor=fff" alt="shadcn/ui" /> <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind" /> <img src="https://img.shields.io/badge/Radix_UI-161618?logo=radixui&logoColor=fff" alt="Radix" /></td></tr>
<tr><td><strong>Auth</strong></td><td><img src="https://img.shields.io/badge/Payload_Auth-000?logoColor=fff" alt="Auth" /> (cookie-based sessions)</td></tr>
<tr><td><strong>Storage</strong></td><td><img src="https://img.shields.io/badge/Vercel_Blob-000?logo=vercel&logoColor=fff" alt="Vercel Blob" /></td></tr>
<tr><td><strong>State</strong></td><td><img src="https://img.shields.io/badge/Zustand-443e38?logoColor=fff" alt="Zustand" /> <img src="https://img.shields.io/badge/nuqs-000?logoColor=fff" alt="nuqs" /> (URL search params)</td></tr>
<tr><td><strong>Validation</strong></td><td><img src="https://img.shields.io/badge/Zod_v4-3E67B1?logo=zod&logoColor=fff" alt="Zod" /> <img src="https://img.shields.io/badge/React_Hook_Form-ec5990?logo=reacthookform&logoColor=fff" alt="RHF" /></td></tr>
<tr><td><strong>Runtime</strong></td><td><img src="https://img.shields.io/badge/Bun-f9f1e1?logo=bun&logoColor=14151a" alt="Bun" /></td></tr>
</table>

<br />

## 🚀 Getting Started

### Prerequisites

| Tool                                                       | Purpose                     |
| ---------------------------------------------------------- | --------------------------- |
| [Bun](https://bun.sh/) v1.0+                               | Package manager and runtime |
| [MongoDB](https://www.mongodb.com/)                        | Database (local or Atlas)   |
| [Stripe](https://stripe.com/)                              | Payments (Connect enabled)  |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | Media file storage          |

### 1. Clone & Install

```bash
git clone https://github.com/BhushanLagare7/nextjs-saas-multitenant-ecommerce.git
cd nextjs-saas-multitenant-ecommerce
bun install
```

### 2. Configure Environment

Create a `.env` file in the project root. Required variables are validated before use:

```env
# ── Required ──────────────────────────────────────────
DATABASE_URL=mongodb+srv://...
PAYLOAD_SECRET=your-payload-secret
BLOB_READ_WRITE_TOKEN=vercel_blob_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Optional ──────────────────────────────────────────
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING=false
```

### 3. Set Up the Database

```bash
bun run db:fresh    # Run migrations (⚠️ drops existing data)
bun run db:seed     # Seed with sample data
```

### 4. Start the Dev Server

```bash
bun run dev
```

You're up and running:

| Endpoint     | URL                              |
| ------------ | -------------------------------- |
| 🌐 App       | `http://localhost:3000`          |
| ⚙️ CMS Admin | `http://localhost:3000/admin`    |
| 🔌 tRPC API  | `http://localhost:3000/api/trpc` |

> [!TIP]
> To test Stripe webhooks locally, run the Stripe CLI in a separate terminal:
>
> ```bash
> stripe listen --forward-to localhost:3000/api/stripe/webhooks
> ```

<br />

## 🏗️ Architecture

```text
src/
├── app/                     # Next.js App Router
│   ├── (app)/
│   │   ├── (auth)/          #   ↳ Sign-in / sign-up pages
│   │   ├── (home)/          #   ↳ Landing, about, contact, features, pricing
│   │   ├── (library)/       #   ↳ User's purchased products library
│   │   ├── (tenants)/       #   ↳ Tenant storefronts and checkout
│   │   └── api/             #   ↳ tRPC endpoint + Stripe webhooks
│   └── (payload)/           # Payload CMS admin (auto-generated)
│
├── collections/             # Payload collection definitions
├── components/              # Shared UI components (shadcn/ui)
├── lib/                     # Utilities (Stripe, access control, helpers)
│
├── modules/                 # Feature modules (domain-driven)
│   ├── auth/                #   ↳ Authentication
│   ├── categories/          #   ↳ Category browsing
│   ├── checkout/            #   ↳ Cart (Zustand) + checkout flow
│   ├── home/                #   ↳ Landing page components
│   ├── library/             #   ↳ Purchased products
│   ├── products/            #   ↳ Listing, filtering, detail views
│   ├── reviews/             #   ↳ Star ratings and reviews
│   ├── tags/                #   ↳ Product tags
│   └── tenants/             #   ↳ Tenant storefront views
│
└── trpc/                    # tRPC setup (client, server, routers)
```

### Module Pattern

Each feature module follows a consistent internal structure:

```text
modules/<name>/
├── hooks/               # Client-side React hooks
├── server/
│   └── procedures.ts    # tRPC router and procedures
├── store/               # Zustand stores (if stateful)
├── ui/
│   ├── components/      # Reusable UI components
│   └── views/           # Full page views
├── schemas.ts           # Zod validation schemas
├── search-params.ts     # nuqs search param parsers
└── types.ts             # Module-specific types
```

### Multi-Tenant Routing

| Environment    | Strategy   | Example                                  |
| -------------- | ---------- | ---------------------------------------- |
| 🧑‍💻 Development | Path-based | `http://localhost:3000/tenants/my-store` |
| 🌍 Production  | Subdomain  | `https://my-store.yourdomain.com`        |

Set `NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING=true` and `NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com` for production subdomain routing. The middleware in `proxy.ts` rewrites subdomain requests to internal `/tenants/[slug]` paths when subdomain routing is enabled.

<br />

## 🛠️ Development

### Available Scripts

| Command                      | Description                           |
| ---------------------------- | ------------------------------------- |
| `bun run dev`                | Start dev server (Turbopack)          |
| `bun run build`              | Production build                      |
| `bun run start`              | Start production server               |
| `bun run lint`               | Run ESLint                            |
| `bun run lint:fix`           | Run ESLint with auto-fix              |
| `bun run generate:types`     | Regenerate `payload-types.ts`         |
| `bun run generate:importmap` | Regenerate admin import map           |
| `bun run db:fresh`           | Run migrations fresh (drops all data) |
| `bun run db:seed`            | Seed database with sample data        |

> [!IMPORTANT]
> After modifying any Payload collection in `src/collections/`, always run:
>
> ```bash
> bun run generate:types
> bun run generate:importmap
> ```

### Adding UI Components

```bash
bunx --bun shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/` using the `radix-vega` style preset.

<br />

## 🚢 Deployment

The application is designed for deployment on [Vercel](https://vercel.com).

1. **Connect** your repository to Vercel
2. **Set** all required environment variables in the Vercel dashboard
3. **Enable** Vercel Blob storage for media uploads
4. **Configure** production environment variables:
   - `NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING=true`
   - `NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com`
5. **Set up** wildcard DNS (`*.yourdomain.com`) pointing to Vercel
6. **Register** your Stripe webhook endpoint: `https://yourdomain.com/api/stripe/webhooks`

> [!CAUTION]
> Running `bun run db:fresh` in production will **drop all data**. Use it only for initial setup or with extreme caution.
