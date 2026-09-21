<script setup lang="ts">
const activeSection = useActiveSection()
const isActive = computed(() => activeSection.value === 'whoami')

const technologies = [
  { label: 'C#', icon: 'i-simple-icons-csharp' },
  { label: 'TS', icon: 'i-simple-icons-typescript' },
  { label: 'Vue', icon: 'i-simple-icons-vuedotjs' },
  { label: 'Postgres', icon: 'i-simple-icons-postgresql' },
  { label: 'RabbitMQ', icon: 'i-simple-icons-rabbitmq' },
  { label: 'AWS', icon: 'i-simple-icons-amazonwebservices' }
]
</script>

<template>
  <section class="hero relative py-20 sm:py-28">
    <p
      id="whoami"
      class="font-mono text-sm transition-opacity duration-500"
      :style="{ opacity: isActive ? 0.25 : 1 }"
    >
      <span class="text-(--ui-secondary)">PS</span>{{ ' ' }}
      <span class="text-dimmed">C:\Users\hawxy&gt;</span>{{ ' ' }}
      <span class="text-toned">whoami</span>
    </p>
    <h1 class="hero-name mt-4 w-fit font-mono text-6xl font-bold sm:text-7xl">
      Jaedyn<span
        class="cursor"
        aria-hidden="true"
      >_</span>
    </h1>
    <p class="mt-6 max-w-xl text-lg text-toned">
      C#, Vue.js & AWS Architect. Prolific .NET and TypeScript open source contributor. JasperFx Maintainer.
    </p>
    <ul
      class="mt-5 flex max-w-xl flex-wrap gap-x-5 gap-y-2"
      aria-label="Technologies I work with"
    >
      <li
        v-for="tech in technologies"
        :key="tech.label"
        class="flex items-center gap-1.5 font-mono text-xs text-muted"
      >
        <UIcon
          :name="tech.icon"
          class="size-4"
        />{{ tech.label }}
      </li>
    </ul>
    <p class="mt-3 max-w-xl text-toned">
      You can reach me at
      <a
        href="mailto:software@hawx.dev"
        class="text-(--ui-primary) underline underline-offset-2"
      >software@hawx.dev</a>.
    </p>
    <div class="mt-8 flex flex-wrap gap-2.5">
      <UButton
        to="https://github.com/Hawxy"
        target="_blank"
        icon="i-simple-icons-github"
        color="neutral"
        variant="outline"
        class="glow-button h-9 gap-2.5 px-3.5 font-mono"
        :ui="{ leadingIcon: 'size-4' }"
      >
        github.com/Hawxy
      </UButton>
      <UButton
        to="https://www.linkedin.com/in/jaedyntonee/"
        target="_blank"
        icon="i-simple-icons-linkedin"
        color="neutral"
        variant="outline"
        class="glow-button h-9 gap-2.5 px-3.5 font-mono"
        :ui="{ leadingIcon: 'size-4' }"
      >
        LinkedIn
      </UButton>
      <UButton
        to="https://github.com/sponsors/Hawxy"
        target="_blank"
        icon="i-lucide-heart"
        color="neutral"
        variant="outline"
        class="glow-button-secondary h-9 gap-2.5 px-3.5 font-mono"
        :ui="{ leadingIcon: 'size-4' }"
      >
        Sponsor
      </UButton>
    </div>
  </section>
</template>

<style scoped>
.hero-name {
  color: var(--ui-primary);
  text-shadow: var(--text-glow-primary);
}

.cursor {
  margin-left: 0.08em;
  animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}

/* Blueprint grid, faded toward the bottom */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    repeating-linear-gradient(to right, var(--ui-border) 0 1px, transparent 1px 48px),
    repeating-linear-gradient(to bottom, var(--ui-border) 0 1px, transparent 1px 48px);
  opacity: 0.25;
  mask-image: linear-gradient(to bottom, black 20%, transparent);
}

.glow-button,
.glow-button-secondary {
  transition: border-color 0.25s, box-shadow 0.25s;
}
.glow-button:hover,
.glow-button:focus-visible {
  box-shadow: var(--glow-primary);
}
.glow-button-secondary:hover,
.glow-button-secondary:focus-visible {
  box-shadow: var(--glow-secondary);
}
</style>
