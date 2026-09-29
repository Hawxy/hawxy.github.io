// Tracks which of the given headings last scrolled under the sticky header
export function useScrollSpy(ids: string[]) {
  const activeSection = useActiveSection()

  function update() {
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 56
    let active: string | null = null
    for (const id of ids) {
      const heading = document.getElementById(id)
      if (heading && heading.getBoundingClientRect().top <= headerHeight) {
        active = id
      }
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
