# Design System Specification: Editorial Minimalism

## 1. Overview & Creative North Star

**Creative North Star: "The Silent Gallery"**

This design system is engineered to move beyond the generic "flat" minimalist template. It takes inspiration from high-end architectural monographs and curated art galleries. The goal is to create a digital environment that feels like a physical space—airy, intentional, and quiet.

We break the "template look" by prioritizing **negative space as a functional element** rather than just a gap between components. By using an ultra-refined palette of pale beige and muted blue, the UI recedes, allowing the portfolio content to command the viewer's full attention. Luxury is communicated through generous margins, sophisticated tonal layering, and the complete absence of harsh structural lines.

---

## 2. Colors

The palette is a sophisticated dialogue between warmth (`surface`) and cool precision (`primary`).

### The Palette (Material Design 3 Logic)

- **Base:** `background: #fbf9f4` (The warmth of premium off-white paper).
- **Primary Accent:** `primary: #456375` (A muted, professional blue for high-impact moments).
- **Tonal Accents:** `primary_container: #bfdef4` (A soft sky-wash for subtle highlighting).
- **Functional Neutrals:** `on_surface: #31332e` (Used for maximum legibility in body text).

### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional dividers are prohibited.

- **Boundary Definition:** Use background shifts. A hero section on `surface` should transition into a case study section using `surface_container_low (#f5f4ed)` to define the break.
- **Surface Hierarchy:** Create depth by nesting. A project card should use `surface_container_lowest (#ffffff)` sitting on a `surface_container (#efeee7)` background. This creates a "soft lift" that feels organic rather than digital.

### Signature Textures & Glass

To provide "visual soul," use a subtle linear gradient for primary CTAs: transitioning from `primary (#456375)` to `primary_dim (#395769)` at a 135-degree angle. For floating navigation or overlays, apply **Glassmorphism**:

- **Fill:** `surface` at 70% opacity.
- **Effect:** `backdrop-blur: 12px`.
- **Edge:** A "Ghost Border" using `outline_variant` at 15% opacity.

---

## 3. Typography

We use **Manrope** to bridge the gap between geometric precision and humanistic warmth.

- **Display (Large/Med):** Used for project titles. Use `display-lg (3.5rem)` with a `letter-spacing: -0.02em` to create a tight, editorial impact.
- **Headlines:** `headline-md (1.75rem)` in `on_surface_variant (#5e6059)`. This slight reduction in contrast from pure black makes the headers feel integrated into the "airy" aesthetic.
- **Body:** `body-lg (1rem)` is the workhorse. Always ensure a line-height of at least 1.6 to maintain the "airy" feel.
- **Labels:** `label-md (0.75rem)` should be used for metadata (e.g., "Year," "Service") in `primary (#456375)` to provide a rhythmic pop of color throughout the text.

---

## 4. Elevation & Depth

In this system, depth is a matter of **Tonal Layering**, not shadows.

- **The Layering Principle:**
  - Level 0: `surface_dim` (The base canvas).
  - Level 1: `surface` (The primary content area).
  - Level 2: `surface_container_lowest` (Cards and interactive elements).
- **Ambient Shadows:** If a floating element (like a modal) requires a shadow, it must be "invisible." Use a blur of `40px`, an offset of `y: 8px`, and a color of `on_surface` at only `4%` opacity. It should feel like a soft glow of light, not a drop shadow.
- **Ghost Borders:** For accessibility on inputs or buttons, use `outline_variant` at `20%` opacity. Never use a 100% opaque border.

---

## 5. Components

### Navigation

- **The Floating Bar:** Use a minimalist centered dock. Background: `surface` with glassmorphism (70% alpha + blur).
- **Interaction:** Active states are indicated by a `primary` dot (2px) below the label, not a background change.

### Buttons

- **Primary:** `surface_tint (#456375)` background with `on_primary (#f4f9ff)` text. Use `roundedness-md (0.375rem)`.
- **Discrete CTA:** Text-only with a 1px underline using `primary_container`. On hover, the underline transitions to `primary` thickness of 2px.

### Cards & Lists

- **The Rule:** No dividers. Use `spacing-12 (4rem)` to separate list items.
- **Project Cards:** Use `surface_container_low` as the card background. Imagery should have a `0.25rem` (default) corner radius to keep the look modern but not "bubbly."

### Input Fields

- **Styling:** Only a bottom border using `outline_variant` at 30% opacity. When focused, the border transitions to `primary`. Labels should use `label-sm` and remain visible above the input.

---

## 6. Do's and Don'ts

### Do

- **Do** use asymmetrical layouts. Place text in the 1st column and imagery in the 3rd to create "white space tension."
- **Do** use `primary_fixed_dim` for subtle background washes behind photography.
- **Do** lean into the `spacing-24 (8.5rem)` token for vertical margins between major sections.

### Don't

- **Don't** use pure black `#000000`. It breaks the soft, professional atmosphere. Use `on_surface (#31332e)`.
- **Don't** use standard "Material Design" shadows. They are too aggressive for this aesthetic.
- **Don't** cram content. If a section feels "busy," increase the spacing token by one level.
- **Don't** use icons unless absolutely necessary. Rely on refined typography to guide the user.

---

## 7. Spacing Scale Implementation

- **Section Padding:** `spacing-20` (Desktop) / `spacing-10` (Mobile).
- **Content Gap:** `spacing-4` for related items (Heading to Body).
- **Component Internal Padding:** `spacing-3` top/bottom, `spacing-5` left/right.

This system is about the **luxury of space.** Every element must feel like it has been placed with a pair of tweezers onto a clean linen canvas.
