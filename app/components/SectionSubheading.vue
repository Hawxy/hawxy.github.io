<script setup lang="ts">
const props = defineProps<{
  label: string
  parent: string
  headingId?: string
}>()

const slug = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'))

const activeSection = useActiveSection()
const isActive = computed(() => activeSection.value === slug.value)
</script>

<template>
  <div class="mt-10 mb-6 flex items-baseline gap-4">
    <h3
      :id="headingId"
      :aria-label="label"
      class="shrink-0 font-mono text-xs transition-opacity duration-500"
      :style="{ opacity: isActive ? 0.25 : 1 }"
    >
      <span aria-hidden="true">
        <span class="text-dimmed">.\{{ parent }}\</span><span class="font-semibold text-(--ui-secondary)">{{ slug }}\</span>
      </span>
    </h3>
    <div
      class="h-px flex-1 bg-(--ui-border)"
      aria-hidden="true"
    />
  </div>
</template>
