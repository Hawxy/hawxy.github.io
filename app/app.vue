<script setup lang="ts">
const description = 'C#, Vue.js & AWS Architect. Prolific .NET and TypeScript open source contributor. JasperFx Maintainer.'

useHead({
  titleTemplate: chunk => chunk && chunk !== siteName ? `${chunk} · ${siteName}` : siteName,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'alternate', type: 'application/rss+xml', title: `${siteName} blog`, href: '/rss.xml' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: siteName,
  description,
  ogTitle: siteName,
  ogDescription: description
})

const route = useRoute()
const isBlog = computed(() => route.path.startsWith('/blog'))
const promptPath = computed(() => isBlog.value ? blogPromptPath(route.path) : 'C:\\Users\\hawxy')

const navLinks = computed(() => [
  { label: 'home', to: '/', active: !isBlog.value },
  { label: 'blog', to: '/blog', active: isBlog.value }
])

const activeSection = useActiveSection()

const sectionPaths: Record<string, string> = {
  'major-projects': '.\\major-projects\\',
  'jasperfx': '.\\major-projects\\jasperfx\\',
  'utility-projects': '.\\utility-projects\\',
  'ts': '.\\utility-projects\\ts\\',
  'dotnet': '.\\utility-projects\\dotnet\\'
}

// Command typed into the title bar for the heading currently scrolled under it
const headerCommand = computed<{ verb: string, arg?: string } | null>(() => {
  const section = activeSection.value
  if (!section) return null
  if (section === 'whoami') return { verb: 'whoami' }
  if (section === 'post-prompt') {
    return { verb: 'Get-Content', arg: `.\\${postSlug(route.path.replace(/\/+$/, ''))}.md` }
  }
  const path = sectionPaths[section]
  return path ? { verb: 'ls', arg: path } : null
})
</script>

<template>
  <UApp>
    <header class="sticky top-0 z-10 border-b border-default bg-default/80 backdrop-blur">
      <div class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
        <span class="min-w-0 truncate font-mono text-sm font-semibold text-highlighted"><span class="font-normal text-dimmed">PS</span> {{ promptPath }}<span class="font-normal text-dimmed">&gt;</span><span
          v-if="headerCommand"
          :key="activeSection ?? undefined"
          class="header-cmd font-normal"
        >{{ ' ' }}<span :class="headerCommand.arg ? 'text-dimmed' : 'text-toned'">{{ headerCommand.verb }}</span><template v-if="headerCommand.arg">{{ ' ' }}<span class="text-(--ui-primary)">{{ headerCommand.arg }}</span></template></span></span>
        <div class="flex shrink-0 items-center gap-0.5">
          <nav
            aria-label="Site"
            class="mr-3 flex items-center gap-4 font-mono text-sm"
          >
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :aria-current="link.active ? 'page' : undefined"
              class="transition-colors hover:text-(--ui-primary)"
              :class="link.active ? 'text-(--ui-primary)' : 'text-muted'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
          <UColorModeButton
            class="size-8 justify-center"
            :ui="{ leadingIcon: 'size-4' }"
          />
          <UButton
            to="https://github.com/Hawxy"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub profile"
            color="neutral"
            variant="ghost"
            class="size-8 justify-center"
            :ui="{ leadingIcon: 'size-4' }"
          />
          <UButton
            to="https://www.linkedin.com/in/jaedyntonee/"
            target="_blank"
            icon="i-simple-icons-linkedin"
            aria-label="LinkedIn profile"
            color="neutral"
            variant="ghost"
            class="size-8 justify-center"
            :ui="{ leadingIcon: 'size-4' }"
          />
        </div>
      </div>
    </header>

    <main class="flex-1">
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

<style scoped>
/* Command typed into the title bar as its section heading scrolls underneath */
.header-cmd {
  display: inline-block;
  white-space: pre;
  animation: cmd-wipe 0.4s steps(10) both;
}

@keyframes cmd-wipe {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
</style>
