# BrewQuest Design System Foundation Specification

The BrewQuest Design System defines visual primitives, color tokens, typography scales, elevation shadows, spacing grids, and component naming conventions.

---

## 🎨 1. Color Tokens & Theme Architecture

BrewQuest utilizes an **HSL-based CSS Custom Property** architecture supporting seamless Light and Dark mode transitions via Tailwind's `class` strategy.

### Primary Coffee Color Palette

- **Espresso (`--coffee-espresso`)**: Deep roasted bean tone (`#251610` / `20 45% 10%`).
- **Roast / Primary (`--coffee-roast`)**: Warm roasted amber brown (`#7E3F1F` / `22 55% 32%`).
- **Caramel / Accent (`--coffee-caramel`)**: Rich golden caramel (`#DC8819` / `35 75% 50%`).
- **Latte / Secondary (`--coffee-latte`)**: Creamy warm beige (`#F3E5D4` / `32 45% 88%`).
- **Cream / Background (`--coffee-cream`)**: Soft off-white canvas (`#FDFBF7` / `30 25% 98%`).

### Semantic Color Variables

| Token Name             | Light Mode (HSL)         | Dark Mode (HSL)          | Purpose                                  |
| :--------------------- | :----------------------- | :----------------------- | :--------------------------------------- |
| `--background`         | `30 25% 98%` (`#FDFBF7`) | `20 35% 7%` (`#19100C`)  | Main body background canvas              |
| `--foreground`         | `20 30% 12%` (`#261B16`) | `30 25% 95%` (`#FAF6F0`) | Primary body text color                  |
| `--card`               | `30 20% 96%` (`#FAF6F0`) | `20 30% 11%` (`#231813`) | Card component backgrounds               |
| `--card-foreground`    | `20 30% 12%`             | `30 25% 95%`             | Text inside card components              |
| `--primary`            | `22 55% 32%` (`#7E3F1F`) | `32 65% 55%` (`#D98836`) | Primary interactive buttons & highlights |
| `--primary-foreground` | `30 40% 98%`             | `20 45% 10%`             | Contrast text on primary buttons         |
| `--secondary`          | `32 45% 88%`             | `20 25% 18%`             | Secondary buttons & subtle containers    |
| `--accent`             | `35 75% 50%` (`#DC8819`) | `35 80% 55%` (`#E5952B`) | Highlights, AI tags, callouts            |
| `--muted`              | `30 20% 92%`             | `20 20% 16%`             | Muted backgrounds & dividers             |
| `--border`             | `30 18% 86%`             | `20 25% 20%`             | Component border lines                   |
| `--ring`               | `22 55% 32%`             | `32 65% 55%`             | Accessibility focus outlines             |

---

## 🔤 2. Typography Scale

BrewQuest pairs a modern sans-serif body font with a geometric display font for headings:

- **Body Font (`font-sans`)**: `Plus Jakarta Sans`, system-ui, sans-serif.
- **Display Font (`font-display`)**: `Outfit`, sans-serif.

### Type Scale Hierarchy

| Utility Class | Size (rem / px)   | Line Height | Recommended Usage                      |
| :------------ | :---------------- | :---------- | :------------------------------------- |
| `text-xs`     | `0.75rem` (12px)  | `1.00rem`   | Captions, badge labels, metadata       |
| `text-sm`     | `0.875rem` (14px) | `1.25rem`   | Helper text, secondary buttons, inputs |
| `text-base`   | `1.00rem` (16px)  | `1.50rem`   | Body text, default paragraph copy      |
| `text-lg`     | `1.125rem` (18px) | `1.75rem`   | Lead paragraphs, card titles           |
| `text-xl`     | `1.25rem` (20px)  | `1.75rem`   | Section headers, subheadings           |
| `text-2xl`    | `1.50rem` (24px)  | `2.00rem`   | H3 headings, modal headers             |
| `text-3xl`    | `1.875rem` (30px) | `2.25rem`   | H2 section titles                      |
| `text-4xl`    | `2.25rem` (36px)  | `2.50rem`   | H1 page titles                         |
| `text-5xl`    | `3.00rem` (48px)  | `1.00`      | Hero headlines                         |
| `text-6xl`    | `3.75rem` (60px)  | `1.00`      | Display banners                        |

---

## 📐 3. Border Radius System

- **`rounded-sm`**: `calc(var(--radius) - 4px)` (8px) — Badges, tooltips, tags.
- **`rounded-md`**: `calc(var(--radius) - 2px)` (10px) — Buttons, form inputs, dropdown menus.
- **`rounded-lg`**: `var(--radius)` (12px default) — Cards, modals, dialog containers.
- **`rounded-full`**: `9999px` — Avatars, pill badges.

---

## ☀️ 4. Dark Mode Architecture

Dark mode is controlled via Tailwind's `class` strategy. Toggling `.dark` on the `<html>` element dynamically adjusts all CSS variables in `globals.css`:

```html
<html class="dark">
  ...
</html>
```

### Key Theme Adaptations

- Background transitions from warm cream (`#FDFBF7`) to deep roasted espresso (`#19100C`).
- Cards transition to rich dark chocolate tone (`#231813`) with subtle border opacity.
- Accent colors shift to warm radiant amber for high contrast against dark backgrounds.

---

## 🌑 5. Shadows & Elevation System

- **`shadow-sm`**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` — Subtle element separation.
- **`shadow-coffee`**: `0 10px 30px -10px rgba(126, 63, 31, 0.15)` — Elevated coffee cards & floating panels.
- **`shadow-glow`**: `0 0 25px 2px rgba(220, 136, 25, 0.25)` — AI recommendation highlight glow.

---

## 📐 6. Spacing System & Responsive Breakpoints

BrewQuest uses a 4px baseline grid system extended with custom container paddings:

### Extended Spacing Utilities

- `18` (`4.5rem` / 72px)
- `22` (`5.5rem` / 88px)
- `28` (`7.0rem` / 112px)
- `36` (`9.0rem` / 144px)

### Responsive Breakpoints

- **`xs`**: `475px` (Compact mobile landscape)
- **`sm`**: `640px` (Mobile portrait / landscape)
- **`md`**: `768px` (Tablets)
- **`lg`**: `1024px` (Laptops & Desktop screens)
- **`xl`**: `1280px` (Large Desktop displays)
- **`2xl`**: `1536px` (Ultra-wide displays)

---

## 🏷️ 7. Component Naming & Variant Conventions

To keep component implementation predictable across 100+ files, components must adhere to the following standards:

### File & Naming Rules

1. **Component Files**: Use `kebab-case.tsx` for file names (e.g. `coffee-card.tsx`, `loading-spinner.tsx`).
2. **Component Identifiers**: Use `PascalCase` for React component exports (e.g. `CoffeeCard`, `LoadingSpinner`).
3. **Props Interface**: Name prop interfaces `<ComponentName>Props` (e.g. `CoffeeCardProps`).

### Class Variance Authority (CVA) Pattern

When components support variants, use standard variant prop names:

```tsx
export interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
```

### Component Slot Conventions

- **`Root`**: Outermost container.
- **`Header`**: Top section.
- **`Content` / `Body`**: Main section.
- **`Footer`**: Bottom action area.
