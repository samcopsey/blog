# blog.samcopsey.co.uk

Personal blog and portfolio site. Built with Astro v5, React, and Tailwind CSS. Deployed to GitHub Pages.

## Stack

- **Framework** — [Astro](https://astro.build) v5 (static output)
- **Styling** — Tailwind CSS v4
- **Interactive islands** — React (blog filter, project filter, theme toggle)
- **Content** — Markdown with Astro content collections
- **Deployment** — GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:4321`

## Writing a post

Add a `.md` file to `src/content/blog/` with the required frontmatter:

```yaml
---
title: "Your Post Title"
description: "One sentence summary."
pubDate: 2026-03-01
pillar: agent-building        # agent-building | engineering-leadership | sovereign-ai
format: how-to                # how-to | opinion | architecture | project-writeup
tags:
  - example-tag
draft: false
---
```

Set `draft: true` to keep a post out of the build while you're writing it.

## Adding a project

Add a `.md` file to `src/content/projects/`:

```yaml
---
title: "Project Name"
description: "What it does."
githubUrl: "https://github.com/samcopsey/project"
techStack:
  - TypeScript
  - Azure OpenAI
status: active                # active | complete | learning
featured: false
sortOrder: 10
---
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which builds and deploys to GitHub Pages automatically.
