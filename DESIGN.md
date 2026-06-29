# SymPhony Insight Design System

## 1. Atmosphere & Identity

SymPhony Insight should feel like a quiet teacher's desk after class: calm, specific, and ready for review. The signature is warm evidence: soft paper surfaces, measured color, and clear language that helps teachers decide what to do next without sounding clinical or automated.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `paper.DEFAULT` | `#f7f2e8` | n/a | App background |
| Surface/warm | `paper.warm` | `#fbf7ef` | n/a | Soft panels and review notes |
| Text/primary | `ink.DEFAULT` | `#233238` | n/a | Headings and body |
| Text/muted | `ink.muted` | `#5f6d72` | n/a | Secondary body |
| Text/soft | `ink.soft` | `#7f8b8f` | n/a | Captions and metadata |
| Accent/primary | `tide.DEFAULT` | `#4b8f9f` | n/a | Links, active states, primary emphasis |
| Accent/soft | `tide.50` | `#e7f3f5` | n/a | Active cards and icon wells |
| Status/success | `moss.DEFAULT` | `#6f8f7c` | n/a | Confirmed and safe states |
| Status/warning | `sun.DEFAULT` | `#e7c66b` | n/a | Needs-edit states |
| Status/blocking | `coral.DEFAULT` | `#d97c65` | n/a | Safety blocks and review caution |
| Border/subtle | `white/70` | translucent white | n/a | Glass-card separation |

### Rules
- Use `tide` only for interaction and current-step emphasis.
- Use `coral` for caution, blocked export, and copy-safety states, never as decorative red.
- Keep the warm paper base; do not introduce purple/blue AI gradients.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| H1 | `text-3xl` / `md:text-4xl` | 800 | tight | `tracking-tightish` | Page titles |
| H2/H3 | `text-lg` / `text-xl` | 800 | tight | `tracking-tightish` | Card and section titles |
| Body | `text-base` | 400-500 | relaxed | 0 | Main explanatory copy |
| Body/sm | `text-sm` | 400-600 | `leading-6` | 0 | Cards, report paragraphs |
| Caption | `text-xs` | 600-700 | `leading-5` | normal or uppercase label | Metadata and nav groups |

### Font Stack
- Primary: `Plus Jakarta Sans`, `Inter`, `Noto Sans SC`, `PingFang SC`, `Microsoft YaHei`, system sans.
- Mono: system monospace only when code-like data is unavoidable.

### Rules
- Use sentence-style Chinese and English; avoid title-case overload in body copy.
- Buttons use short verb phrases. Body copy carries context.
- Keep report paragraphs narrow enough to scan in cards.

## 4. Spacing & Layout

### Base Unit
All spacing follows the Tailwind 4px scale already used in the app.

| Token | Value | Usage |
|-------|-------|-------|
| `gap-2` / `p-2` | 8px | Button/icon gaps |
| `gap-3` / `p-3` | 12px | Compact card internals |
| `gap-4` / `p-4` | 16px | Default grouped content |
| `gap-6` / `p-6` | 24px | Major cards |
| `space-y-6` | 24px | Page rhythm |

### Grid
- App content max width comes from `AppShell`.
- Report pages use one-column mobile flow and two-column or four-column grids at larger breakpoints.
- Avoid nested cards inside cards; use panels only where hierarchy needs a frame.

## 5. Components

### Report Review Cards
- **Structure**: Card title, short helper text, action/status row, evidence body.
- **Variants**: teacher review, source summary, professional draft, parent summary.
- **Spacing**: `p-5` or `p-6`, internal `space-y-4`.
- **States**: pending, approved, exported, blocked.
- **Accessibility**: real buttons for actions; disabled buttons only when action is not allowed.
- **Motion**: existing hover/transition classes only.

### Workflow Step Cards
- **Structure**: icon well, title, one-line description.
- **Variants**: active `tide`, done `moss`, idle warm white.
- **Spacing**: `p-4`, `gap-3`.
- **States**: current step uses `aria-current="step"`.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150-200ms | ease-out | Buttons, links, small cards |
| Standard | 200-300ms | ease-in-out | Hover elevation and focus glow |
| Emphasis | 480-900ms | cubic-bezier tokens in CSS | Page/card entrance and ring draw |

### Rules
- Animate only `transform`, `opacity`, `filter`, color, and shadow.
- Respect the existing reduced-motion block in `src/styles.css`.
- Focus states must remain visible on buttons and links.

## 7. Depth & Surface

### Strategy
Mixed warm glass: paper background, translucent white panels, subtle borders, and tinted shadows from `shadow-card` / `shadow-soft`.

### Rules
- Use depth to separate review surfaces, not to decorate every section.
- Keep inner panels quieter than outer cards.
- Avoid adding new raw shadows or raw colors outside Tailwind tokens.
