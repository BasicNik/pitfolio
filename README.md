# Portfolio
A modern, single-page developer portfolio built with **React 18 via CDN** and styled with a custom liquid-glass brutalist aesthetic. This project is intentionally lightweight: there is **no bundler, no npm dependency tree, and no build step** required to run the site.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [Routing](#routing)
  - [Data Flow](#data-flow)
  - [Theming and Visual Tweaks](#theming-and-visual-tweaks)
  - [Content Modeling](#content-modeling)
- [Getting Started](#getting-started)
  - [Option 1: Open Directly](#option-1-open-directly)
  - [Option 2: Run a Local Server-recommended](#option-2-run-a-local-server-recommended)
- [Development Workflow](#development-workflow)
- [Content Updates](#content-updates)
- [Deployment](#deployment)
  - [Vercel (Free Hobby Plan)](#vercel-free-hobby-plan)
  - [Any Static Host](#any-static-host)
- [Customization Guide](#customization-guide)
- [Accessibility and UX Notes](#accessibility-and-ux-notes)
- [Performance Notes](#performance-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)

---

## Overview

Pitfolio is a personal portfolio SPA designed to present backend engineering work, technical writing, and professional experience in a highly visual and interactive format.

The app is loaded from a single HTML entry point (`Portfolio/Portfolio.html`) and composes UI from modular JSX files (`app.jsx`, `components.jsx`, `pages.jsx`, `tweaks-panel.jsx`) that are compiled in the browser through Babel Standalone.

This architecture makes the project:

- easy to clone and run,
- simple to deploy to static hosting,
- approachable for rapid iteration without toolchain setup.

---

## Key Features

- **Single Page Application** using hash-based routes.
- **Project and company detail pages** with dynamic slug-based navigation.
- **Blog section** with curated post metadata and full content blocks.
- **Theme customization panel** with persistent settings via `localStorage`.
- **Keyboard shortcuts** for fast route switching (`G` + shortcut key).
- **Animated visual layer** (cursor blob, gradients, glass cards, motion effects).
- **Data-driven content model** centered around a single `resume.json` source.

---

## Tech Stack

- **React 18** (CDN)
- **ReactDOM 18** (CDN)
- **Babel Standalone** for in-browser JSX compilation
- **Vanilla CSS** with custom properties and grid-based layout
- **Static JSON** for resume/content data
- **No package manager or build tooling required**

---

## Project Structure

```text
pitfolio/
├─ README.md
├─ LICENSE
└─ Portfolio/
   ├─ Portfolio.html        # App entrypoint (script imports + tweak defaults)
   ├─ app.jsx               # Root app component and bootstrapping
   ├─ components.jsx        # Shared components and custom hooks
   ├─ pages.jsx             # Route-level pages + blog and transformation helpers
   ├─ tweaks-panel.jsx      # Theme/tweak controls and persistence
   ├─ styles.css            # Global styles, tokens, responsive rules
   ├─ vercel.json           # Static-host routing config for Vercel
   ├─ assets/
   │  ├─ Nr_Logo_png.png
   │  └─ about_hero_img.png
   └─ data/
      └─ resume.json        # Primary profile/work/content dataset
```

---

## How It Works

### Routing

The app uses **hash-based routing** (`#/work`, `#/blog`, `#/project/{slug}`, etc.), enabling static hosting without server-side route handling for most paths.

Main route categories include:

- `#/` (home)
- `#/work`
- `#/blog`
- `#/blog/{slug}`
- `#/project/{slug}`
- `#/company/{index}`
- `#/about`
- `#/contact`

### Data Flow

At startup, `app.jsx` fetches `data/resume.json` and stores it in component state. Route pages consume this object to render:

- profile basics,
- experience timeline,
- project cards/details,
- education,
- skills,
- contact links.

### Theming and Visual Tweaks

`window.TWEAK_DEFAULTS` (defined in `Portfolio.html`) seeds initial display preferences such as:

- color palette,
- cursor blob visibility,
- decorative grain,
- grid overlays,
- background blobs.

`useTweaks` then persists user selections to `localStorage`, so preferences survive reloads.

### Content Modeling

Core content sources are split deliberately:

- `data/resume.json` → professional profile data
- `pages.jsx` → route components + blog post metadata/content

Helper utilities transform raw content to presentation-ready structures (e.g., slug generation, tag inference, date formatting).

---

## Getting Started

### Option 1: Open Directly

1. Clone or download the repository.
2. Open `Portfolio/Portfolio.html` in your browser.

> This works for visual checks, but data fetch behavior may vary due to browser CORS/file restrictions.

### Option 2: Run a Local Server (recommended)

From inside the `Portfolio/` directory:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/Portfolio.html
```

Alternative:

```bash
npx serve .
```

---

## Development Workflow

Because there is no build step:

1. Edit JSX/CSS/JSON files.
2. Refresh the browser.
3. Verify route behavior and responsive layout.

Recommended workflow:

- Keep browser devtools open for runtime warnings.
- Validate route transitions (`#/`, `#/work`, `#/blog`, detail routes).
- Confirm theme toggle persistence across reloads.

---

## Content Updates

For most updates, edit only:

- `Portfolio/data/resume.json`

Use this for:

- role/company updates,
- project details,
- skills,
- education,
- social/contact links.

Edit `Portfolio/pages.jsx` when you need to update blog posts, post metadata, or route-level copy not represented in the JSON model.

---

## Deployment

### Vercel (Free Hobby Plan)

This project deploys cleanly on Vercel as a static site.

Recommended settings:

- **Framework Preset:** Other / Static
- **Root Directory:** `Portfolio`
- **Build Command:** _(empty)_
- **Output Directory:** _(empty)_

Because the entry file is `Portfolio.html` rather than `index.html`, keep a rewrite rule (already present in `Portfolio/vercel.json`) so root requests resolve correctly.

### Any Static Host

You can deploy the `Portfolio/` directory on any static platform:

- GitHub Pages
- Netlify
- Cloudflare Pages
- S3 + CloudFront
- Render static hosting

If your host expects `index.html`, either:

- rename `Portfolio.html` to `index.html`, or
- configure a rewrite/redirect rule.

---

## Customization Guide

To adapt this portfolio for a different person/brand:

1. Replace content in `data/resume.json`.
2. Swap assets in `Portfolio/assets/`.
3. Adjust color tokens and gradients in `styles.css`.
4. Tune defaults in `window.TWEAK_DEFAULTS` inside `Portfolio.html`.
5. Update blog entries in `pages.jsx`.

Branding tips:

- Keep typography tokens centralized (`--serif`, `--sans`, `--mono`).
- Rebalance contrast when changing glass/background colors.
- Test both desktop and mobile breakpoints after visual edits.

---

## Accessibility and UX Notes

Current UX includes high visual styling and motion; when customizing, consider:

- preserving text contrast ratios,
- reducing excessive motion for sensitive users,
- maintaining visible focus states,
- ensuring keyboard navigation remains clear,
- keeping tap targets mobile-friendly.

---

## Performance Notes

Even without a build toolchain, the project remains lightweight due to:

- static assets,
- no runtime API dependencies beyond local JSON,
- minimal external script count,
- simple deploy surface.

Potential optimizations (optional):

- convert images to optimized modern formats,
- lazy-load heavier non-critical sections,
- precompute frequently transformed content.

---

## Troubleshooting

### `resume.json` not loading locally

Run a local HTTP server from `Portfolio/` instead of opening files with `file://` paths.

### Route not resolving on host refresh

Ensure host rewrite settings are configured for your entry point (`Portfolio.html`) or use hash routes consistently.

### Theme settings not persisting

Check browser storage permissions and verify `localStorage` is available (private/incognito modes can vary by browser).

---

## Roadmap Ideas

- Add optional light/dark mode presets.
- Extract blog content to markdown/JSON.
- Add contact form with serverless endpoint.
- Introduce image optimization pipeline (optional future build step).
- Add automated accessibility checks.

---

## License

This repository is licensed under the terms in [`LICENSE`](./LICENSE).
