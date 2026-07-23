# Review Comment Log

This log tracks code review comments generated during development and the subsequent actions taken to resolve them.

---

## 📋 Review Log

### 🔗 PR-2: style(theme): switch to DM Sans and customize UI components

- **Commit SHA:** `0f6e6b0b32de65c6a8007f7167d9a0c2476ff53e`

#### Inline Comments

- [ ] **[src/components/ui/button.tsx](src/components/ui/button.tsx) (Lines 23-24)**
  - _Issue:_ Hardcoded white backgrounds lack dark-mode text contrast.
  - _Action:_ Update elevated variant classes to include an explicit dark text utility such as `text-black`.
- [ ] **[src/components/ui/input.tsx](src/components/ui/input.tsx) (Lines 11-12)**
  - _Issue:_ Hardcoded white background / text contrast issues.
  - _Action:_ Add `text-black` to modified classes or replace fixed background with theme-aware utilities like `dark:bg-input/30` or `bg-background`.
- [ ] **[src/components/ui/input.tsx](src/components/ui/input.tsx) & [src/components/ui/textarea.tsx](src/components/ui/textarea.tsx) (Lines 8-13)**
  - _Issue:_ Overriding defaults.
  - _Action:_ Move the `className` argument to the end of the `cn()` call, after component-specific utility classes, so consumer-provided classes override defaults.

---

### 🔗 PR-3: feat(home): add marketing pages, layout, and ui adjustments

- **Commit SHA:** `466478dadfff7c5722856afa57930afeac9b81a0`

#### Inline Comments

- [ ] **[src/app/(home)/navbar.tsx](<src/app/(home)/navbar.tsx>) (Lines 96-102)**
  - _Issue:_ Accessibility.
  - _Action:_ Add screen-reader-only text describing the mobile menu action inside the Button rendering the `MenuIcon`, while preserving its existing `onClick` behavior and visual styling.
- [ ] **[src/components/ui/textarea.tsx](src/components/ui/textarea.tsx) (Lines 9-12)**
  - _Issue:_ Utility overriding.
  - _Action:_ Update the `className` ordering so the component's default `"bg-white md:text-base"` utilities are passed before the consumer `className`, allowing `cn` to preserve consumer overrides for background and responsive text-size classes.

---

### 🔗 PR-4: feat: integrate Payload CMS and group app routes

- **Commit SHA:** `3965975832fb4b5bdc2581e48f4744ec214f17bb`

#### Inline Comments

- [ ] **[next.config.ts](next.config.ts) (Lines 3-10)**
  - _Issue:_ Duplicate import/wrapping.
  - _Action:_ Remove duplicate `withPayload` import and update the default export so `withPayload` wraps `nextConfig` exactly once; leave the `NextConfig` definition unchanged.
- [ ] **[review-comments.md](review-comments.md) (Lines 30-34)**
  - _Issue:_ Wrong file reference.
  - _Action:_ Update the navbar reference to use `src/app/(app)/(home)/navbar.tsx` while preserving the existing recommendation content.
- [ ] **[src/app/(app)/(home)/navbar.tsx](<src/app/(app)/(home)/navbar.tsx>) (Lines 95-103)**
  - _Issue:_ Accessibility.
  - _Action:_ Update the mobile menu Button wrapping `MenuIcon` to include an accessible label describing that it opens the navigation/sidebar, using an `aria-label` or equivalent visually hidden text while preserving the existing click behavior.

#### Nitpick Comments

- [ ] **[src/app/(app)/(home)/navbar-sidebar.tsx](<src/app/(app)/(home)/navbar-sidebar.tsx>) (Lines 30-32)**
  - _Issue:_ Missing accessibility description.
  - _Action:_ Add `SheetDescription` to the `SheetHeader` alongside `SheetTitle`, importing it from the existing sheet UI module and applying the `sr-only` class so the description is present without changing the visual layout.
- [ ] **[src/app/(app)/(home)/navbar.tsx](<src/app/(app)/(home)/navbar.tsx>) (Lines 26-39)**
  - _Issue:_ Missing dynamic accessibility state.
  - _Action:_ Update the `Link` element in `NavbarItem` to set `aria-current="page"` when `isActive` is true, leaving it unset for inactive links.
- [ ] **[src/app/(app)/(home)/page.tsx](<src/app/(app)/(home)/page.tsx>) (Line 13)**
  - _Issue:_ HTML element semantics.
  - _Action:_ Update the component's JSON output wrapper around `JSON.stringify(data, null, 2)` from a `div` to a `pre` element so indentation and line breaks are preserved in the browser.

---

### 🔗 PR-5: feat(home): add category search filters

- **Commit SHA:** `632fb9af2c2310380935489f352e06f3063c0598`

#### Inline Comments

- [ ] **[package.json](package.json) (Line 13)**
  - _Issue:_ Destructive script guard.
  - _Action:_ Update the `db:fresh` package script to guard the `payload migrate:fresh` command with an explicit environment check and interactive confirmation, preventing execution when production credentials or an unconfirmed destructive reset are detected.
- [ ] **[src/app/(app)/(home)/search-filters/category-dropdown.tsx](<src/app/(app)/(home)/search-filters/category-dropdown.tsx>) (Lines 23-35)**
  - _Issue:_ Dropdown position calculation.
  - _Action:_ Update the category dropdown position handling around `onMouseEnter` and `getDropdownPosition`: store the computed position in state, initialize it appropriately, and calculate it only during the hover event after the DOM is committed. Remove the direct `getDropdownPosition()` call from render while preserving the existing `isOpen` behavior for categories with subcategories.
- [ ] **[src/app/(app)/(home)/search-filters/subcategory-menu.tsx](<src/app/(app)/(home)/search-filters/subcategory-menu.tsx>) (Lines 5-7)**
  - _Issue:_ FormattedCategory type usage.
  - _Action:_ Define a shared `FormattedCategory` type based on `Category` with `subcategories?: Category[]`, then update `Props` in `src/app/(app)/(home)/search-filters/subcategory-menu.tsx` lines 5-7 to use it and remove the TODO; also update `Props` in `src/app/(app)/(home)/search-filters/category-dropdown.tsx` line 54 to use the same type so array operations compile safely.
- [ ] **[src/app/(app)/(home)/search-filters/use-dropdown-position.ts](<src/app/(app)/(home)/search-filters/use-dropdown-position.ts>) (Lines 12-24)**
  - _Issue:_ Dropdown position scrolling offset.
  - _Action:_ Update the dropdown position calculation in `useDropdownPosition` to use viewport coordinates for the fixed `SubcategoryMenu`: remove `window.scrollX` and `window.scrollY` from the left and top calculations, including the right-alignment fallback, while preserving the existing viewport boundary checks.

#### Nitpick Comments

- [ ] **[src/app/(app)/(home)/layout.tsx](<src/app/(app)/(home)/layout.tsx>) (Lines 30-37)**
  - _Issue:_ Shaded/conflicting variable names in map callback.
  - _Action:_ Rename the inner map parameter in the subcategories mapping within the outer `data.docs` map to a distinct name, and update its references accordingly while preserving the existing `Category` transformation.
