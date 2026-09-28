<script setup lang="ts">
withDefaults(defineProps<{
  path?: string
}>(), {
  path: 'C:\\Users\\hawxy'
})
</script>

<template>
  <p class="font-mono text-sm">
    <span class="text-(--ui-secondary)">PS</span>{{ ' ' }}
    <span class="text-dimmed">{{ path }}&gt;</span>{{ ' ' }}
    <span class="text-toned"><slot /></span>
  </p>
</template>
