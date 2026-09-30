---
title: Formatting reference
description: Every markdown element the blog supports, rendered in the site theme.
date: 2026-09-28
tags: [meta]
---

This draft only exists in `pnpm dev`. It shows how each element renders, so it doubles as a template for new posts. Body copy is set in the system sans for readability, while headings, code and metadata use **Berkeley Mono**. Links look [like this](https://nuxt.com), and *emphasis* works as expected.

## Headings

Use `##` and `###` inside a post. The post title comes from frontmatter, so don't add a `#` heading to the body.

### A third-level heading

Paragraph under a third-level heading, to check vertical rhythm.

## Lists

- Unordered item
- Another item with `inline code`
  - A nested item

1. Ordered item
2. Second item
3. Third item

## Code

```csharp [Program.cs]
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMarten(options =>
{
    options.Connection(builder.Configuration.GetConnectionString("Marten")!);
});

var app = builder.Build();
app.MapGet("/", () => "Hello, world");
app.Run();
```

```ts
// Abbreviates large counts, e.g. 18693117 becomes 18.7M
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  return String(count)
}
```

```powershell
Get-ChildItem .\content\blog\ -Filter *.md | Select-Object Name, LastWriteTime
```

## Quotes and callouts

> A blockquote, for citing someone else's words.

::note
A callout, written with the `::note` block syntax. [Links](https://nuxt.com) take the callout's colour.
::

::tip
A `::tip` callout.
::

::warning
A `::warning` callout.
::

::caution
A `::caution` callout.
::

## Pros and cons

```md
::pros-cons
#pros
- Something good
#cons
- Something bad
::
```

::pros-cons
#pros
- A strength, with `inline code`
- Another strength
#cons
- A trade-off worth knowing about
::

## Tables

| Package | Language | Purpose |
| --- | --- | --- |
| Wallaby | C# | Postgres CDC engine |
| cdk-twingate | TypeScript | CDK constructs for Twingate |

---

Text after a horizontal rule.
