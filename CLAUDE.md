# Prototypes

## Project Overview

A lightweight Next.js 16 app for creating and previewing interactive prototypes.
Each designer has their own namespace folder under `src/prototypes/`.

## Tech Stack

- Next.js 16.1.6 (App Router, Turbopack)
- TypeScript 5
- Tailwind CSS v4 (CSS-first `@theme` config)
- React 19
- DaisyUI 5 (component classes via `@plugin "daisyui"`)
- Utilities: clsx + tailwind-merge (via `cn()` helper)

## Project Structure

```
src/
  app/
    layout.tsx                  # Root layout with Geist fonts
    page.tsx                    # Homepage - lists all prototypes
    globals.css                 # Tailwind v4 theme tokens
    prototypes/[designer]/[prototype]/page.tsx  # Dynamic prototype routes
  components/
    ui/                         # Shared UI: Button, Card, Input, Badge
    icons/                      # SVG icon components
    layout/                     # ThemeProvider, DarkModeToggle
  lib/
    types.ts                    # PrototypeMeta, Prototype
    utils.ts                    # cn(), formatDate(), displayName()
    discovery.ts                # Filesystem scanner for prototypes
  prototypes/                   # All prototype content lives here
    _template/                  # Template for new prototypes
    <designer-name>/            # Designer namespace
      <prototype-slug>/         # Prototype folder
        meta.json               # Required metadata
        page.tsx                # Main component (default export)
        components/             # Optional local components
```

## Creating a Prototype

Run the scaffolding script:

```bash
npm run new "My Prototype Title"
```

This uses your designer name from `.designer.json` (set during `npm run setup`).

Each prototype needs two files minimum:

### meta.json

```json
{
  "title": "Human Readable Title",
  "description": "Brief description of what this prototype demonstrates.",
  "author": "designer-name",
  "date": "YYYY-MM-DD",
  "tags": ["tag1", "tag2"],
  "status": "in-progress"
}
```

### page.tsx

```tsx
"use client";

import { Button, Card, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function MyPrototype() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-secondary p-8">
      {/* Prototype content */}
    </div>
  );
}
```

## DaisyUI Components

DaisyUI 5 is available globally. Use component classes directly in JSX — no imports needed.

Examples: `btn`, `card`, `input`, `modal`, `drawer`, `tabs`, `navbar`, `alert`, `badge`, `table`, `toggle`, `select`, `textarea`, `collapse`, `stat`, `hero`, `tooltip`, `dropdown`, `swap`.

Use modifier classes for variants (e.g., `btn-primary`, `btn-ghost`, `card-compact`).

## Shared UI Components

Import from `@/components/ui`:

- **Button** — variants: `primary`, `secondary`, `ghost`, `destructive`; sizes: `sm`, `md`, `lg`
- **Card** — container with border, rounded corners, and shadow
- **Input** — styled text input with focus ring
- **Badge** — variants: `default`, `subtle`, `status`

## Tailwind CSS v4 Theme Tokens

Use theme tokens instead of raw colors:

- Backgrounds: `bg-bg`, `bg-bg-secondary`, `bg-bg-tertiary`
- Text: `text-text-primary`, `text-text-secondary`, `text-text-tertiary`
- Borders: `border-border`, `border-border-hover`
- Accent: `text-accent`, `bg-accent`, `bg-accent-hover`, `bg-accent-light`
- Tags: `bg-tag-blue`, `bg-tag-green`, `bg-tag-purple`, `bg-tag-orange`, `bg-tag-pink`
- Shadows: `shadow-card`, `shadow-card-hover`
- Fonts: `font-sans`, `font-mono`

## Rules

1. Always use `"use client"` for prototypes with interactivity
2. Always default export the main prototype component from page.tsx
3. Never install new packages without explicit approval
4. Always run `npm run build` after implementation to verify no errors
5. Use `cn()` from `@/lib/utils` for className merging
6. Keep prototypes self-contained — each should work independently
7. Use semantic HTML and ensure basic accessibility
8. Prototypes should work on both desktop and mobile viewports
