<script setup lang="ts">
const props = defineProps<{
  links: TocLink[]
}>()

const flatLinks = computed(() => flattenToc(props.links))

const active = ref<string | null>(null)
// Prose headings keep 48px of scroll margin below the header when jumped to
useScrollSpy(flatLinks.value.map(link => link.id), { active, offset: 64, lastAtBottom: true })
</script>

<template>
  <nav
    aria-labelledby="toc-label"
    class="font-mono text-xs"
  >
    <p
      id="toc-label"
      class="mb-3 font-bold tracking-[0.12em] text-dimmed uppercase"
    >
      Contents
    </p>
    <ul class="border-l border-default">
      <li
        v-for="link in flatLinks"
        :key="link.id"
      >
        <a
          :href="`#${link.id}`"
          :aria-current="active === link.id ? 'location' : undefined"
          class="-ml-px block border-l py-1 leading-5 transition-colors"
          :class="[
            link.depth > 2 ? 'pl-6' : 'pl-3',
            active === link.id ? 'border-(--ui-primary) text-(--ui-primary)' : 'border-transparent text-muted hover:text-highlighted'
          ]"
        >{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>
