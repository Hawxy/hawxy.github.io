<script setup lang="ts">
const activeSection = useActiveSection()
const isActive = computed(() => activeSection.value === 'whoami')
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
      Hawxy<span
        class="cursor"
        aria-hidden="true"
      >_</span>
    </h1>
    <p class="mt-6 max-w-xl text-lg text-toned">
      I'm a C#, Vue.js &amp; AWS Architect. I maintain or contribute to a range
      of projects, and assist in maintaining the JasperFx ecosystem.
    </p>
    <p class="mt-3 max-w-xl text-toned">
      You can reach out via
      <a
        href="mailto:software@hawx.dev"
        class="text-(--ui-primary) underline underline-offset-2"
      >software@hawx.dev</a>.
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <UButton
        to="https://github.com/Hawxy"
        target="_blank"
        icon="i-simple-icons-github"
        color="neutral"
        variant="outline"
        class="glow-button font-mono"
      >
        github.com/Hawxy
      </UButton>
      <UButton
        to="https://github.com/sponsors/Hawxy"
        target="_blank"
        icon="i-lucide-heart"
        color="neutral"
        variant="outline"
        class="glow-button-secondary font-mono"
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
