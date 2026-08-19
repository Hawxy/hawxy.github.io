<template>
  <span
    class="new-stamp font-mono"
    aria-label="Created within the last year"
  >NEW</span>
</template>

<style scoped>
/* Marker for repos under a year old */
.new-stamp {
  display: inline-block;
  padding: 1px 7px;
  border: 1px solid var(--ui-primary);
  border-radius: 2px;
  background: color-mix(in srgb, var(--ui-primary) 8%, transparent);
  color: var(--ui-primary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
}
</style>
