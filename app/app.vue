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

const activeSection = useActiveSection()

const sectionPaths: Record<string, string> = {
  'major-projects': '.\\major-projects\\',
  'jasperfx': '.\\major-projects\\jasperfx\\',
  'utility-projects': '.\\utility-projects\\',
  'ts': '.\\utility-projects\\ts\\',
  'dotnet': '.\\utility-projects\\dotnet\\'
}

const title = 'Jaedyn.T'
const description = 'C#, Vue.js & AWS Architect. Prolific .NET and TypeScript open source contributor. JasperFx Maintainer.'

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
        <span class="min-w-0 truncate font-mono text-sm font-semibold text-highlighted"><span class="font-normal text-dimmed">PS</span> C:\Users\hawxy<span class="font-normal text-dimmed">&gt;</span><span
          v-if="activeSection"
          :key="activeSection"
          class="header-cmd font-normal"
        ><template v-if="activeSection === 'whoami'">{{ ' ' }}<span class="text-toned">whoami</span></template><template v-else>{{ ' ' }}<span class="text-dimmed">ls</span>{{ ' ' }}<span class="text-(--ui-primary)">{{ sectionPaths[activeSection] }}</span></template></span></span>
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
          <UButton
            to="https://www.linkedin.com/in/jaedyntonee/"
            target="_blank"
            icon="i-simple-icons-linkedin"
            aria-label="LinkedIn profile"
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
