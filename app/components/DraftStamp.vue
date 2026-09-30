<template>
  <span
    class="draft-stamp font-mono"
    aria-label="Draft, only visible in development"
  >DRAFT</span>
</template>

<style scoped>
/* Marker for posts under content/blog/drafts */
.draft-stamp {
  display: inline-block;
  padding: 1px 7px;
  border: 1px solid var(--ui-secondary);
  border-radius: 2px;
  background: color-mix(in srgb, var(--ui-secondary) 8%, transparent);
  color: var(--ui-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
}
</style>