- [ ] **[src/app/(app)/(home)/search-filters/index.tsx](<src/app/(app)/(home)/search-filters/index.tsx>) (Lines 4-10)**
  - _Issue:_ FormattedCategory type typing.
  - _Action:_ Replace the `any` data prop with `FormattedCategory[]` in `SearchFilters` within `src/app/(app)/(home)/search-filters/index.tsx` lines 4-10, and apply the same type to the `data` prop in the corresponding component in `src/app/(app)/(home)/search-filters/categories.tsx` lines 5-7. Ensure both components use the shared `FormattedCategory` type so the category tree remains strongly typed.
- [ ] **[src/app/(app)/(home)/search-filters/subcategory-menu.tsx](<src/app/(app)/(home)/search-filters/subcategory-menu.tsx>) (Lines 37-38)**
  - _Issue:_ Unnecessary explicit type annotation.
  - _Action:_ Update the subcategory mapping in the component to use the inferred callback parameter type from `category.subcategories`, removing the explicit `Category` annotation on `subcategory` after `category` adopts `FormattedCategory`.

---

### 🔗 PR-6: feat(search-filters): add category navigation and responsive sidebar

- **Commit SHA:** `2188123864b6f692fa3d792d83a0bc56e1937442`

#### Inline Comments

- [ ] **[package.json](package.json) (Line 13)**
  - _Issue:_ Guard db:fresh script against production execution.
  - _Action:_ Update the db:fresh package script to guard against production execution before invoking payload migrate:fresh, allowing the destructive command only when the environment is non-production and exiting safely otherwise.

#### Outside Diff Comments

- [ ] **[src/app/(app)/(home)/search-filters/category-dropdown.tsx](<src/app/(app)/(home)/search-filters/category-dropdown.tsx>) (Lines 25-38)**
  - _Issue:_ Render-time getDropdownPosition call in component body.
  - _Action:_ Remove the render-time getDropdownPosition call from the component body. In onMouseEnter, after confirming category.subcategories, measure the dropdown via getDropdownPosition and store the result in state; use that stored position for rendering while preserving the existing open/close behavior.

#### Nitpick Comments

- [ ] **[src/app/(app)/(home)/search-filters/categories-sidebar.tsx](<src/app/(app)/(home)/search-filters/categories-sidebar.tsx>) (Line 50)**
  - _Issue:_ Typo in comment.
  - _Action:_ Correct the typographical error in the comment describing the main category navigation, changing “navigat” to “navigate” without altering the surrounding logic.
- [ ] **[src/app/(app)/(home)/search-filters/categories-sidebar.tsx](<src/app/(app)/(home)/search-filters/categories-sidebar.tsx>) (Lines 1-2)**
  - _Issue:_ Missing "use client" directive.
  - _Action:_ Add the "use client" directive at the beginning of the categories sidebar module, before its imports, so the component using useState and useRouter is explicitly treated as a client component.
- [ ] **[src/app/(app)/(home)/search-filters/categories.tsx](<src/app/(app)/(home)/search-filters/categories.tsx>) (Lines 78-79)**
  - _Issue:_ Conflicting absolute utility and inline style.
  - _Action:_ Unify the hidden element’s positioning in the className by replacing the conflicting absolute utility and inline style in the categories component with Tailwind utilities, including arbitrary values for fixed positioning and off-screen top/left offsets. Remove the inline style while preserving the existing pointer-events-none, flex, and opacity behavior.
- [ ] **[src/app/(app)/(home)/search-filters/category-dropdown.tsx](<src/app/(app)/(home)/search-filters/category-dropdown.tsx>) (Lines 40-45)**
  - _Issue:_ Mobile dropdown TODO.
  - _Action:_ Resolve the mobile dropdown TODO by implementing the commented toggleDropdown behavior near the category dropdown state: only toggle isOpen when category.subcategories?.docs contains items, and remove the obsolete TODO and commented-out code after wiring the handler into the mobile dropdown interaction.
- [ ] **[src/app/(app)/(home)/search-filters/search-input.tsx](<src/app/(app)/(home)/search-filters/search-input.tsx>) (Lines 37-45)**
  - _Issue:_ Stale TODO.
  - _Action:_ Remove the stale “Add categories view all button” TODO near the mobile filter Button, since that functionality is already implemented; leave the separate “Add library button” TODO unchanged for future tracking.

---

### 🔗 PR-8: feat(auth): add login and registration flows

- **Commit SHA:** `e9e9c665ef7e6f4fc6f79cb0a87c6552dcf66e8e`

#### Inline Comments

- [ ] **[src/modules/auth/server/procedures.ts](src/modules/auth/server/procedures.ts) (Lines 80-94)**
  - _Issue:_ Missing error handling for invalid credentials.
  - _Action:_ Wrap the Payload login call in the authentication procedure with try/catch so errors from ctx.db.login for invalid credentials are converted into a TRPCError with code UNAUTHORIZED, preserving the existing missing-token handling and successful login behavior.
- [ ] **[src/modules/auth/server/procedures.ts](src/modules/auth/server/procedures.ts) (Lines 25-42)**
  - _Issue:_ Generic duplicate user lookup.
  - _Action:_ Update the existing-user lookup before ctx.db.create to detect duplicates for both input.username and input.email, then distinguish the matched field and throw a BAD_REQUEST TRPCError with a user-friendly message such as “Username already taken” or “Email already registered.”

#### Nitpick Comments

- [ ] **[src/app/(app)/(home)/page.tsx](<src/app/(app)/(home)/page.tsx>) (Lines 7-12)**
  - _Issue:_ Component renders user data before query resolves.
  - _Action:_ Update the Home component’s useQuery result handling to check isPending before rendering the serialized user data. Render an appropriate loading state while the session query is pending, then preserve the existing JSON output once data resolves.

---

### 🔗 PR-10: refactor(home): relocate UI components and add dynamic category routes

- **Commit SHA:** `7454bbc215703266c97cb75a06d786d2539b7252`

#### Inline Comments

- [ ] **[src/modules/home/ui/components/navbar-sidebar.tsx](src/modules/home/ui/components/navbar-sidebar.tsx) (Lines 44-59)**
  - _Issue:_ Needs authenticated mobile menu state.
  - _Action:_ Update NavbarSidebarProps and the NavbarSidebar component to accept the user session state, then render the bottom mobile-menu link conditionally: show a Dashboard link for authenticated users and retain the Log in and Start selling links for unauthenticated users. Preserve the existing styling and onOpenChange(false) behavior.
- [ ] **[src/modules/home/ui/components/navbar.tsx](src/modules/home/ui/components/navbar.tsx) (Lines 66-113)**
  - _Issue:_ Unauthenticated controls flashing before session resolves.
  - _Action:_ Update the navbar authentication rendering around session.data to show a placeholder while session.isLoading is true, preventing unauthenticated controls from flashing before the session resolves. Pass the relevant session state, including loading/authenticated status, into NavbarSidebar so its mobile menu renders the correct links instead of relying on hardcoded options.
