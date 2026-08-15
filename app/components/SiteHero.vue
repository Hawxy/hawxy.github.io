<template>
  <section class="hero relative py-20 sm:py-28">
    <p class="font-mono text-xs uppercase tracking-[0.08em] text-(--ui-primary)">
      // personal portfolio
    </p>
    <h1 class="hero-name mt-3 w-fit font-mono text-6xl font-bold sm:text-7xl">
      Hawxy
    </h1>
    <p class="mt-5 max-w-xl text-lg text-toned">
      .NET &amp; TypeScript open source: Postgres change data capture,
      auth tooling and cloud infrastructure.
    </p>
    <div class="mt-8 flex gap-3">
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
    </div>
  </section>
</template>

<style scoped>
.hero-name {
  background: linear-gradient(150deg, var(--ui-primary) 30%, var(--ui-secondary));
  background-clip: text;
  color: transparent;
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
  opacity: 0.35;
  mask-image: linear-gradient(to bottom, black 20%, transparent);
}

.glow-button {
  transition: border-color 0.25s, box-shadow 0.25s;
}
.glow-button:hover,
.glow-button:focus-visible {
  box-shadow: var(--glow-primary);
}
</style>
