# hawxy.github.io

Personal portfolio, built with [Nuxt](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com) and deployed to GitHub Pages.

## Writing blog posts

Posts are markdown files in `content/blog/`, rendered with [Nuxt Content](https://content.nuxt.com). The file name becomes the URL, so `content/blog/my-post.md` is served at `/blog/my-post`.

```md
---
title: My post
description: One-line summary, shown in the listing and RSS feed.
date: 2026-09-28
tags: [dotnet, marten]
---

Body text. Use `##` and `###` for headings; the title comes from frontmatter.
```

Reading time is calculated automatically. Code blocks accept a filename (` ```csharp [Program.cs] `), and callouts use `::note`, `::tip`, `::warning` or `::caution`.

### Drafts

Put unfinished posts in `content/blog/drafts/`. They show up with a `DRAFT` stamp under `pnpm dev` but are excluded from production builds entirely, including the content database shipped to the browser. Publish by moving the file up into `content/blog/`.

`content/blog/drafts/formatting-reference.md` shows every supported element and can be copied as a starting template.

Running `pnpm generate` while `pnpm dev` is running rebuilds the shared local content cache without drafts. Save any draft (or restart dev) to bring them back.
