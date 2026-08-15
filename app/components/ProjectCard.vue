<script setup lang="ts">
const props = defineProps<{
  project: Project
}>()

const name = computed(() => projectName(props.project))
const text = computed(() => projectText(props.project))
</script>

<template>
  <article class="project-card relative flex flex-col border border-default bg-elevated p-5">
    <div class="flex items-start justify-between gap-3">
      <h3 class="font-mono text-base font-semibold text-highlighted">
        <a
          :href="`https://github.com/${project.repo}`"
          target="_blank"
          rel="noopener"
          class="card-link"
        >{{ name }}</a>
      </h3>
      <UBadge
        v-if="project.archived"
        color="neutral"
        variant="outline"
        size="sm"
        class="font-mono uppercase tracking-[0.08em]"
      >
        Archived
      </UBadge>
    </div>

    <p class="mt-2 flex-1 text-sm text-toned">
      {{ text }}
    </p>

    <div class="mt-4 flex items-center gap-4 font-mono text-xs text-muted">
      <span v-if="project.language">{{ project.language }}</span>
      <span aria-label="GitHub stars">★ {{ project.stars }}</span>
      <a
        v-if="project.docsUrl"
        :href="project.docsUrl"
        target="_blank"
        rel="noopener"
        class="relative z-10 text-(--ui-secondary) underline underline-offset-2"
      >docs</a>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  border-radius: 2px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.project-card:hover,
.project-card:focus-within {
  border-color: var(--ui-primary);
  box-shadow: var(--glow-primary);
}

/* Whole card is clickable via the stretched title link */
.card-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

/* Targeting brackets on opposing corners */
.project-card::before,
.project-card::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--ui-primary);
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}
.project-card::before {
  top: -4px;
  left: -4px;
  border-right: 0;
  border-bottom: 0;
}
.project-card::after {
  bottom: -4px;
  right: -4px;
  border-left: 0;
  border-top: 0;
}
.project-card:hover::before,
.project-card:hover::after,
.project-card:focus-within::before,
.project-card:focus-within::after {
  opacity: 1;
}
</style>
