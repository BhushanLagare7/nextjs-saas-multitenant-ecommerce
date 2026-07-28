# AGENTS.md

## Project Overview

A multi-tenant SaaS e-commerce platform built with Next.js 16 (App Router), Payload CMS 3, tRPC, and Stripe. Tenants (stores) are isolated via the `@payloadcms/plugin-multi-tenant` plugin. In production, each tenant is served on its own subdomain (`slug.rootdomain.com`); in development, path-based routing (`/tenants/slug`) is used instead.

### Key Technologies

| Layer           | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, React 19, Turbopack)             |
| CMS / ORM       | Payload CMS 3 (MongoDB via Mongoose)                     |
| API Layer       | tRPC v11 + TanStack React Query v5                       |
| Payments        | Stripe (Connect for multi-tenant payouts)                |
| UI              | shadcn/ui (radix-vega preset), Tailwind CSS v4, Radix UI |
| Auth            | Payload built-in auth (cookie-based sessions)            |
| Storage         | Vercel Blob (`@payloadcms/storage-vercel-blob`)          |
| State           | Zustand, nuqs (URL search params)                        |
| Forms           | React Hook Form + Zod v4                                 |
| Package Manager | Bun                                                      |
| Language        | TypeScript (strict mode, `noUncheckedIndexedAccess`)     |

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/              # Main application route group
│   │   ├── (auth)/         # Sign-in / sign-up pages
│   │   ├── (home)/         # Landing pages (home, about, contact, features, pricing, [category])
│   │   ├── (library)/      # User's purchased products library
│   │   ├── (tenants)/      # Tenant storefronts: /tenants/[slug]/(home|checkout)
│   │   ├── api/
│   │   │   ├── stripe/webhooks/   # Stripe webhook handler
│   │   │   └── trpc/[trpc]/       # tRPC HTTP endpoint
│   │   ├── globals.css     # Tailwind v4 entrypoint + CSS variables
│   │   └── layout.tsx      # Root layout (TRPCReactProvider, ThemeProvider)
│   └── (payload)/          # Payload CMS admin panel (auto-generated)
├── collections/            # Payload collection definitions
│   ├── Categories.ts
│   ├── Media.ts
│   ├── Orders.ts
│   ├── Products.ts
│   ├── Reviews.ts
│   ├── Tags.ts
│   ├── Tenants.ts
│   └── Users.ts
├── components/             # Shared React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── star-picker.tsx
│   ├── star-rating.tsx
│   └── stripe-verify.tsx   # Payload admin nav component
├── lib/
│   ├── access.ts           # Payload access control helpers (isSuperAdmin)
│   ├── stripe.ts           # Stripe client singleton
│   └── utils.ts            # cn(), generateTenantURL(), formatCurrency()
├── modules/                # Feature modules (domain-driven)
│   ├── auth/               # schemas, server procedures, UI views
│   ├── categories/
│   ├── checkout/           # hooks, server, store (Zustand), UI
│   ├── home/
│   ├── library/
│   ├── products/           # hooks, server, search-params, types, UI
│   ├── reviews/
│   ├── tags/
│   └── tenants/
├── trpc/
│   ├── client.tsx          # Client-side TRPCProvider + useTRPC hook
│   ├── init.ts             # tRPC context, baseProcedure, protectedProcedure
│   ├── query-client.ts     # Shared QueryClient factory
│   ├── routers/_app.ts     # Root app router (merges all module routers)
│   └── server.tsx          # Server-side prefetch(), HydrateClient, trpc proxy
├── constants.ts            # DEFAULT_LIMIT, PLATFORM_FEE_PERCENTAGE
├── payload.config.ts       # Payload CMS configuration
├── payload-types.ts        # Auto-generated Payload types (DO NOT EDIT)
└── seed.ts                 # Database seeding script
```

### Module Pattern

Each feature module in `src/modules/<name>/` follows a consistent internal structure:

```
modules/<name>/
├── hooks/          # Custom React hooks (client-side)
├── server/
│   └── procedures.ts   # tRPC router + procedures for this module
├── store/          # Zustand stores (if stateful, e.g. checkout cart)
├── ui/
│   ├── components/     # UI components
│   └── views/          # Full page views consumed by app router pages
├── schemas.ts      # Zod validation schemas
├── search-params.ts    # nuqs search param parsers
└── types.ts        # Module-specific TypeScript types
```

### Multi-Tenant Routing

- **Development**: Path-based — `http://localhost:3000/tenants/my-store`
- **Production** (when `NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING=true`): Subdomain-based — `https://my-store.yourdomain.com`
- Middleware in `proxy.ts` rewrites subdomain requests to internal `/tenants/[slug]` paths.

---

## Setup Commands

```bash
# Install dependencies
bun install

# Generate Payload types (run after modifying any collection)
bun run generate:types

# Generate Payload import map (run after adding admin components)
bun run generate:importmap

# Run database migrations fresh (WARNING: drops all data)
bun run db:fresh

# Seed the database with sample data
bun run db:seed
```

---

