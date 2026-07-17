# Review Comment Log

This log tracks code review comments generated during development and the subsequent actions taken to resolve them.

---

## 📋 Review Log

### 🔗 PR-2: style(theme): switch to DM Sans and customize UI components
- **Commit SHA:** `0f6e6b0b32de65c6a8007f7167d9a0c2476ff53e`

#### Inline Comments
- [ ] **[src/components/ui/button.tsx](src/components/ui/button.tsx) (Lines 23-24)**
  - *Issue:* Hardcoded white backgrounds lack dark-mode text contrast.
  - *Action:* Update elevated variant classes to include an explicit dark text utility such as `text-black`.
- [ ] **[src/components/ui/input.tsx](src/components/ui/input.tsx) (Lines 11-12)**
  - *Issue:* Hardcoded white background / text contrast issues.
  - *Action:* Add `text-black` to modified classes or replace fixed background with theme-aware utilities like `dark:bg-input/30` or `bg-background`.
- [ ] **[src/components/ui/input.tsx](src/components/ui/input.tsx) & [src/components/ui/textarea.tsx](src/components/ui/textarea.tsx) (Lines 8-13)**
  - *Issue:* Overriding defaults.
  - *Action:* Move the `className` argument to the end of the `cn()` call, after component-specific utility classes, so consumer-provided classes override defaults.

---

### 🔗 PR-3: feat(home): add marketing pages, layout, and ui adjustments
- **Commit SHA:** `466478dadfff7c5722856afa57930afeac9b81a0`

#### Inline Comments
- [ ] **[src/app/(home)/navbar.tsx](src/app/(home)/navbar.tsx) (Lines 96-102)**
  - *Issue:* Accessibility.
  - *Action:* Add screen-reader-only text describing the mobile menu action inside the Button rendering the `MenuIcon`, while preserving its existing `onClick` behavior and visual styling.
- [ ] **[src/components/ui/textarea.tsx](src/components/ui/textarea.tsx) (Lines 9-12)**
  - *Issue:* Utility overriding.
  - *Action:* Update the `className` ordering so the component's default `"bg-white md:text-base"` utilities are passed before the consumer `className`, allowing `cn` to preserve consumer overrides for background and responsive text-size classes.

---

### 🔗 PR-4: feat: integrate Payload CMS and group app routes
- **Commit SHA:** `3965975832fb4b5bdc2581e48f4744ec214f17bb`

#### Inline Comments
- [ ] **[next.config.ts](next.config.ts) (Lines 3-10)**
  - *Issue:* Duplicate import/wrapping.
  - *Action:* Remove duplicate `withPayload` import and update the default export so `withPayload` wraps `nextConfig` exactly once; leave the `NextConfig` definition unchanged.
- [ ] **[review-comments.md](review-comments.md) (Lines 30-34)**
  - *Issue:* Wrong file reference.
  - *Action:* Update the navbar reference to use `src/app/(app)/(home)/navbar.tsx` while preserving the existing recommendation content.
- [ ] **[src/app/(app)/(home)/navbar.tsx](src/app/(app)/(home)/navbar.tsx) (Lines 95-103)**
  - *Issue:* Accessibility.
  - *Action:* Update the mobile menu Button wrapping `MenuIcon` to include an accessible label describing that it opens the navigation/sidebar, using an `aria-label` or equivalent visually hidden text while preserving the existing click behavior.

#### Nitpick Comments
- [ ] **[src/app/(app)/(home)/navbar-sidebar.tsx](src/app/(app)/(home)/navbar-sidebar.tsx) (Lines 30-32)**
  - *Issue:* Missing accessibility description.
  - *Action:* Add `SheetDescription` to the `SheetHeader` alongside `SheetTitle`, importing it from the existing sheet UI module and applying the `sr-only` class so the description is present without changing the visual layout.
- [ ] **[src/app/(app)/(home)/navbar.tsx](src/app/(app)/(home)/navbar.tsx) (Lines 26-39)**
  - *Issue:* Missing dynamic accessibility state.
  - *Action:* Update the `Link` element in `NavbarItem` to set `aria-current="page"` when `isActive` is true, leaving it unset for inactive links.
- [ ] **[src/app/(app)/(home)/page.tsx](src/app/(app)/(home)/page.tsx) (Line 13)**
  - *Issue:* HTML element semantics.
  - *Action:* Update the component's JSON output wrapper around `JSON.stringify(data, null, 2)` from a `div` to a `pre` element so indentation and line breaks are preserved in the browser.

