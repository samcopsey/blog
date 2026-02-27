# blog.samcopsey.co.uk

Personal blog and portfolio for Sam Copsey — Engineering & Innovation Manager writing about AI agents, engineering leadership, and sovereign cloud in the Microsoft ecosystem.

**Live site:** [blog.samcopsey.co.uk](https://blog.samcopsey.co.uk)

[![Deploy to GitHub Pages](https://github.com/samcopsey/blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/samcopsey/blog/actions/workflows/deploy.yml)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [Astro v5](https://astro.build) (static output) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Interactive islands | [React 18](https://react.dev) |
| Content | Markdown + Astro content collections (Zod-validated schemas) |
| Code highlighting | [Shiki](https://shiki.style) — dual themes (GitHub Dark / Light) |
| Analytics | [Umami](https://umami.is) (self-hosted, privacy-first, no cookies) |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

---

## Local Development

**Requirements:** Node 20+, npm

```bash
git clone https://github.com/samcopsey/blog.git
cd blog
npm install
npm run dev
```

Opens at `http://localhost:4321`

```bash
npm run build    # production build → ./dist
npm run preview  # preview the production build locally
npm test         # run unit tests (Vitest)
```

---

## Project Structure

```
blog/
├── .github/workflows/
│   └── deploy.yml          # CI: test → build → deploy to GitHub Pages
├── public/
│   ├── CNAME               # custom domain config
│   └── og-image.svg        # Open Graph image
├── src/
│   ├── components/         # Astro and React components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.tsx # React island — dark/light toggle
│   │   ├── BlogFilter.tsx  # React island — client-side post filtering
│   │   └── ProjectFilter.tsx
│   ├── content/
│   │   ├── blog/           # Markdown blog posts
│   │   ├── projects/       # Markdown project writeups
│   │   ├── schemas.ts      # Zod schemas for content validation
│   │   └── config.ts       # Content collection definitions
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/              # File-based routing
│   │   ├── index.astro
│   │   ├── blog/
│   │   ├── projects/
│   │   └── about.astro
│   └── styles/
│       └── global.css      # CSS custom properties, theme vars, prose styles
├── astro.config.mjs
└── package.json
```

---

## Writing a Post

Add a `.md` file to `src/content/blog/`. All fields are validated at build time.

```yaml
---
title: "Your Post Title"
description: "One sentence summary shown in listings and meta tags."
pubDate: 2026-03-01
pillar: agent-building        # agent-building | engineering-leadership | sovereign-ai | development
format: how-to                # how-to | opinion | architecture | project-writeup
tags:
  - example-tag
draft: true                   # set to false when ready to publish
---
```

Posts with `draft: true` are excluded from the build, RSS feed, and all listings.

### Pillars

| Pillar | What belongs here |
|---|---|
| `agent-building` | Hands-on guides: Copilot Studio, Azure AI, Microsoft Foundry, etc. |
| `engineering-leadership` | Team processes, GenAI tooling for delivery, people development |
| `sovereign-ai` | UK data residency, sovereign cloud architecture, governance |
| `development` | General software development: tooling, frameworks, build systems, DX |

---

## Adding a Project

Add a `.md` file to `src/content/projects/`:

```yaml
---
title: "Project Name"
description: "What it does in one or two sentences."
githubUrl: "https://github.com/samcopsey/project-name"
blogPost: "slug-of-related-blog-post"  # optional
techStack:
  - TypeScript
  - Azure OpenAI
status: active                # active | complete | learning
featured: false
sortOrder: 10                 # lower numbers appear first
---
```

---

## Deployment

Every push to `main` triggers the GitHub Actions workflow:

1. Install dependencies (`npm ci`)
2. Run tests (`npm test`)
3. Build (`npm run build`) → `./dist`
4. Upload and deploy to GitHub Pages

The custom domain is configured via `public/CNAME`. No additional DNS or hosting setup is required once the GitHub Pages environment is configured.

---

## Theming

The site defaults to dark mode. Theme preference is toggled by the `ThemeToggle` React island, which applies a `.light` class to `<html>` and persists the choice to `localStorage`.

Design tokens (colours, spacing, typography) are defined as CSS custom properties in `src/styles/global.css`. No JavaScript config file is needed — Tailwind v4 reads these directly.

---

## Licence

The source code is MIT licensed. Blog post content (all `.md` files under `src/content/`) is copyright Sam Copsey — please don't republish without permission.