## Environment Variables

Create a `.env` file in the project root. All variables are validated at startup with fail-fast checks.

### Required

| Variable                | Description                                 |
| ----------------------- | ------------------------------------------- |
| `DATABASE_URL`          | MongoDB connection string                   |
| `PAYLOAD_SECRET`        | Secret key for Payload CMS                  |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token                   |
| `STRIPE_SECRET_KEY`     | Stripe API secret key                       |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret               |
| `NEXT_PUBLIC_APP_URL`   | App base URL (e.g. `http://localhost:3000`) |

### Optional

| Variable                               | Description                                                                   | Default |
| -------------------------------------- | ----------------------------------------------------------------------------- | ------- |
| `NEXT_PUBLIC_ROOT_DOMAIN`              | Root domain for subdomain routing (e.g. `localhost:3000` or `yourdomain.com`) | —       |
| `NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING` | Enable subdomain-based tenant routing                                         | `false` |

---

## Development Workflow

```bash
# Start the development server (Turbopack)
bun run dev
```

- App: `http://localhost:3000`
- Payload CMS Admin: `http://localhost:3000/admin`
- tRPC endpoint: `http://localhost:3000/api/trpc`
- Stripe webhooks (local): use `stripe listen --forward-to localhost:3000/api/stripe/webhooks`

### After Modifying Collections

Whenever you change a Payload collection definition in `src/collections/`:

```bash
bun run generate:types       # Regenerate payload-types.ts
bun run generate:importmap   # Regenerate admin import map
```

### Adding shadcn Components

```bash
bunx --bun shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/`. The project uses the `radix-vega` style preset with `neutral` base color and CSS variables.

---

## Build & Lint

```bash
# Production build
bun run build

# Lint (ESLint 9 flat config)
bun run lint

# Lint with auto-fix
bun run lint:fix
```

### Formatting

Prettier is configured with `prettier-plugin-tailwindcss`. No explicit format script exists — use editor integration or run manually:

```bash
bunx prettier --write .
```

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Coding Standards & Naming Conventions

## 1. Function Declarations

- Convert ALL arrow functions (`const A = () => {...}`) to standard function declarations (`function A() {...}`).
- This applies to default exports, named exports, React components, and standard utility functions.

## 2. Prop Interface Naming

- Any interface or type defining component props must follow the `[ComponentName]Props` naming convention.
- _Example:_ `SidebarNav` component props interface must be `SidebarNavProps`.

## 3. Path-Based Component & Layout Naming

- Rename all Page and Layout components based on their file path to ensure global uniqueness.
- **Rule:** Ignore route groups (folders wrapped in parentheses `(...)`) and convert remaining path segments into PascalCase.
- _Example 1:_ `src/app/(app)/(tenants)/tenants/[slug]/(home)/products/[productId]/page.tsx` -> `TenantsProductIdPage`
- _Example 2:_ `src/app/(app)/(tenants)/tenants/[slug]/(checkout)/layout.tsx` -> `TenantsCheckoutLayout`

## 4. Skeleton Component Naming

- Any component designed as a Suspense fallback (skeleton) must have `Skeleton` appended to the very end of its finalised name.
- _Example:_ `TenantsProductIdPageSkeleton`

## 5. tRPC Server-Side Prefetching Standard

**Always use the `prefetch` utility and `<HydrateClient>` wrapper** from `@/trpc/server` in Next.js Server Components. Never manually instantiate `getQueryClient()`, call `prefetchQuery`/`prefetchInfiniteQuery` on it directly, or use `<HydrationBoundary state={dehydrate(queryClient)}>`.

### ❌ Legacy Pattern (Forbidden)

```tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

const queryClient = getQueryClient();
void queryClient.prefetchQuery(trpc.example.getOne.queryOptions({ id }));

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <MyComponent />
  </HydrationBoundary>
);
```

### ✅ Canonical Pattern (Required)

```tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

void prefetch(trpc.example.getOne.queryOptions({ id }));

return (
  <HydrateClient>
    <MyComponent />
  </HydrateClient>
);
```

### Rules

- Import `{ HydrateClient, prefetch, trpc }` from `"@/trpc/server"` — never import `getQueryClient`, `dehydrate`, or `HydrationBoundary` in page/layout Server Components.
- The `prefetch` helper automatically detects whether the query is infinite or standard and dispatches to the correct underlying method.
- Multiple `prefetch()` calls are allowed before a single `<HydrateClient>` wrapper — the shared per-request `QueryClient` accumulates all prefetched data.
- `<HydrateClient>` dehydrates the shared request-scoped `QueryClient` and injects it into the React tree via `<HydrationBoundary>` automatically.

## 6. Environment Variable Validation (Fail-Fast)

**Never use `process.env.VARIABLE_NAME` directly** where it may be `undefined`. Before initializing any service (Stripe, OAuth, databases, etc.) or using an environment variable, you **must** explicitly check if it exists. If it is missing or empty, throw a descriptive `CRITICAL:` error immediately. This applies to both server-side and `NEXT_PUBLIC_` client-side variables.

