<script setup lang="ts">
const props = defineProps<{
  project: Project
}>()

const name = computed(() => projectName(props.project))
const text = computed(() => projectText(props.project))
const langIcon = computed(() => languageIcon(props.project.language))
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
        {{ name }}
      </span>
      <span class="min-w-40 flex-1 text-sm text-muted">{{ text }}</span>
      <span class="inline-flex items-center gap-3 font-mono text-xs text-dimmed">
        <UIcon
          v-if="langIcon"
          :name="langIcon"
          :title="project.language ?? undefined"
          :aria-label="project.language ?? undefined"
          class="size-3.5"
        />
        <span aria-label="GitHub stars">★ {{ formatCount(project.stars) }}</span>
        <span
          v-if="project.nuget && project.downloads != null"
          class="inline-flex items-center gap-1.5"
          aria-label="NuGet downloads"
        >
          <UIcon
            name="i-simple-icons-nuget"
            class="size-3.5"
          />{{ formatCount(project.downloads) }}
        </span>
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