- [ ] **[src/modules/home/ui/components/search-filters/category-dropdown.tsx](src/modules/home/ui/components/search-filters/category-dropdown.tsx) (Lines 55-67)**
  - _Issue:_ Anchor inside button element.
  - _Action:_ Update the Button rendering in the category dropdown to use its asChild prop, allowing the nested Link to render as the button element instead of placing an anchor inside a button. Preserve the existing className, variant, href, and category label behavior.
- [ ] **[src/modules/home/ui/components/search-filters/index.tsx](src/modules/home/ui/components/search-filters/index.tsx) (Lines 19-30)**
  - _Issue:_ Potential null pointer on category params.
  - _Action:_ Update the parameter reads in the component using useParams so category and subcategory are accessed through optional chaining, preserving their existing string-or-undefined casts and fallback behavior when params is null.
- [ ] **[src/modules/home/ui/components/search-filters/subcategory-menu.tsx](src/modules/home/ui/components/search-filters/subcategory-menu.tsx) (Lines 23-30)**
  - _Issue:_ Unsupported z-100 Tailwind class.
  - _Action:_ Update the className in the subcategory menu component to replace the unsupported z-100 Tailwind class with the arbitrary-value class z-[100], preserving the existing fixed positioning and layout styles.
- [ ] **[src/modules/home/ui/components/search-filters/use-dropdown-position.ts](src/modules/home/ui/components/search-filters/use-dropdown-position.ts) (Lines 12-25)**
  - _Issue:_ Scrolling offset issues in viewport coordinates.
  - _Action:_ Update the dropdown position calculation to use viewport-relative rect values directly: remove window.scrollX and window.scrollY from left and top calculations, including the right-alignment branch. Preserve the existing viewport boundary logic, and compute DOM layout values outside the React render body, such as in an effect or event handler with state, if the surrounding hook supports it.

#### Outside Diff Comments

- [ ] **[src/app/(app)/(home)/layout.tsx](<src/app/(app)/(home)/layout.tsx>) (Lines 17-20)**
  - _Issue:_ Fire-and-forget prefetch does not block dehydrate.
  - _Action:_ Await the categories prefetch in the Layout function by replacing the fire-and-forget call to queryClient.prefetchQuery with an awaited call, ensuring it completes before the query client is dehydrated.

#### Nitpick Comments

- [ ] **[src/modules/home/ui/components/search-filters/category-dropdown.tsx](src/modules/home/ui/components/search-filters/category-dropdown.tsx) (Lines 28-33)**
  - _Issue:_ Console.log debug statement left in codebase.
  - _Action:_ Remove the console.log debug statement from the onMouseEnter handler in the category dropdown, preserving the existing subcategories check and setIsOpen(true) behavior.
- [ ] **[src/modules/home/ui/components/search-filters/search-input.tsx](src/modules/home/ui/components/search-filters/search-input.tsx) (Lines 36-42)**
  - _Issue:_ Icon-only button lacking accessible name.
  - _Action:_ Add an accessible name to the icon-only Button rendering ListFilterIcon by providing a descriptive aria-label or visually hidden text, while preserving its existing styling and onClick behavior.

---

### 🔗 PR-11: feat(products): add collection and query by category

- **Commit SHA:** `9da39f46df22d009dc7d30cfcfb75a787327f61f`

#### Inline Comments

- [ ] **[src/app/(app)/(home)/[category]/page.tsx](<src/app/(app)/(home)/[category]/page.tsx>) & [src/app/(app)/(home)/[category]/[subcategory]/page.tsx](<src/app/(app)/(home)/[category]/[subcategory]/page.tsx>) (Lines 20-33)**
  - _Issue:_ Fire-and-forget prefetch query does not block dehydrate.
  - _Action:_ Await queryClient.prefetchQuery before calling dehydrate, replacing the void invocation while preserving the existing query options and hydration flow.
- [ ] **[src/collections/Products.ts](src/collections/Products.ts) (Lines 16-22)**
  - _Issue:_ Missing minimum validation on price field.
  - _Action:_ Update the price field configuration in Products to add a minimum validation constraint of 0, ensuring users and integrations cannot save negative prices while preserving the existing required number-field behavior.
- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Lines 41-53)**
  - _Issue:_ Missing-category case triggers error on accessing undefined parent category slug.
  - _Action:_ Handle the missing-category case in the category filtering logic by moving the where["category.slug"] assignment inside the parentCategory guard. When parentCategory is undefined, return or apply the established fallback behavior without accessing parentCategory.slug; preserve inclusion of the parent and subcategory slugs when it exists.

#### Nitpick Comments

- [ ] **[src/app/(app)/(home)/[category]/[subcategory]/page.tsx](<src/app/(app)/(home)/[category]/[subcategory]/page.tsx>) (Lines 11-15)**
  - _Issue:_ Props interface's params type is missing category string.
  - _Action:_ Update the Props interface’s params type to include the category string alongside subcategory, matching the parameters exposed by the [category]/[subcategory] route.
- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Line 30)**
  - _Issue:_ Leftover console.log statement in procedures module.
  - _Action:_ Remove the leftover console.log statement that serializes categoriesData, leaving the surrounding product procedure behavior unchanged.
- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Lines 34-36)**
  - _Issue:_ Conflicting callback parameter name inside subcategories map.
  - _Action:_ Rename the inner map callback variable in the subcategories mapping within the surrounding product mapping, and update its references in the spread and subsequent fields. Keep the outer map’s variable unchanged and preserve the existing Category cast and mapping behavior.

---

### 🔗 PR-12: feat(products): add price filters and grid layout

- **Commit SHA:** `bfc8adc40d460215cbed6978d85c8efa3a29c06f`

#### Inline Comments

- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Lines 19-32)**
  - _Issue:_ Price filters in query-building logic use string inputs instead of numbers.
  - _Action:_ Update the price filters in the procedure’s query-building logic to convert minPrice and maxPrice string inputs to numbers before assigning them to greater_than_equal or less_than_equal. Preserve the existing combined and single-bound branches while ensuring every value in where.price is numeric.
- [ ] **[src/modules/products/ui/components/price-filter.tsx](src/modules/products/ui/components/price-filter.tsx) (Lines 33-74)**
  - _Issue:_ Keystrokes in controlled inputs are overwritten due to currency formatting on every render.
  - _Action:_ Update PriceFilter so its controlled inputs use the raw minPrice and maxPrice values rather than formatAsCurrency on every render, preventing keystrokes from being overwritten. Change both inputs to native number inputs and add a visual dollar-sign prefix for the minimum price while preserving the existing change handlers and controlled state behavior.
