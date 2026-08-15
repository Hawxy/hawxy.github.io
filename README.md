# hawxy.github.io

Personal portfolio, built with [Nuxt](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com) and deployed to GitHub Pages.

## Setup

```bash
pnpm install
```

### Berkeley Mono (licensed font)

The site is set in Berkeley Mono, which is licensed and therefore never committed (`public/fonts/` is gitignored). For local development, copy the font in manually:

```bash
cp "path/to/Berkeley Mono Variable.woff2" public/fonts/BerkeleyMonoVariable.woff2
```

Without it the site falls back to the system monospace stack; nothing breaks. In CI the font is checked out from the private `Hawxy/fonts` repo via the `FONT_REPO_TOKEN` secret.

## Development

```bash
pnpm dev
```

## Project data

Card content lives in `app/data/projects.json`: a curated repo list with hand-written overrides (`blurb`, `docsUrl`) plus a committed snapshot of fetched fields (description, stars, language, archived). `pnpm fetch` refreshes the snapshot from the GitHub API; per-repo failures keep the last known values, so the build never breaks on API errors. `pnpm generate` runs the refresh automatically before building.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which generates the static site into `.output/public` and publishes it via GitHub Pages (source: GitHub Actions).
