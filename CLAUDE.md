# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio SPA for Nikhil Rajput (Backend Developer). Built with React 18 via CDN — **no build step, no npm, no bundler**. Babel compiles JSX on-the-fly in the browser. All source lives in the `Portfolio/` subdirectory.

## Running the Project

Open `Portfolio/Portfolio.html` directly in a browser. For local development, run a server from inside `Portfolio/` to avoid CORS issues when fetching `data/resume.json`:

```bash
# from the Portfolio/ directory
python -m http.server 8080
# or
npx serve .
```

There are no tests, no lint commands, and no build commands.

## File Structure & Responsibilities

All files live in `Portfolio/`:

| File | Role |
|------|------|
| `Portfolio.html` | Entry point; loads CDN scripts (React 18, Babel); sets `window.TWEAK_DEFAULTS` |
| `app.jsx` | Root component — fetches `resume.json`, initializes routing + theme, renders active page |
| `components.jsx` | All shared UI components and custom hooks |
| `pages.jsx` | All 8 page components, blog content, content-transformation utilities |
| `tweaks-panel.jsx` | Live theme customization panel and its form primitives |
| `styles.css` | All styling (~1200 lines); CSS custom properties for theming |
| `data/resume.json` | **Single source of truth** for all content (experience, projects, skills, education, contact) |

Scripts load in dependency order: `tweaks-panel.jsx` → `components.jsx` → `pages.jsx` → `app.jsx`.

## Architecture

### Routing
Hash-based routing via the `useHashRoute` hook in `components.jsx`. Routes: `#/`, `#/work`, `#/blog`, `#/blog/{slug}`, `#/project/{slug}`, `#/company/{idx}`, `#/about`, `#/contact`. The `main` element uses `key={r}` to force a full remount on every route change. Nav pill active-state: `company/*` and `project/*` keep the "work" pill highlighted; `blog/*` keeps "blog" highlighted.

### Data Flow
`app.jsx` fetches `data/resume.json` once on mount and passes the `resume` object down as props. No global state library — prop drilling or component-local state only.

### Content Transformation (in `pages.jsx`)
- `projectsFromResume(resume)` — converts raw projects into UI objects with slugs, tags, gradient swatches
- `inferTags(text)` — regex-matches known tech keywords to generate tag arrays
- `slug(title)` — URL-safe slug generator
- `shortDate(str)` — formats date strings for display

### Theming
Four palettes (Sunset, Acid, Mono, Cobalt) update CSS custom properties at runtime. The `useTweaks` hook persists choices to `localStorage`. Core variables: `--bg`, `--ink`, `--ember`, `--pink`, `--violet`, `--grad-sunset`, `--glass-*`, `--serif`, `--sans`, `--mono`.

Default tweak values are set via `window.TWEAK_DEFAULTS` in `Portfolio.html`, wrapped in `/*EDITMODE-BEGIN*/` / `/*EDITMODE-END*/` markers. Available keys: `palette` (string), `cursorBlob` (bool), `grain` (bool), `showGrid` (bool), `blobs` (bool).

### Blog
Blog posts are hard-coded in `pages.jsx`:
- `BLOG_POSTS` — metadata array (title, slug, tag, date, read time, excerpt)
- `BLOG_CONTENT` — object keyed by slug with structured section arrays

### Keyboard Shortcuts
`useShortcuts()` in `components.jsx` handles two-key combos: `G+H` (Home), `G+W` (Work), `G+B` (Blog), `G+A` (About), `G+C` (Contact).

## Design System

**Aesthetic:** Liquid glass brutalism — backdrop-filter blur, semi-transparent cards, subtle gradients.

**Typography:**
- `--serif`: Instrument Serif (headings)
- `--sans`: Inter Tight (body/UI)
- `--mono`: JetBrains Mono (labels/code)

**Layout:** CSS Grid with 12 columns, 28px gaps; responsive breakpoints in `styles.css`.

**Animations:** RAF-driven cursor blob (`CursorBlob`), CSS marquee loops, page fade transitions, per-character wave hover (`FlexText`), number scramble effect (`ScrambleText`).

## Editing Content

All content changes (bio, experience, projects, skills, contact links) belong in `data/resume.json`. Page components read from this file — do not hard-code content into JSX except for blog posts (which live in `pages.jsx`).