- [ ] **[src/modules/products/ui/components/product-list.tsx](src/modules/products/ui/components/product-list.tsx) (Lines 11-17)**
  - _Issue:_ URL-backed price constraints do not reach the server query.
  - _Action:_ Update ProductList to call useProductFilters and include its minPrice and maxPrice values in the products.getMany queryOptions alongside category, ensuring the URL-backed price constraints reach the server query.

#### Outside Diff Comments

- [ ] **[src/app/(app)/(home)/[category]/page.tsx](<src/app/(app)/(home)/[category]/page.tsx>) (Lines 22-26)**
  - _Issue:_ Products query prefetch is not awaited before dehydrating the query client.
  - _Action:_ Await the prefetchQuery call in the page’s data-prefetch flow before dehydrating the query client. Update the surrounding async page implementation as needed so the products query from trpc.products.getMany.queryOptions completes before dehydration, preserving the existing category parameter.

#### Nitpick Comments

- [ ] **[src/modules/products/hooks/use-product-filters.ts](src/modules/products/hooks/use-product-filters.ts) (Lines 4-13)**
  - _Issue:_ Price URL state updates lack throttleMs delay.
  - _Action:_ Update the useQueryStates configuration in useProductFilters to add the requested throttleMs delay for price URL state updates, applying it to both minPrice and maxPrice while preserving their existing clearOnDefault behavior.
- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Lines 47-53)**
  - _Issue:_ Inner map callback parameter in categoriesData transformation uses a conflicting name.
  - _Action:_ Rename the inner map callback parameter in the categoriesData transformation to a distinct name, while keeping the outer doc parameter and all mapping behavior unchanged.

---

### 🔗 PR-13: feat(products): add tag filtering and sorting

- **Commit SHA:** `d147333c1e98e92fb393c654787d303e7fafa9f0`

#### Inline Comments

- [ ] **[src/app/(app)/(home)/[category]/page.tsx](<src/app/(app)/(home)/[category]/page.tsx>) (Lines 26-32)**
  - _Issue:_ Products query prefetch is not awaited before dehydrating the query client in the server-rendering flow.
  - _Action:_ Await the prefetchQuery call in the page’s server-rendering flow instead of discarding its promise, ensuring the products query completes before dehydrate serializes queryClient. Keep the existing trpc.products.getMany.queryOptions configuration, including category and filters, unchanged.
- [ ] **[src/collections/Tags.ts](src/collections/Tags.ts) (Lines 15-20)**
  - _Issue:_ Products relationship field is stored as an independent array instead of being a derived relationship.
  - _Action:_ Replace the products relationship field in the Tags collection with a Payload join field that targets the Products collection’s tag relationship, so the inverse association is derived rather than stored as a second independent array. Preserve the products field name and hasMany behavior while configuring the join against the existing Products relationship symbol.
- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Lines 28-30)**
  - _Issue:_ The hot_and_new branch in the sort selection logic does not sort by descending createdAt.
  - _Action:_ Update the hot_and_new branch in the sort selection logic to assign descending createdAt ordering with -createdAt, so newest products appear first while preserving all other sort behavior.
- [ ] **[src/modules/products/ui/components/product-filters.tsx](src/modules/products/ui/components/product-filters.tsx) (Lines 64-66)**
  - _Issue:_ Stale filters spread in the onChange function prevents nuqs from merging rapid updates safely.
  - _Action:_ Update the onChange function to pass only the changed filter key and value to setFilters, removing the stale ...filters spread so nuqs can merge rapid updates safely.
- [ ] **[src/modules/products/ui/components/tags-filter.tsx](src/modules/products/ui/components/tags-filter.tsx) (Lines 47-62)**
  - _Issue:_ Inner map in tag list rendering is missing a stable page-specific key, and clickable div wrapper lacks semantic structure.
  - _Action:_ Update the tag list rendering around data.pages.map by wrapping each page’s inner map in a keyed fragment, using a stable page-specific key. Replace the clickable div row with a native label and remove its wrapper-level onClick, relying on the nested Checkbox interaction; ensure Checkbox.checked always receives a boolean fallback when value is undefined.
- [ ] **[src/modules/tags/server/procedures.ts](src/modules/tags/server/procedures.ts) (Lines 9-12)**
  - _Issue:_ Pagination input schema is missing integer constraints and safe boundary checks.
  - _Action:_ Update the pagination input schema’s cursor and limit fields to require integer values and enforce safe minimum/maximum bounds, using Zod 4’s int(), min(), and max() validators. Preserve DEFAULT_LIMIT as the limit default while applying the project’s established pagination boundaries to prevent oversized database requests.

#### Outside Diff Comments

- [ ] **[src/modules/products/ui/components/product-filters.tsx](src/modules/products/ui/components/product-filters.tsx) (Lines 27-33)**
  - _Issue:_ Clickable div in the accordion header is not accessible via keyboard.
  - _Action:_ Replace the clickable div in the accordion header with a native button element, preserving the existing title, Icon, styling, and setIsOpen toggle behavior. Ensure the button remains keyboard-focusable and activates the filter expansion through standard keyboard interaction.

#### Nitpick Comments

- [ ] **[src/modules/tags/server/procedures.ts](src/modules/tags/server/procedures.ts) (Lines 15-19)**
  - _Issue:_ Tags database query results are not explicitly sorted alphabetically.
  - _Action:_ Update the database query in the tags endpoint to explicitly sort results alphabetically by the `name` field, while preserving the existing pagination inputs and response flow.

---

### 🔗 PR-14: feat(products): add cards and infinite scroll

- **Commit SHA:** `18d96bdd38639654700ec8d58b416c19ee37581b`

#### Inline Comments

- [ ] **[src/modules/products/ui/components/product-card.tsx](src/modules/products/ui/components/product-card.tsx) (Lines 40-52)**
  - _Issue:_ Click handler on author shop div in product card does not prevent parent Link navigation.
  - _Action:_ Update the author shop click handler in the product card’s author div to accept the click event and call preventDefault(), preventing the surrounding Next.js Link from navigating to the product page while preserving the existing placeholder behavior.

#### Outside Diff Comments

- [ ] **[src/app/(app)/(home)/[category]/page.tsx](<src/app/(app)/(home)/[category]/page.tsx>) & [src/app/(app)/(home)/[category]/[subcategory]/page.tsx](<src/app/(app)/(home)/[category]/[subcategory]/page.tsx>) (Lines 20-25)**
  - _Issue:_ Server-side prefetch logic does not match client-side useSuspenseInfiniteQuery configuration.
  - _Action:_ Update the prefetch logic in src/app/(app)/(home)/[category]/page.tsx at lines 20-25 and src/app/(app)/(home)/[category]/[subcategory]/page.tsx at lines 20-25 to use prefetchInfiniteQuery with infiniteQueryOptions, passing limit: DEFAULT_LIMIT to match the client’s useSuspenseInfiniteQuery configuration; add the DEFAULT_LIMIT import in both files.

---

### 🔗 PR-15: feat: add multi-tenant support and fix DB seeding

- **Commit SHA:** `36d3988e6255c1d8cb12d0366d0a314f5863db65`

