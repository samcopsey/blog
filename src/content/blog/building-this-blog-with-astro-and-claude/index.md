---
title: "Building This Blog with Astro and Claude Code"
description: "How I built blog.samcopsey.co.uk — starting from the official Astro blog tutorial, extending it with React islands, Tailwind CSS v4, and co-developing the whole thing with Claude Code."
pubDate: 2026-02-26
pillar: development
format: project-writeup
tags:
  - astro
  - claude-code
  - tailwind
  - react
  - static-sites
  - build-in-public
githubRepo: "https://github.com/samcopsey/blog"
draft: false
---

## Starting Point: The Astro Tutorial

Before reaching for a starter template, I worked through the [official Astro blog tutorial](https://docs.astro.build/en/tutorial/0-introduction/). It's six units and around thirty lessons, and it earns its reputation as one of the better framework onboarding experiences available right now.

The tutorial walks you from zero — installing Node, initialising a project — through to a fully deployed blog on Netlify (I skipped the Netlify part and just self-hosted). The progression is well-paced: you start with basic pages and Markdown posts, then learn about components, then layouts, then Astro's content API, and finally the islands architecture. Each unit builds on the last without jumping ahead.

A few things genuinely clicked for me during the tutorial that I don't think I would have absorbed from documentation alone:

**The mental model for `.astro` files.** An Astro component is split into a frontmatter fence (server-side JavaScript that runs at build time) and a template body (HTML with a JSX-like syntax). Once that clicked, everything else made sense. It's not magic — it's just a build step.

**Islands as an explicit architectural decision.** Most frameworks make you opt *out* of JavaScript. Astro makes you opt *in*. You add a `client:load` or `client:idle` directive to a component and that component becomes an interactive island; everything else ships as static HTML. This felt like the right default for a content-first site.

**Content collections as typed contracts.** Rather than parsing arbitrary frontmatter and hoping for the best, Astro's content collections let you define a Zod schema and validate every post against it at build time. Invalid frontmatter is a build error, not a runtime surprise. As someone who spends a lot of time thinking about data governance, this resonated immediately.

By the time I finished the tutorial I had a working blog with Markdown posts, a tag index, an RSS feed, and a deployed URL. That's a solid baseline to extend from.

---

## What I Built on Top

The tutorial blog is intentionally minimal. What I shipped for this site involved several extensions:

### Tailwind CSS v4

The tutorial uses plain CSS. I wanted Tailwind, specifically the new v4 release, which replaces the `tailwind.config.js` file entirely with a Vite plugin and a CSS-first configuration approach. No more `content` globs, no more JavaScript config files — you define your design tokens directly in CSS using `@theme`. It's a significant quality-of-life improvement and the build integration is noticeably faster.

### React Islands for Interactivity

I kept the Astro default for all static content but added three React islands:

- **ThemeToggle** — persists dark/light preference to `localStorage`, applies a `.light` class on the `<html>` element
- **BlogFilter** — client-side filtering of posts by pillar and tag, zero server round-trips
- **ProjectFilter** — same pattern for the projects page

The rest of the site ships no JavaScript. Those three components are the entire JavaScript surface.

### Content Collections with Typed Schemas

Both blog posts and project writeups are validated against Zod schemas at build time. The blog schema enforces a `pillar` enum (`agent-building`, `engineering-leadership`, `sovereign-ai`) and a `format` enum (`how-to`, `opinion`, `architecture`, `project-writeup`). This matters: it means I can't accidentally publish a post with a mistyped category, and the filter components can safely enumerate the options without runtime guards.

### CI/CD via GitHub Actions

Every push to `main` triggers a workflow that installs dependencies, runs tests, builds the site, and deploys to GitHub Pages. The whole pipeline takes under two minutes. The custom domain (`blog.samcopsey.co.uk`) is configured via a `CNAME` file in the public directory. No hosting costs, no infrastructure to maintain.

---

## Co-developing with Claude Code

This is the part I want to spend some time on, because it's still relatively new territory and I think the honest reflection is more useful than a polished PR take.

I used [Claude Code](https://www.anthropic.com/claude-code) — Anthropic's CLI tool — throughout the build. Not as an autocomplete that fills in boilerplate, but as something closer to a pairing partner that could hold context across multiple sessions and make decisions with me.

### What worked well

**Scaffolding with intent.** When I described the site architecture — content collections, React islands, Tailwind v4, GitHub Pages deployment — Claude could generate a coherent initial scaffold that respected the constraints. The result wasn't production-ready out of the box, but it was a working starting point with the right structure. That's different from copying a template you don't fully understand.

**Explaining unfamiliar APIs.** The Tailwind v4 documentation is good but the migration from v3 is non-trivial if you've internalised the old config approach. Having Claude explain *why* the new CSS-first config works the way it does, with examples from the actual project files, meant I understood the changes rather than just copying them.

**Consistent code style.** Across multiple sessions, Claude maintained the project's conventions — Tailwind utility classes over custom CSS, Zod schemas for validation, no external dependencies unless genuinely necessary. This sounds like a small thing but it's actually quite significant over a multi-session build. The cognitive overhead of re-establishing context with a new engineer on every session is real; with Claude, that overhead was much lower.

**Debugging build errors.** Astro's error messages are generally good, but TypeScript type errors from content collection schemas can get verbose. Claude was consistently useful for reading the error, identifying which schema field was the problem, and proposing a fix — often in one shot.

### What required more care

**Hallucination on version-specific APIs.** Tailwind CSS v4 and Astro v5 are both recent enough that Claude's training data doesn't have comprehensive coverage. There were a few moments where the suggested syntax was from an older version. The fix here is straightforward: always verify against the current documentation, treat suggestions as starting points not answers, and notice when something doesn't build.

**Over-engineering when under-specified.** If I asked an open-ended question like "how should I structure the filter component?" without constraints, the first answer would often include more abstraction than the problem needed. Being specific — "the component needs to filter by pillar only, client-side, no external state management" — produced much more appropriate responses. This is a prompting discipline issue as much as a model issue.

**The planning conversation.** For architectural decisions, working through a plan before writing code produced better outcomes than jumping straight to implementation. Claude Code has a plan mode for exactly this; using it before complex sessions was consistently worth the extra step.

---

## Would I Use This Approach Again?

Yes, without much hesitation — and I already am, for everything else I'm building at the moment.

The honest summary: Claude Code is most useful not as a code generator but as a thinking partner that can hold context, explain its reasoning, and adapt to your constraints. The quality of the output correlates directly with the quality of the input. Vague questions produce bloated answers; precise questions with clear constraints produce focused, usable responses.

For a project like this — a solo build with a clear scope, a familiar (to me) deployment target, and a desire to understand the framework rather than just ship something — it was a genuinely good fit. I learned Astro properly by doing the tutorial, then extended that understanding with Claude as a collaborator rather than a crutch.

The full source is on GitHub at [samcopsey/blog](https://github.com/samcopsey/blog). Every component, every schema, the deployment workflow, all of it — open and readable. If you're building something similar, you're welcome to use it as a reference.

---

## Stack Summary

| Layer | Technology |
|---|---|
| Framework | Astro v5 (static output) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Interactive islands | React 18 |
| Content | Markdown, Astro content collections, Zod validation |
| Code highlighting | Shiki (dual themes: `github-dark` / `github-light`) |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |
| Domain | blog.samcopsey.co.uk |
