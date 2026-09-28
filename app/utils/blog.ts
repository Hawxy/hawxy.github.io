export function formatDate(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10)
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
