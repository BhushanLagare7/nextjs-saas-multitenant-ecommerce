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
  throw new Error("CRITICAL: STRIPE_SECRET_KEY is not set in the environment variables.");
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