#### Inline Comments

- [ ] **[src/app/(app)/(home)/page.tsx](<src/app/(app)/(home)/page.tsx>) (Lines 17-29) & [src/app/(app)/(home)/[category]/page.tsx](<src/app/(app)/(home)/[category]/page.tsx>) (Lines 21-33) & [src/app/(app)/(home)/[category]/[subcategory]/page.tsx](<src/app/(app)/(home)/[category]/[subcategory]/page.tsx>) (Lines 21-33)**
  - _Issue:_ Fire-and-forget prefetchInfiniteQuery calls do not block dehydrate.
  - _Action:_ Await the prefetchInfiniteQuery call in src/app/(app)/(home)/page.tsx lines 17-29, src/app/(app)/(home)/[category]/page.tsx lines 21-33, and src/app/(app)/(home)/[category]/[subcategory]/page.tsx lines 21-33 by replacing void with await, ensuring dehydrate(queryClient) runs only after each products.getMany prefetch completes.
- [ ] **[src/collections/Users.ts](src/collections/Users.ts) (Lines 4-18, 33-42)**
  - _Issue:_ Users roles and field access allow unrestricted privilege changes or operations.
  - _Action:_ In src/collections/Users.ts lines 33-42, add field-level create and update access rules permitting only existing super-admins; in src/collections/Users.ts lines 4-18, replace the unrestricted create and update rules in arrayFieldAccess and tenantFieldAccess with equivalent authorized-role checks, preserving read behavior.
- [ ] **[src/modules/auth/server/procedures.ts](src/modules/auth/server/procedures.ts) (Lines 40-47)**
  - _Issue:_ Tenant creation slug assigned from username is not normalized into a URL-safe subdomain.
  - _Action:_ Update the tenant creation data in the authentication procedure so the slug assigned from input.username is normalized into a URL-safe subdomain value, using the project’s existing slugify utility if available or equivalent normalization. Keep the tenant name unchanged and ensure spaces and special characters cannot produce an invalid slug.

#### Outside Diff Comments

- [ ] **[src/modules/home/ui/components/search-filters/category-dropdown.tsx](src/modules/home/ui/components/search-filters/category-dropdown.tsx) (Lines 26-31)**
  - _Issue:_ Dropdown opens on hover even for categories with empty subcategories, and contains a debug console.log.
  - _Action:_ Update onMouseEnter in the category dropdown to open the menu only when category.subcategories contains at least one item, and remove the leftover console.log statement. Preserve the existing behavior for categories with non-empty subcategories.

#### Nitpick Comments

- [ ] **[src/modules/home/ui/components/search-filters/category-dropdown.tsx](src/modules/home/ui/components/search-filters/category-dropdown.tsx) (Line 24)**
  - _Issue:_ Unused dropdownRef declaration, ref prop, and useRef import.
  - _Action:_ Remove the unused dropdownRef declaration from the category dropdown component and remove the corresponding ref prop from its wrapper div. Also clean up the now-unused useRef import if present, while preserving the component’s remaining behavior.
- [ ] **[src/modules/home/ui/components/search-filters/subcategory-menu.tsx](src/modules/home/ui/components/search-filters/subcategory-menu.tsx) (Lines 23-29)**
  - _Issue:_ Subcategory menu uses inline styles for positioning instead of Tailwind utilities.
  - _Action:_ Update the positioning container in the subcategory menu to remove its inline top and left styles, replacing them with the Tailwind utilities top-full and left-0 in its className while preserving the existing absolute positioning and z-index classes.

---

### 🔗 PR-16: feat(tenants): add multi-tenant pages and rebrand

- **Commit SHA:** `ce185a0a7d2b59ae255fab460fd1f29583ddab29`

#### Inline Comments

- [ ] **[src/app/(app)/(tenants)/tenants/[slug]/(home)/page.tsx](<src/app/(app)/(tenants)/tenants/[slug]/(home)/page.tsx>) (Lines 19-32)**
  - _Issue:_ Fire-and-forget prefetchInfiniteQuery call does not block dehydrate in the tenant page.
  - _Action:_ Await the queryClient.prefetchInfiniteQuery call in the tenant page before the subsequent dehydrate(queryClient) execution, replacing the fire-and-forget invocation while preserving its existing products.getMany options and pagination behavior.
- [ ] **[src/modules/products/ui/components/product-list.tsx](src/modules/products/ui/components/product-list.tsx) (Lines 59-73)**
  - _Issue:_ Product list renders entries with missing or invalid tenant relationships.
  - _Action:_ Filter the products in the data pipeline before the ProductCard map so only entries with a populated tenant object and a valid tenant.slug remain. Update the rendering flow around the pages flatMap/map chain, preserving the existing card fields while ensuring tenantSlug is always a string and invalid or missing tenant relationships are excluded.

#### Outside Diff Comments

- [ ] **[src/modules/products/ui/components/product-card.tsx](src/modules/products/ui/components/product-card.tsx) (Lines 1-88)**
  - _Issue:_ ProductCard relies on an outer Link wrapper and programmatic navigation handlers.
  - _Action:_ Update ProductCard to remove the outer Link, use a relative div as the card container, and delete useRouter plus handleUserClick. Make the product title a Link to the product route with before:absolute before:inset-0 so the card remains fully clickable, and replace the tenant click handler with a semantic Link to generateTenantURL(tenantSlug) using relative z-10 for proper layering and keyboard focus.

#### Nitpick Comments

- [ ] **[src/modules/tenants/ui/components/navbar.tsx](src/modules/tenants/ui/components/navbar.tsx) (Lines 44-45)**
  - _Issue:_ TODO comment near checkout button lacks dynamic loading placeholder.
  - _Action:_ Replace the TODO near the checkout button in the navbar component with the project’s standard pulsing skeleton placeholder, matching the button’s expected dimensions so layout remains stable during hydration and data fetching.

---

### 🔗 PR-18: feat(checkout): add multi-tenant cart system

- **Commit SHA:** `fe2675cd44d231e976e3afd5b587d74c956aeca2`

#### Inline Comments

- [ ] **[src/modules/checkout/hooks/use-cart.ts](src/modules/checkout/hooks/use-cart.ts) (Lines 4-12)**
  - _Issue:_ Cart hook subscribes to the entire store instead of using granular selectors.
  - _Action:_ Update the useCartStore usage in the cart hook to use granular selectors for the tenant-specific productIds and each cart action instead of subscribing to the entire store. Keep the empty-array fallback outside the productIds selector and reuse a stable fallback reference, so missing tenant carts do not produce a new array during store updates.
- [ ] **[src/modules/checkout/store/use-cart-store.ts](src/modules/checkout/store/use-cart-store.ts) (Lines 21-32)**
  - _Issue:_ addProduct does not check if productId already exists in the tenant's current productIds before appending.
  - _Action:_ Update addProduct in the cart store to check whether productId already exists in the tenant’s current productIds before appending it. Preserve the existing cart state and return the unchanged product list when the product is already present, ensuring totalItems and removeProduct behavior remain consistent.

