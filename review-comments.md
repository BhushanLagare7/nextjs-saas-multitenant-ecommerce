# Code Review Comments

- **Commit SHA:** `0f6e6b0b32de65c6a8007f7167d9a0c2476ff53e`

---

## Inline Comments

### 📂 [button.tsx](src/components/ui/button.tsx)
* **Location:** Around lines 23-24
* **Issue:** The hardcoded white backgrounds lack dark-mode text contrast.
* **Recommendation:** 
  * In `src/components/ui/button.tsx` lines 23-24, update the elevated variant classes to include an explicit dark text utility such as `text-black`.
  * In `src/components/ui/input.tsx` lines 11-12, add `text-black` to the modified classes or replace the fixed background with theme-aware utilities such as `dark:bg-input/30` or `bg-background`.

---

### 📂 [input.tsx](src/components/ui/input.tsx)
* **Location:** Around lines 8-13
* **Issue:** Overriding defaults.
* **Recommendation:**
  * Move the `className` argument to the end of the `cn()` call in `src/components/ui/input.tsx` lines 8-13 and `src/components/ui/textarea.tsx` lines 8-13 (after the component-specific utility classes) so consumer-provided classes override defaults.

