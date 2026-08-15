// Slug of the section heading currently scrolled under the sticky header, null at the top of the page
export function useActiveSection() {
  return useState<string | null>('active-section', () => null)
}
