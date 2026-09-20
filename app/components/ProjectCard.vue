<script setup lang="ts">
const props = defineProps<{
  project: Project
}>()

const name = computed(() => projectName(props.project))
const text = computed(() => projectText(props.project))
const langIcon = computed(() => languageIcon(props.project.language))
const isNew = computed(() => isNewProject(props.project))
const link = computed(() => props.project.docsUrl ?? `https://github.com/${props.project.repo}`)
</script>

<template>
  <article class="project-card relative isolate flex flex-col border border-default bg-elevated p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <img
          v-if="project.logo"
          :src="project.logo"
          alt=""
          class="h-8 w-auto max-w-16 rounded-[2px]"
        >
        <h3 class="font-mono text-base font-semibold text-highlighted">
          <a
            :href="link"
            target="_blank"
            rel="noopener"
            class="card-link"
          >{{ name }}</a>
        </h3>
      </div>
      <span
        v-if="isNew || project.archived"
        class="flex items-center gap-2"
      >
        <NewStamp v-if="isNew" />
        <UBadge
          v-if="project.archived"
          color="neutral"
          variant="outline"
          size="sm"
          class="font-mono uppercase tracking-[0.08em]"
        >
          Archived
        </UBadge>
      </span>
    </div>

    <p class="mt-2 flex-1 text-sm text-toned">
      {{ text }}
    </p>

    <div class="mt-4 flex items-center gap-4 font-mono text-xs text-muted">
      <UIcon
        v-if="langIcon"
        :name="langIcon"
        :title="project.language ?? undefined"
        :aria-label="project.language ?? undefined"
        class="size-3.5"
      />
      <span aria-label="GitHub stars">★ {{ formatCount(project.stars) }}</span>
      <a
        v-if="project.nuget && project.downloads != null"
        :href="`https://www.nuget.org/packages/${project.nuget}`"
        target="_blank"
        rel="noopener"
        class="relative z-10 inline-flex items-center gap-1.5 transition-colors hover:text-(--ui-primary)"
        :aria-label="`${project.nuget} on NuGet`"
      >
        <UIcon
          name="i-simple-icons-nuget"
          class="size-3.5"
        />{{ formatCount(project.downloads) }}
      </a>
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
