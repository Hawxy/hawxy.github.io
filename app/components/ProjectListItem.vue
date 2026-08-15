<script setup lang="ts">
const props = defineProps<{
  project: Project
}>()

const name = computed(() => projectName(props.project))
const text = computed(() => projectText(props.project))
</script>

<template>
  <li>
    <a
      :href="`https://github.com/${project.repo}`"
      target="_blank"
      rel="noopener"
      class="utility-row group flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3"
    >
      <span class="font-mono text-sm font-medium text-highlighted transition-colors group-hover:text-(--ui-primary)">
        <span
          class="font-normal text-dimmed"
          aria-hidden="true"
        >./</span>{{ name }}
      </span>
      <span class="min-w-40 flex-1 text-sm text-muted">{{ text }}</span>
      <span class="font-mono text-xs text-dimmed">
        <template v-if="project.language">{{ project.language }} · </template>★ {{ project.stars }}
      </span>
    </a>
  </li>
</template>

<style scoped>
.utility-row {
  border-left: 2px solid transparent;
  transition: border-color 0.25s, background-color 0.25s;
}

.utility-row:hover,
.utility-row:focus-visible {
  border-left-color: var(--ui-primary);
  background-color: var(--ui-bg-elevated);
}
</style>
