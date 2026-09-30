<!-- Social share card: a terminal command over the page title, in the site's dark theme -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  command?: string
  argument?: string
  title?: string
  description?: string
  meta?: string
}>(), {
  command: 'whoami',
  argument: '',
  title: 'Jaedyn.T',
  description: '',
  meta: ''
})

// Long post titles step down so title and description stay within the card
const titleSize = computed(() => props.title.length <= 24 ? 76 : props.title.length <= 48 ? 64 : 52)
</script>

<template>
  <div
    class="flex h-full w-full flex-col justify-between"
    style="padding: 64px 72px; background-color: #0d0d0d; color: #cfcfcf; font-family: 'Berkeley Mono', monospace; border-top: 6px solid #4de0dc;"
  >
    <!-- The renderer drops spaces at span edges, so gaps are one character wide margins -->
    <div
      class="flex flex-wrap"
      style="font-size: 28px; line-height: 1.4;"
    >
      <span style="color: #6a6a6a; margin-right: 0.6em;">{{ command }}</span>
      <span
        v-if="argument"
        style="color: #4de0dc;"
      >{{ argument }}</span>
    </div>

    <div class="flex flex-col">
      <div
        :style="{ fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.1, color: '#4de0dc', textShadow: '0 0 24px rgba(77, 224, 220, 0.45)' }"
      >
        {{ title }}_
      </div>
      <div
        v-if="description"
        style="margin-top: 28px; font-size: 32px; line-height: 1.4; color: #ababab;"
      >
        {{ description }}
      </div>
    </div>

    <div
      class="flex justify-between"
      style="font-size: 24px; color: #878787;"
    >
      <span>hawx.dev</span>
      <span v-if="meta">{{ meta }}</span>
    </div>
  </div>
</template>