---

### 🔗 PR-19: feat(checkout): implement tenant checkout UI and endpoint

- **Commit SHA:** `e4ce1cdd9dc1965cd9b2202d87f50da34374d52e`

#### Inline Comments

- [ ] **[src/modules/auth/ui/views/sign-in-view.tsx](src/modules/auth/ui/views/sign-in-view.tsx) (Line 91)**
  - _Issue:_ Brand capitalization in sign-in view.
  - _Action:_ Update the heading in the sign-in view to use the canonical “Storegrid” brand capitalization, matching the existing title casing elsewhere while preserving the rest of the heading text.
- [ ] **[src/modules/checkout/server/procedures.ts](src/modules/checkout/server/procedures.ts) (Lines 25-32)**
  - _Issue:_ Checkout procedure throwing errors on missing product IDs.
  - _Action:_ Update the checkout procedure around the totalDocs validation and totalPrice calculation to stop throwing when some product IDs are missing. Return the found products together with the missing IDs, allowing the checkout view to remove only invalid cart entries instead of calling clearAllCarts(); preserve normal pricing for all found products.
- [ ] **[src/modules/checkout/ui/views/checkout-view.tsx](src/modules/checkout/ui/views/checkout-view.tsx) (Lines 28-33)**
  - _Issue:_ NOT_FOUND error handling clearing carts for every tenant.
  - _Action:_ Update review-comment-log.md lines 411-413 to instruct using the tenant-scoped clearCart returned by useCart(tenantSlug), without passing tenantSlug again, while preserving the warning toast and dependencies.

#### Nitpick Comments

- [ ] **[src/modules/checkout/ui/views/checkout-view.tsx](src/modules/checkout/ui/views/checkout-view.tsx) (Lines 24-54)**
  - _Issue:_ Products query running with empty productIds list.
  - _Action:_ Update the useQuery call in the checkout view to disable the products query when productIds is empty, and change the empty-state condition to check productIds.length directly. Preserve the existing loading and no-products rendering for non-empty carts.
- [ ] **[src/modules/checkout/ui/views/checkout-view.tsx](src/modules/checkout/ui/views/checkout-view.tsx) (Line 83)**
  - _Issue:_ Missing checkout submission behavior in onCheckout handler.
  - _Action:_ Update lines 420-422 to reference the existing onPurchase prop passed to CheckoutSidebar instead of onCheckout.

---

### 🔗 PR-20: feat(checkout): add Stripe integration

- **Commit SHA:** `c6778bdac1ddcab575cc474fcaf24dded09b39d5`

#### Inline Comments

- [ ] **[review-comment-log.md](review-comment-log.md) (Lines 411-413)**
  - _Issue:_ Stale clearCart instruction in log.
  - _Action:_ Update review-comment-log.md lines 411-413 to instruct using the tenant-scoped clearCart returned by useCart(tenantSlug), without passing tenantSlug again, while preserving the warning toast and dependencies.
- [ ] **[review-comment-log.md](review-comment-log.md) (Lines 420-422)**
  - _Issue:_ Stale onCheckout reference in log.
  - _Action:_ Update lines 420-422 to reference the existing onPurchase prop passed to CheckoutSidebar instead of onCheckout.
- [ ] **[src/app/(app)/api/stripe/webhooks/route.ts](<src/app/(app)/api/stripe/webhooks/route.ts>) (Lines 78-88)**
  - _Issue:_ Order creation in stripe webhook completes duplicate orders on retry.
  - _Action:_ Update the order creation loop in the checkout.session.completed webhook to check for an existing order matching the same stripeCheckoutSessionId and line item product before calling payload.create. Skip creation when a matching order already exists, while preserving creation for new session/product pairs so webhook retries are idempotent.
- [ ] **[src/collections/Orders.ts](src/collections/Orders.ts) (Lines 28-32)**
  - _Issue:_ Orders schema needs a stripeLineItemId field and update stripeCheckoutSessionId indexes.
  - _Action:_ Add a unique, indexed-by-uniqueness stripeLineItemId field to the Orders schema and populate it from the Stripe line item’s item.id when creating orders. Update stripeCheckoutSessionId to use index: true without unique enforcement, preserving support for multiple line items per checkout session.
- [ ] **[src/collections/Orders.ts](src/collections/Orders.ts) (Lines 8-33)**
  - _Issue:_ Orders schema lacks transaction amount and required tenant relationship fields.
  - _Action:_ Add an `amount` number field to the Orders `fields` definition to persist the transaction price, and add a required `tenant` relationship field targeting `tenants` with single-value semantics. Keep the existing `name`, `user`, `product`, and `stripeCheckoutSessionId` fields unchanged.
- [ ] **[src/collections/Orders.ts](src/collections/Orders.ts) (Lines 3-8)**
  - _Issue:_ Orders collection missing explicit authorization rules and access controls.
  - _Action:_ Update the Orders collection configuration to define explicit access controls for all CRUD operations. Restrict read access to authenticated users’ own orders, and deny or appropriately authorize create, update, and delete operations so unauthenticated users cannot access, create, or modify order data. Add the controls directly to the Orders collection rather than relying on Payload defaults.
- [ ] **[src/modules/checkout/server/procedures.ts](src/modules/checkout/server/procedures.ts) (Lines 72-88)**
  - _Issue:_ unit_amount calculation can pass non-integer values to Stripe.
  - _Action:_ Update the unit_amount calculation in the products.docs mapping to round product.price multiplied by 100 to the nearest integer before passing it to Stripe, while preserving the existing currency and metadata fields.
- [ ] **[src/modules/checkout/server/procedures.ts](src/modules/checkout/server/procedures.ts) (Line 70)**
  - _Issue:_ Checkout procedure creates charges without validating Stripe configuration.
  - _Action:_ Update the checkout procedure around the TODO to require tenant.stripeDetailsSubmitted before creating a charge, and configure the Stripe Checkout Session to use tenant.stripeAccountId as the connected-account destination so funds route to the tenant. Preserve the existing checkout flow for valid tenants and reject tenants missing submitted Stripe details or a connected account.
- [ ] **[src/modules/checkout/ui/views/checkout-view.tsx](src/modules/checkout/ui/views/checkout-view.tsx) (Lines 53-67)**
  - _Issue:_ Success/error effects depend on unstable callbacks and perform history-preserving redirects.
  - _Action:_ Update the success and error useEffects in the checkout view to avoid depending on the unstable clearCart function reference, while preserving their existing behavior. Replace router.push with router.replace in the success effect so the success URL state is not retained in browser history and navigation cannot loop on back navigation.

#### Nitpick Comments

- [ ] **[src/app/(app)/api/stripe/webhooks/route.ts](<src/app/(app)/api/stripe/webhooks/route.ts>) (Lines 45-92)**
  - _Issue:_ Switch case lacks lexical block scoping for localized variable declarations.
  - _Action:_ Wrap the statements in the "checkout.session.completed" branch of the webhook switch in braces to create a case-local block. Keep the existing validation, user lookup, session expansion, line-item processing, and break behavior unchanged while scoping the declarations user, expandedSession, and lineItems to that case.

