<script setup lang="ts">
const props = defineProps<{
  links: TocLink[]
}>()

const flatLinks = computed(() => flattenToc(props.links))

const menu = useTemplateRef('menu')
</script>

<template>
  <details
    ref="menu"
    class="group border border-default bg-elevated font-mono text-xs"
  >
    <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-bold tracking-[0.12em] text-dimmed uppercase transition-colors hover:text-highlighted [&::-webkit-details-marker]:hidden">
      Contents
      <UIcon
        name="i-lucide-chevron-down"
        class="size-4 transition-transform group-open:rotate-180"
      />
    </summary>
    <nav aria-label="Contents">
      <ul class="border-t border-default px-4 py-2">
        <li
          v-for="link in flatLinks"
          :key="link.id"
        >
          <a
            :href="`#${link.id}`"
            class="block py-1.5 leading-5 text-muted transition-colors hover:text-(--ui-primary)"
            :class="{ 'pl-4': link.depth > 2 }"
            @click="menu && (menu.open = false)"
          >{{ link.text }}</a>
        </li>
      </ul>
    </nav>
  </details>
</template>
