# TutorialsHub Design System & Frontend Specifications

This document outlines the complete design system, theme tokens, typography, color palette, animations, and custom styling rules used across the TutorialsHub frontend. You can use this exact specification to apply the design system to other projects (built with Tailwind CSS v4 / Next.js).

---

## 1. Tech Stack & Styling Architecture

- **Framework:** Next.js 15 (App Router)
- **Styling Engine:** Tailwind CSS v4 (`@import "tailwindcss";`)
- **Theme Configuration:** Native CSS `@theme` block in `globals.css`
- **Design Philosophy:** Modern Developer Platform aesthetic blending Material Design 3 surface tokens with glassmorphic depth, smooth transitions, and high-contrast typography.

---

## 2. Typography

Google Fonts integrated via `next/font/google`:
- **Display / Headings:** Geist Sans (`--font-geist-sans`)
- **Body & Content:** Inter (`--font-inter`)
- **Code & Monospace:** JetBrains Mono (`--font-jetbrains-mono`) & Geist Mono (`--font-geist-mono`)

### Font Family Tokens
- `--font-display-lg`: `var(--font-geist-sans)`
- `--font-headline-lg`: `var(--font-geist-sans)`
- `--font-headline-md`: `var(--font-geist-sans)`
- `--font-label-md`: `var(--font-geist-sans)`
- `--font-body-md`: `var(--font-inter)`
- `--font-body-lg`: `var(--font-inter)`
- `--font-code-sm`: `var(--font-jetbrains-mono)`

### Font Size Scale
- **Display Large (`display-lg`):** `64px`
- **Headline Large (`headline-lg`):** `40px`
- **Headline Medium (`headline-md`):** `24px`
- **Body Large (`body-lg`):** `18px`
- **Body Medium (`body-md`):** `16px`
- **Label Medium (`label-md`):** `14px`
- **Code Small (`code-sm`):** `13px`

---

## 3. Color Palette & Theme Tokens

All colors are defined as CSS custom properties within Tailwind v4's `@theme` block:

### Surfaces & Backgrounds
- `--color-background`: `#f8f9ff`
- `--color-surface`: `#f8f9ff`
- `--color-surface-dim`: `#cbdbf5`
- `--color-surface-bright`: `#f8f9ff`
- `--color-surface-container-lowest`: `#ffffff`
- `--color-surface-container-low`: `#eff4ff`
- `--color-surface-container`: `#e5eeff`
- `--color-surface-container-high`: `#dce9ff`
- `--color-surface-container-highest`: `#d3e4fe`
- `--color-surface-variant`: `#d3e4fe`

### Text & On-Surface
- `--color-on-background`: `#0b1c30`
- `--color-on-surface`: `#0b1c30`
- `--color-on-surface-variant`: `#3c4a42`
- `--color-inverse-surface`: `#213145`
- `--color-inverse-on-surface`: `#eaf1ff`

### Primary Brand Colors (Emerald / Green)
- `--color-surface-tint`: `#006c49`
- `--color-primary`: `#006c49`
- `--color-on-primary`: `#ffffff`
- `--color-primary-container`: `#10b981`
- `--color-on-primary-container`: `#00422b`
- `--color-inverse-primary`: `#4edea3`
- `--color-primary-fixed`: `#6ffbbe`
- `--color-primary-fixed-dim`: `#4edea3`
- `--color-on-primary-fixed`: `#002113`
- `--color-on-primary-fixed-variant`: `#005236`

### Secondary Brand Colors (Blue)
- `--color-secondary`: `#0051d5`
- `--color-on-secondary`: `#ffffff`
- `--color-secondary-container`: `#316bf3`
- `--color-on-secondary-container`: `#fefcff`
- `--color-secondary-fixed`: `#dbe1ff`
- `--color-secondary-fixed-dim`: `#b4c5ff`
- `--color-on-secondary-fixed`: `#00174b`
- `--color-on-secondary-fixed-variant`: `#003ea8`

