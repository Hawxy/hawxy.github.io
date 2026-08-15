<script setup lang="ts">
defineProps<{
  label: string
  headingId?: string
}>()
</script>

<template>
  <div class="mb-6 flex items-center gap-4">
    <h2
      :id="headingId"
      class="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-(--ui-primary)"
    >
      {{ label }}
    </h2>
    <div
      class="h-px flex-1 bg-(--ui-border)"
      aria-hidden="true"
    />
  </div>
</template>
