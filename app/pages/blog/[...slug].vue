<script setup lang="ts">
const route = useRoute()
// GitHub Pages redirects to a trailing slash, which content paths never have
const path = route.path.replace(/\/+$/, '')

const { data: post } = await useAsyncData(`blog-post-${path}`, () =>
  queryCollection('blog').path(path).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`blog-surround-${path}`, () =>
  queryCollectionItemSurroundings('blog', path, { fields: ['title'] })
    .order('date', 'DESC')
)

const newer = computed(() => surround.value?.[0])
const older = computed(() => surround.value?.[1])

const promptPath = `C:\\Users\\hawxy${path.slice(0, path.lastIndexOf('/')).replaceAll('/', '\\')}`

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogType: 'article',
  articlePublishedTime: formatDate(post.value.date)
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-6">
    <article
      v-if="post"
      class="max-w-2xl pt-20 pb-16 sm:pt-24 sm:pb-20"
    >
      <header>
        <TerminalPrompt :path="promptPath">
          Get-Content .\{{ postSlug(post.path) }}.md
        </TerminalPrompt>
        <h1 class="mt-4 font-mono text-3xl font-bold text-balance text-highlighted sm:text-4xl">
          {{ post.title }}
        </h1>
        <p
          v-if="post.description"
          class="mt-4 text-lg text-toned"
        >
          {{ post.description }}
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
          <time :datetime="formatDate(post.date)">{{ formatDate(post.date) }}</time>
          <span>{{ post.readingTime }} min read</span>
          <span
            v-if="post.tags?.length"
            class="text-dimmed"
          >{{ formatTags(post.tags) }}</span>
          <DraftStamp v-if="isDraftPost(post.path)" />
        </div>
      </header>

      <div
        class="my-10 h-px bg-(--ui-border)"
        aria-hidden="true"
      />

      <ContentRenderer :value="post" />

      <nav
        aria-label="More posts"
        class="mt-16 border-t border-default pt-8"
      >
        <div
          v-if="newer || older"
          class="mb-6 grid gap-4 sm:grid-cols-2"
        >
          <NuxtLink
            v-if="newer"
            :to="newer.path"
            class="surround-link border border-default p-4"
          >
            <span class="font-mono text-xs text-dimmed">← Newer</span>
            <span class="mt-1 block font-mono text-sm font-semibold text-highlighted">{{ newer.title }}</span>
          </NuxtLink>
          <NuxtLink
            v-if="older"
            :to="older.path"
            class="surround-link border border-default p-4 sm:col-start-2 sm:text-right"
          >
            <span class="font-mono text-xs text-dimmed">Older →</span>
            <span class="mt-1 block font-mono text-sm font-semibold text-highlighted">{{ older.title }}</span>
          </NuxtLink>
        </div>
        <NuxtLink
          to="/blog"
          class="font-mono text-sm text-muted transition-colors hover:text-(--ui-primary)"
        >
          ← All posts
        </NuxtLink>
      </nav>
    </article>
  </div>
</template>

<style scoped>
.surround-link {
  border-radius: 2px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.surround-link:hover,
.surround-link:focus-visible {
  border-color: var(--ui-primary);
  box-shadow: var(--glow-primary);
}
</style>
