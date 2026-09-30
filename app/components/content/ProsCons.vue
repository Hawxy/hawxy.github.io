<!--
  Two-column trade-off summary for posts:

  ::pros-cons
  #pros
  - Something good
  #cons
  - Something bad
  ::
-->
<script setup lang="ts">
const id = useId()
</script>

<template>
  <div class="pros-cons my-8 grid border border-default bg-elevated text-sm/6 sm:grid-cols-2">
    <section
      class="pros-cons__col pros-cons__col--pros"
      :aria-labelledby="`${id}-pros`"
    >
      <p
        :id="`${id}-pros`"
        class="pros-cons__label"
      >
        <span aria-hidden="true">[+]</span> Pros
      </p>
      <slot name="pros" />
    </section>
    <section
      class="pros-cons__col pros-cons__col--cons border-t border-default sm:border-t-0 sm:border-l"
      :aria-labelledby="`${id}-cons`"
    >
      <p
        :id="`${id}-cons`"
        class="pros-cons__label"
      >
        <span aria-hidden="true">[-]</span> Cons
      </p>
      <slot name="cons" />
    </section>
  </div>
</template>

<style scoped>
.pros-cons {
  --pros: var(--ui-primary);
  --cons: var(--ui-error);
}

.pros-cons__col {
  padding: 1rem 1.25rem;
}

.pros-cons__col--pros {
  --accent: var(--pros);
}

.pros-cons__col--cons {
  --accent: var(--cons);
}

.pros-cons__label {
  margin-bottom: 0.5rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Slot content is rendered with the prose list components */
.pros-cons__col :deep(ul) {
  margin: 0;
  padding-inline-start: 1.25rem;
}

.pros-cons__col--pros :deep(ul) {
  list-style-type: '+ ';
}

.pros-cons__col--cons :deep(ul) {
  list-style-type: '- ';
}

.pros-cons__col :deep(li) {
  margin-block: 0.375rem;
  padding-inline-start: 0.25rem;
  line-height: 1.5rem;
}

.pros-cons__col :deep(li::marker) {
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 700;
}
</style>
