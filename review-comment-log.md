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


