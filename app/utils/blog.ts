export function formatDate(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10)
}

// Terminal working directory for a blog route: the listing itself, or the folder a post lives in
export function blogPromptPath(routePath: string): string {
  const path = routePath.replace(/\/+$/, '')
  const dir = path === '/blog' ? path : path.slice(0, path.lastIndexOf('/'))
  return `C:\\Users\\hawxy${dir.replaceAll('/', '\\')}`
}

export function postSlug(path: string): string {
  return path.split('/').pop() ?? path
}

export function isDraftPost(path: string): boolean {
  return path.startsWith('/blog/drafts/')
}

export function formatTags(tags: string[] = []): string {
  return tags.map(tag => `#${tag}`).join(' ')
}

export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

// Post headings in reading order, with h3s following their h2
export function flattenToc(links: TocLink[]): TocLink[] {
  return links.flatMap(link => [link, ...(link.children ?? [])])
}
