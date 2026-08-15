<script setup lang="ts">
const props = defineProps<{
  label: string
  headingId?: string
}>()

const slug = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'))

const activeSection = useActiveSection()
const isActive = computed(() => activeSection.value === slug.value)
</script>

<template>
  <div class="mb-6 flex items-baseline gap-4">
    <h2
      :id="headingId"
      :aria-label="label"
      class="shrink-0 font-mono text-sm transition-opacity duration-500"
      :style="{ opacity: isActive ? 0.25 : 1 }"
    >
      <span aria-hidden="true">
        <span class="text-dimmed">PS&gt; ls</span>
        <span class="ml-2 font-semibold text-(--ui-primary)">.\{{ slug }}\</span>
      </span>
    </h2>
    <div
      class="h-px flex-1 bg-(--ui-border)"
      aria-hidden="true"
    />
  </div>
</template>