---

### 🔗 PR-21: feat(library): add user library and purchase checks

- **Commit SHA:** `fa926ca9e75013ca27807c85c670f4e1564e1127`

#### Inline Comments

- [ ] **[review-comment-log.md](review-comment-log.md) (Lines 438-440)**
  - _Issue:_ Checkout session completed order creation loop needs line-item ID deduplication.
  - _Action:_ Update the checkout.session.completed order creation loop to persist and query Stripe’s line-item ID from item.id before calling payload.create, using it with the checkout session identifier for deduplication. Skip creation only when that exact session/line-item order already exists, while preserving creation for distinct line items and new webhook deliveries.
- [ ] **[src/modules/library/server/procedures.ts](src/modules/library/server/procedures.ts) (Lines 30-48)**
  - _Issue:_ Library procedure loses pagination metadata from ordersData or queries empty productIds.
  - _Action:_ Update the procedure’s return object to preserve pagination metadata from ordersData while still mapping product documents from productsData.docs. In the products lookup, skip the database query when productIds is empty and use an empty document list, while retaining the existing document transformations for non-empty IDs.

---

### 🔗 PR-22: feat(reviews): add product review system and detailed view

- **Commit SHA:** `ec12523112790b627652ca2d69e1bb26ed81e6b6`

#### Inline Comments

- [ ] **[src/components/star-picker.tsx](src/components/star-picker.tsx) (Lines 36-58)**
  - _Issue:_ Accessible aria-label missing from star-picker buttons.
  - _Action:_ Add an accessible aria-label to each button rendered in the star map, using the current star value and indicating its rating meaning; update the button markup near handleChange so screen readers can identify each option and the selected value remains understandable.
- [ ] **[src/modules/library/server/procedures.ts](src/modules/library/server/procedures.ts) (Lines 16-26)**
  - _Issue:_ Orders query pagination option overrides limit: 1.
  - _Action:_ Remove the pagination: false option from the orders query in the procedure’s find call so the existing limit: 1 is enforced while preserving the current product and user filters.
- [ ] **[src/modules/reviews/server/procedures.ts](src/modules/reviews/server/procedures.ts) (Lines 53-94)**
  - _Issue:_ Review creation mutation missing order verification guard.
  - _Action:_ In the review creation mutation, validate that an order exists for ctx.session.user.id and input.productId before querying existing reviews; reject users without a matching purchase with an appropriate TRPCError, then retain the existing duplicate-review check and creation flow.

#### Nitpick Comments

- [ ] **[src/modules/reviews/server/procedures.ts](src/modules/reviews/server/procedures.ts) (Lines 14-35)**
  - _Issue:_ Redundant product lookup before reviews query.
  - _Action:_ Remove the redundant product lookup and its NOT_FOUND handling before the reviews query. Update the reviews query in the relevant procedure to match product directly against input.productId, preserving the existing user filter and review lookup behavior.

---

### 🔗 PR-23: feat(products): summarize product reviews and add share link

- **Commit SHA:** `071d575e00c908811a0cc9b358776b8495dce1db`

#### Inline Comments

- [ ] **[src/modules/products/ui/views/product-view.tsx](<src/modules/products/ui/views/product-view.tsx>) (Lines 132-144)**
  - _Issue:_ Copy URL onClick handler does not await navigator.clipboard.writeText Promise or handle rejection.
  - _Action:_ Update the copy URL onClick handler in the product view to handle the Promise returned by navigator.clipboard.writeText: show the success toast and complete the copied-state reset only after resolution, and add a catch path that handles rejection without showing success. Preserve the existing clipboard text and user-facing copied state behavior for successful writes.
- [ ] **[src/modules/products/ui/views/product-view.tsx](<src/modules/products/ui/views/product-view.tsx>) (Lines 160-161)**
  - _Issue:_ Unformatted review rating rendering.
  - _Action:_ Format data.reviewRating to one decimal place before rendering it in the rating paragraph, while leaving the existing reviewCount display unchanged.

#### Outside Diff Comments

- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Line 1)**
  - _Issue:_ Product and library procedures issue unaggregated review queries or per-item Promise.all calls.
  - _Action:_ Refactor the product and library getMany/getOne procedures to stop querying all reviews with pagination disabled or issuing per-item Promise.all review queries. Read reviewCount, reviewRating, and ratingDistribution from the product’s cached fields, and add or reuse reviews collection afterChange/afterDelete hooks to asynchronously maintain those aggregates on the related product.

---

### 🔗 PR-24: feat(users): add role-based access control and product content field

- **Commit SHA:** `256dd6cdaed1b14feca311190a1af5b80a99f12e`

#### Inline Comments

- [ ] **[src/collections/Users.ts](src/collections/Users.ts) (Lines 28-32)**
  - _Issue:_ Collection-level access logic in update handler.
  - _Action:_ Update the collection-level access logic in the Users collection’s update handler to distinguish document checks from collection checks: when id is undefined, return a query constraint scoped to the authenticated user’s own id, and deny unauthenticated requests instead of comparing undefined values. Preserve the super-admin bypass and existing own-document boolean check when id is present.
- [ ] **[src/modules/library/ui/views/product-view.tsx](src/modules/library/ui/views/product-view.tsx) (Lines 46-48)**
  - _Issue:_ Textarea line breaks rendering.
  - _Action:_ Update the content rendering branch in the product view to preserve textarea line breaks by applying pre-wrap whitespace styling to the rendered element. If Markdown support is intended by the collection configuration, parse and render data.content through the project’s Markdown renderer instead of displaying raw text, while preserving the existing empty-content fallback.

#### Nitpick Comments

- [ ] **[src/collections/Orders.ts](src/collections/Orders.ts) (Lines 7-12)**
  - _Issue:_ Access policies for Orders and Reviews.
  - _Action:_ Verify the access policies for Orders and Reviews before changing them: in src/collections/Orders.ts lines 7-12, ensure users can place and view only their own orders if direct Payload API access is required; apply the corresponding review submission and reading rules in src/collections/Reviews.ts lines 7-12. Preserve super-admin access and keep all operations restricted if end-users are not intended to use these APIs.

---

### 🔗 PR-25: feat(stripe): implement connect onboarding & custom accounts

- **Commit SHA:** `90a94fb5af6256dc451dcd52e642b7e30f130f49`

#### Inline Comments

- [ ] **[src/app/(app)/api/stripe/webhooks/route.ts](<src/app/(app)/api/stripe/webhooks/route.ts>) (Lines 77-78)**
  - _Issue:_ Potential variable scope leaking (preventive).
  - _Action:_ Treat adding braces around the checkout.session.completed case body as an optional preventive refactor rather than a required fix, since lineItems is only used within that case and causes no current functional problem.
