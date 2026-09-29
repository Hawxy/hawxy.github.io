interface ScrollSpyOptions {
  // Ref to write the active id into, the title bar's section by default
  active?: Ref<string | null>
  // Extra distance below the sticky header that still counts as scrolled under it
  offset?: number
  // Activate the last id at the bottom of the page, for headings that can't reach the top
  lastAtBottom?: boolean
}

// Tracks which of the given headings last scrolled under the sticky header
export function useScrollSpy(ids: string[], options: ScrollSpyOptions = {}) {
  const activeSection = options.active ?? useActiveSection()
  const offset = options.offset ?? 0

  function update() {
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 56
    let active: string | null = null
    for (const id of ids) {
      const heading = document.getElementById(id)
      if (heading && heading.getBoundingClientRect().top <= headerHeight + offset) {
        active = id
      }
    }
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    if (options.lastAtBottom && atBottom && active) {
      active = ids.at(-1) ?? active
    }
    activeSection.value = active
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    activeSection.value = null
  })
}