### Why

- TypeScript types `process.env.*` as `string | undefined`. Non-null assertions (`!`) and empty-string fallbacks (`|| ""`) silently mask misconfiguration.
- A missing variable should crash the app **immediately** at startup with a clear message, not cause cryptic failures deep in business logic.

### ❌ Forbidden Patterns

```typescript
// Non-null assertion — hides undefined from TypeScript, crashes at runtime
const secret = process.env.STRIPE_SECRET_KEY!;

// Empty-string fallback — app starts but connects to nothing
const dbUrl = process.env.DATABASE_URL || "";

// Unsafe cast — lies to TypeScript about the type
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
```

### ✅ Required Pattern

```typescript
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    "CRITICAL: STRIPE_SECRET_KEY is not set in the environment variables.",
  );
}

// TypeScript now strictly types secretKey as `string`, avoiding `undefined` errors
export const stripe = new Stripe(secretKey, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});
```

### Rules

- Always extract `process.env.VARIABLE_NAME` into a `const` first.
- Immediately check if the value is falsy (`!value`).
- Throw an `Error` with a `"CRITICAL: VARIABLE_NAME is not set in the environment variables."` message.
- Use the validated constant in all subsequent code — never re-read `process.env` for the same variable.
- `process.env.NODE_ENV` is always injected by Next.js and does **not** need validation.
- Boolean feature flags (e.g., `NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING`) that default to `false` when absent do **not** need a throw — treat missing as `false`.

---

## ESLint Rules

The project uses ESLint 9 with a flat config (`eslint.config.mjs`):

- **`next/core-web-vitals`** and **`next/typescript`** base configs.
- **`react/jsx-sort-props`**: JSX props must be sorted alphabetically, callbacks last, reserved props first.
- **`simple-import-sort`**: Imports are auto-sorted into 7 groups:
  1. Side-effect imports
  2. React / Next.js
  3. Third-party packages (`@tanstack/*`, `stripe`, etc.)
  4. Internal aliases (`@/`)
  5. Parent imports (`../`)
  6. Sibling imports (`./`)
  7. Catch-all

---

## Key Files (Do Not Edit Manually)

- `src/payload-types.ts` — Auto-generated by `bun run generate:types`. Never hand-edit.
- `src/app/(payload)/` — Auto-generated Payload admin panel routes.
- `src/app/(app)/importMap.js` — Auto-generated by `bun run generate:importmap`.

---

## Payload CMS Collections

| Collection | Slug         | Multi-Tenant | Notes                                                                                  |
| ---------- | ------------ | ------------ | -------------------------------------------------------------------------------------- |
| Users      | `users`      | —            | Roles: `user`, `super-admin`. Auth collection.                                         |
| Tenants    | `tenants`    | —            | Each tenant has a `slug`, `stripeAccountId`, `stripeDetailsSubmitted`.                 |
| Products   | `products`   | ✅           | Digital products with `price`, `category`, `tags`, `image`, `cover`, `description`.    |
| Media      | `media`      | ✅           | File uploads stored in Vercel Blob.                                                    |
| Categories | `categories` | —            | Product categories with `name`, `slug`, `color`.                                       |
| Tags       | `tags`       | —            | Product tags with `name`.                                                              |
| Orders     | `orders`     | —            | Tracks purchases with `user`, `product`, `stripeCheckoutSessionId`, `stripeAccountId`. |
| Reviews    | `reviews`    | —            | User reviews with `rating` (1–5), `description`, linked to `user` and `product`.       |

---

## tRPC Routers

The root router (`src/trpc/routers/_app.ts`) merges these sub-routers:

| Router       | Module                                        |
| ------------ | --------------------------------------------- |
| `auth`       | `src/modules/auth/server/procedures.ts`       |
| `categories` | `src/modules/categories/server/procedures.ts` |
| `checkout`   | `src/modules/checkout/server/procedures.ts`   |
| `library`    | `src/modules/library/server/procedures.ts`    |
| `products`   | `src/modules/products/server/procedures.ts`   |
| `reviews`    | `src/modules/reviews/server/procedures.ts`    |
| `tags`       | `src/modules/tags/server/procedures.ts`       |
| `tenants`    | `src/modules/tenants/server/procedures.ts`    |

### Procedure Types

- **`baseProcedure`**: Injects Payload CMS instance as `ctx.db`. Public.
- **`protectedProcedure`**: Extends `baseProcedure` with auth check. Adds `ctx.session.user`. Throws `UNAUTHORIZED` if not authenticated.

---

## Stripe Integration

- Stripe is used for **Stripe Connect** — each tenant has their own connected Stripe account.
- Platform takes a `PLATFORM_FEE_PERCENTAGE` (10%) on each transaction.
- Webhook handler: `src/app/(app)/api/stripe/webhooks/route.ts`
- Stripe client singleton: `src/lib/stripe.ts`
- Stripe verification admin component: `src/components/stripe-verify.tsx` (registered in Payload admin nav via `beforeNavLinks`).
