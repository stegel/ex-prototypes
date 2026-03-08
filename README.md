# Prototypes

A lightweight repo for creating and previewing interactive design prototypes. Built with Next.js 16, Tailwind CSS v4, DaisyUI 5, and TypeScript.

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/stegel/ex-prototypes.git
cd ex-prototypes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run setup

Enter your ServiceNow email to configure your designer identity:

```bash
npm run setup
```

This creates a `.designer.json` file (gitignored) with your email and auto-derived designer folder name (e.g., `aj.siegel@servicenow.com` becomes `aj-siegel`).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse your prototypes.

---

## Creating a Prototype

### 1. Scaffold your prototype

```bash
npm run new "My Prototype Title"
```

This creates files under `src/prototypes/<your-name>/<prototype-slug>/` including a `meta.json`, `page.tsx`, and a local `CLAUDE.md`.

### 2. Build with Claude Code

Launch Claude Code from the **repo root**:

```bash
claude
```

Then describe what you want to build:

```text
Build out the prototype in src/prototypes/aj-siegel/my-prototype based on this description: ...
```

### 3. Customize your prototype's CLAUDE.md

Each prototype gets its own `CLAUDE.md` with sections for overview, UI approach, component decisions, and notes. Fill this in as you iterate — it helps Claude make better decisions when you ask for changes later.

### 4. Preview and verify

Preview your prototype at `http://localhost:3000/prototypes/<your-name>/<prototype-slug>`.

Before pushing, verify it compiles:

```bash
npm run build
```

### 5. Push your changes

```bash
git add .
git commit -m "Add my prototype"
git push
```

Your prototype will appear on the production site shortly after pushing.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with auto-open |
| `npm run build` | Production build |
| `npm run setup` | One-time designer identity setup |
| `npm run new` | Scaffold a new prototype |

## Learn More

- [DaisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