### Tertiary Brand Colors (Purple)
- `--color-tertiary`: `#732ee4`
- `--color-on-tertiary`: `#ffffff`
- `--color-tertiary-container`: `#b48fff`
- `--color-on-tertiary-container`: `#4900a4`
- `--color-tertiary-fixed`: `#eaddff`
- `--color-tertiary-fixed-dim`: `#d2bbff`
- `--color-on-tertiary-fixed`: `#25005a`
- `--color-on-tertiary-fixed-variant`: `#5a00c6`

### Outlines & Feedback / Errors
- `--color-outline`: `#6c7a71`
- `--color-outline-variant`: `#bbcabf`
- `--color-error`: `#ba1a1a`
- `--color-on-error`: `#ffffff`
- `--color-error-container`: `#ffdad6`
- `--color-on-error-container`: `#93000a`

---

## 4. Spacing & Layout Tokens

- `--spacing-stack-xs`: `4px`
- `--spacing-stack-sm`: `8px`
- `--spacing-stack-md`: `16px`
- `--spacing-stack-lg`: `32px`
- `--spacing-stack-xl`: `64px`
- `--spacing-unit`: `8px`
- `--spacing-gutter`: `24px`
- `--spacing-margin-desktop`: `48px`
- `--spacing-margin-mobile`: `16px`
- `--spacing-container-max`: `1440px`

---

## 5. Border Radii & Shadows

### Border Radius
- `--radius-sm`: `0.25rem` (`4px`)
- `--radius-default`: `0.5rem` (`8px`)
- `--radius-md`: `0.75rem` (`12px`)
- `--radius-lg`: `1rem` (`16px`)
- `--radius-xl`: `1.5rem` (`24px`)
- `--radius-2xl`: `20px`
- `--radius-full`: `9999px`

### Shadows & Depth
- **Custom Shadow (`.custom-shadow`):** 
  `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 24px 48px -12px rgba(0, 108, 73, 0.08);`
- **Glass Panel (`.glass-panel`):**
  - Background: `rgba(255, 255, 255, 0.7)`
  - Backdrop Blur: `blur(20px)`
  - Border: `1px solid rgba(255, 255, 255, 0.5)`
- **Editor Dark Panel (`.editor-dark`):**
  - Background: `#0d1117`
  - Border: `1px solid #30363d`

---

## 6. Custom Utility Classes & Animations

### Gradients & Backgrounds
- **Hero Gradient (`.hero-gradient`):**
  `background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, #f8f9ff 100%);`

### Animations & Keyframes
- **Float (`animate-float`):** 6s ease-in-out infinite vertical float (`translateY(0)` to `translateY(-20px)`).
- **Slow Bounce (`animate-bounce-slow`):** 3s ease-in-out infinite (`translateY(0)` to `translateY(-5px)`).
- **Slow Spin (`animate-spin-slow`):** 8s linear infinite rotation (0deg to 360deg).

### Card Hover Interactions
- **Category Card (`.category-card`):**
  Transition `transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`. On hover: `translateY(-8px) scale(1.02)`.
- **Promo Card (`.promo-card`):**
  Transition all 0.3s cubic-bezier(0.4, 0, 0.2, 1). Inner border inset shadow. On hover: `translateY(-8px)` with deep shadow.

### Scrollbar Utilities
- **No Scrollbar (`.no-scrollbar`):** Hides scrollbars while allowing smooth scrolling (`scrollbar-width: none`).
- **Custom Scrollbar (`.custom-scrollbar`):** 4px width, thumb color `#bbcabf` with hover state `#006c49`.

---

## 7. How to Apply to Another Project

1. Copy the CSS `@theme` block and custom utility classes from `src/app/globals.css` into your target project's global stylesheet.
2. Ensure Tailwind CSS v4 is installed (or map `@theme` variables into `tailwind.config.js` theme extension for Tailwind v3).
3. Import Geist, Inter, and JetBrains Mono fonts in your root layout or HTML headers.
4. Use design tokens such as `bg-background`, `text-on-surface`, `bg-primary`, `text-secondary`, `rounded-lg`, and `glass-panel` across your components.