- [ ] **[src/app/(app)/api/stripe/webhooks/route.ts](<src/app/(app)/api/stripe/webhooks/route.ts>) (Lines 96-106)**
  - _Issue:_ Stale webhook event status overwrite.
  - _Action:_ Update the tenant status handling in the account.updated webhook around payload.update so stale Stripe events cannot overwrite a newer stripeDetailsSubmitted value. Compare the incoming event against the latest Stripe account state or persist and validate an event timestamp/version, and only apply the update when the event is current.
- [ ] **[src/app/(app)/api/stripe/webhooks/route.ts](<src/app/(app)/api/stripe/webhooks/route.ts>) (Lines 80-90)**
  - _Issue:_ Non-idempotent webhook order fulfillment.
  - _Action:_ Update the webhook handler’s order-creation loop to enforce idempotency atomically: persist the Stripe event or checkout-session line-item key on each order under a database-level unique constraint, retain the pre-check, and handle duplicate-key conflicts from payload.create by skipping the duplicate while allowing other unprocessed line items to be created.
- [ ] **[src/components/stripe-verify.tsx](src/components/stripe-verify.tsx) (Lines 5-8)**
  - _Issue:_ Multiple nested interactive controls.
  - _Action:_ Update the Stripe verification control in the component rendering the “Verify account” action to use a single interactive element: configure the `@payloadcms/ui` Button with the /stripe-verify destination and link styling, and remove the wrapping Link while preserving the existing label and navigation.
- [ ] **[src/modules/auth/server/procedures.ts](src/modules/auth/server/procedures.ts) (Lines 41-55)**
  - _Issue:_ Unvalidated registration inputs and orphan Stripe account on persistence failure.
  - _Action:_ Update the registration procedure around registerSchema, stripe.accounts.create(), and ctx.db.create to preserve validated input handling, pass a stable registration-derived idempotency key to Stripe, and wrap all tenant/user persistence after account creation in error handling. If any persistence operation fails, delete the newly provisioned Stripe account, then rethrow the original failure.
- [ ] **[src/modules/checkout/server/procedures.ts](src/modules/checkout/server/procedures.ts) (Lines 31-35)**
  - _Issue:_ Missing early validation of tenantId.
  - _Action:_ Validate tenantId immediately after deriving it in the checkout procedure, before calling ctx.db.findByID; when it is absent, throw the intended NOT_FOUND error. Preserve the existing tenant lookup for users with a valid tenant membership.

#### Outside Diff Comments

- [ ] **[src/seed.ts](src/seed.ts) (Lines 155-173)**
  - _Issue:_ Stripe account creation on seeding reruns.
  - _Action:_ Update the admin tenant seeding flow in src/seed.ts so Stripe account creation occurs only when creating a new tenant, preventing unused accounts on reruns. In the existing-tenant branch, set stripeAccountId to the migrated account value before continuing, while preserving the current creation behavior for tenants that do not yet exist.

---

### 🔗 PR-26: feat(products): add archiving, privacy filtering & rich text support

- **Commit SHA:** `76d0e318f4fc17d8bb697de5f25c5adec8b5b45d`

#### Inline Comments

- [ ] **[src/collections/Products.ts](src/collections/Products.ts) (Line 30)**
  - _Issue:_ Lexical migration for description and content fields.
  - _Action:_ Before switching the description/content fields to Lexical in the Products collection, add a migration that converts previously persisted string values into valid Lexical document objects with the expected root structure. Apply the migration to both richText field definitions identified near the shown type and the corresponding field around the other referenced location, while preserving already-migrated document values.
- [ ] **[src/modules/products/server/procedures.ts](src/modules/products/server/procedures.ts) (Lines 33-38)**
  - _Issue:_ Scope and privacy validation in getOne.
  - _Action:_ Update the getOne procedure to accept tenantSlug and validate it against the fetched product’s tenant before returning it. Preserve archived-product rejection, and reject private products unless the supplied tenant scope is permitted and matches the product tenant, aligning visibility with getMany.

---

### 🔗 PR-27: feat(tenant): add multi-tenant subdomain routing and auth cookie settings

- **Commit SHA:** `3af98f5d079aa3b1c3b05ee45bd7b3af9cc2f69a`

#### Inline Comments

- [ ] **[proxy.ts](proxy.ts) (Lines 23-27)**
  - _Issue:_ Hostname rewrite does not preserve query parameters.
  - _Action:_ Update the hostname rewrite branch to preserve query parameters from req.url: clone the request URL, replace only its pathname with the tenant route containing tenantSlug and url.pathname, and pass the modified URL to NextResponse.rewrite.
- [ ] **[proxy.ts](proxy.ts) (Lines 19-24)**
  - _Issue:_ Port not removed from Host header.
  - _Action:_ Update the hostname handling in the tenant-matching logic to remove the port from the Host header before comparing it with rootDomain or deriving tenantSlug. Preserve the existing root-domain suffix check and tenant extraction behavior once the normalized hostname is used.
- [ ] **[review-comment-log.md](review-comment-log.md) (Lines 567-569)**
  - _Issue:_ Missing compensating cleanup on registration post-provisioning failure.
  - _Action:_ Update the registration procedure around stripe.accounts.create() and subsequent ctx.db.create persistence so all post-provisioning failures enter compensating cleanup. Delete the newly created Stripe account before rethrowing the original persistence error; if deletion fails, queue reconciliation for the orphaned account while preserving the original failure as the thrown error.
- [ ] **[review-comment-log.md](review-comment-log.md) (Lines 561-563)**
  - _Issue:_ Non-idempotent stripe checkout webhook order creation.
  - _Action:_ Update the webhook handler’s order-creation loop in the Stripe route to persist a per-line-item idempotency key, such as the checkout session ID combined with item.id, instead of using stripeCheckoutSessionId alone; enforce that key with a database-level unique constraint. Retain the existing pre-check, and catch duplicate-key errors from payload.create so the duplicate line item is skipped while other unprocessed items continue.
- [ ] **[src/lib/utils.ts](src/lib/utils.ts) (Lines 9-18)**
  - _Issue:_ Missing configuration validation for environment variables.
  - _Action:_ Validate NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_ROOT_DOMAIN at configuration load time before generateTenantURL constructs links, failing fast when either is missing instead of relying on non-null assertions. In src/lib/utils.ts lines 9-18, use the validated configuration values for development and production URLs; in src/modules/tenants/ui/components/footer.tsx line 16, consume the validated root application URL rather than asserting an optional environment variable.
- [ ] **[src/modules/auth/utils.ts](src/modules/auth/utils.ts) (Lines 16-18)**
  - _Issue:_ Incorrect auth cookie configuration for development and production environments.
  - _Action:_ Update the auth cookie options near the sameSite, domain, and secure settings: use cross-subdomain SameSite=None and NEXT_PUBLIC_ROOT_DOMAIN only in production, require the domain value whenever it is set, and fall back locally to host-only SameSite=Lax with no domain while preserving secure=false outside production.
