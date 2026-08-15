<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Hawxy'
const description = '.NET & TypeScript open source: Postgres change data capture, auth tooling and cloud infrastructure.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <header class="sticky top-0 z-10 border-b border-default bg-default/80 backdrop-blur">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <span class="font-mono text-sm font-semibold uppercase tracking-[0.08em] text-highlighted">hawxy</span>
        <div class="flex items-center gap-1">
          <UColorModeButton />
          <UButton
            to="https://github.com/Hawxy"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub profile"
            color="neutral"
            variant="ghost"
          />
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="border-t border-default">
      <div class="mx-auto max-w-4xl px-6 py-6">
        <p class="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          © {{ new Date().getFullYear() }} Hawxy · Set in Berkeley Mono
        </p>
      </div>
    </footer>
  </UApp>
</template>
