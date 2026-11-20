---
name: ui-design-system
description: Design system rules, DaisyUI v5 semantic tokens, typography hierarchy, and component standards for the University Library web application.
---

# University Library Design System (DaisyUI v5 + Tailwind v4)

## 1. Semantic Color Usage (Strict Mapping)

Never use raw Tailwind colors (`gray-*`, `red-*`, `amber-*`). Map every visual element to its semantic role:

- **Surfaces:**
  - `bg-base-200`: Main page canvas (`#F4F4F4` light / `#0B0D12` dark).
  - `bg-base-100`: Elevated cards, modals, search bars, inputs (`#FFFFFF` light / `#12151C` dark).
  - `bg-base-300`: Subtle hover states, table headers, skeleton loaders, dividers (`#E4E4E7` light / `#1E232F` dark).
  - `text-base-content`: Primary readable text. Use `text-base-content/70` for secondary metadata (authors, publication year).

- **Brand & Actions:**
  - `primary` (`#6F060A` light / `#B8292F` dark): Primary CTAs ("Buscar", "Solicitar Préstamo"), active navigation indicators, checked checkboxes/radios, and the main Navbar and auth side panel surfaces. Pair with `text-primary-content`; use `btn-secondary` for CTAs placed on a `primary` surface.
  - `secondary` (`#C3934F` light / `#D4A359` dark): Institutional accents, special collection badges, top/bottom structural borders (`border-secondary`). **CRITICAL:** Because contrast against white is low, NEVER use `text-secondary` for small body text. Always pair `bg-secondary` with `text-secondary-content` (dark ink).
  - `accent` (`#1E6F50` light / `#2A9D70` dark): Digital access actions ("Leer en línea", "Descargar PDF") and physical availability status ("Disponible en sala"). Pair with `text-accent-content`.
  - `neutral` (`#0A1426` light / `#1E293B` dark): Footer, home hero and high-contrast classification headers. Pair with `text-neutral-content`.

- **Semantic States (System Feedback):**
  - `info`: Library hours, reservation rules, search tips.
  - `success`: Loan confirmed, book returned, renewal successful.
  - `warning`: Due date approaching, pending library fine, high-demand item.
  - `error`: Item unavailable/checked out, overdue fine block, auth error. (Never confuse `error` with `primary`).

## 2. Typography Rules (`next/font/google`)

Configure fonts in `app/layout.tsx` via CSS variables (`--font-serif`, `--font-sans`, `--font-mono`).

- **`font-serif` (`Playfair Display`):**
  - **Allowed ONLY on:** Hero Display (`text-4xl` to `text-5xl`), Page Titles `<h1>` (`text-3xl`/`text-4xl`), Section Headings `<h2>` (`text-2xl`/`text-3xl`), and curated editorial quotes.
  - **Forbidden on:** Book titles inside search results, cards, tables, buttons, form labels, or numbers.
- **`font-sans` (`Inter`):**
  - **Default for everything else:** Body text (`text-base` / `16px`, `leading-relaxed`), card titles (`text-lg font-semibold`), metadata (`text-sm`), navigation, buttons, and inputs.
- **`font-mono` (`JetBrains Mono`):**
  - **Mandatory for:** Library Call Numbers / Signaturas topográficas (e.g., `QA76.73 .P98 2026`), ISBN/ISSN codes, loan folio IDs, and pagination counters (`text-[13px] font-medium`).

## 3. Geometry, Borders & Elevation

Maintain an authoritative, academic aesthetic. Avoid overly rounded "pill" shapes on interactive controls.

- **Radii (handled by DaisyUI theme vars):**
  - Cards & Modals: `rounded-box` (`8px`).
  - Buttons, Inputs, Selects: `rounded-field` (`6px`).
  - Checkboxes, Radios, Tag Badges: `rounded-selector` (`4px`).
  - Status Pills (e.g., "Disponible" dot badge): `rounded-full` is permitted ONLY for small status indicators.
- **Borders & Dark Mode Parity:**
  - Always add `border border-base-300` to `bg-base-100` cards. In `biblioteca-dark`, `--depth: 0` disables drop shadows, so `border-base-300` is essential to separate cards from the `bg-base-200` canvas.
  - Never use `dark:` prefixes in Tailwind classes. Rely 100% on CSS variables switching via `data-theme="biblioteca-light"` and `data-theme="biblioteca-dark"`.

## 4. Layout & Component Blueprints

- **Max Container Width:** `max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8`.
- **Prose / Reading Width:** `max-w-[68ch]` for library regulations, thesis abstracts, and institutional history.
- **Navbar:** `bg-primary text-primary-content border-b-2 border-secondary min-h-[72px]`.
- **Catalog Search Layout:** Two-column grid on desktop (`lg:grid-cols-[280px_1fr] gap-6`). Left sidebar (`280px`) holds faceted filters using DaisyUI `checkbox checkbox-primary checkbox-sm`; collapsible into a DaisyUI `drawer` on mobile.
- **Buttons & Inputs Alignment:** Standard interactive controls must use default `md` sizing (`h-10` / `40px`). Hero OPAC search bar uses `input-lg` + `btn-lg` (`h-12` / `48px`).
