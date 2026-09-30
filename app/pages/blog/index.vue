<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog')
    .select('path', 'title', 'description', 'date', 'tags', 'readingTime')
    .order('date', 'DESC')
    .all()
)

useSeoMeta({
  title: 'Blog',
  description: blogDescription
})

defineOgImage('Terminal.takumi', {
  command: 'cd',
  argument: '.\\blog\\',
  title: 'Blog',
  description: blogDescription
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-6">
    <section class="blueprint-grid relative pt-20 pb-12 sm:pt-28">
      <TerminalPrompt>cd .\blog\</TerminalPrompt>
      <h1 class="glow-title mt-4 w-fit font-mono text-5xl font-bold sm:text-6xl">
        Blog<span
          class="blink-cursor"
          aria-hidden="true"
        >_</span>
      </h1>
      <p class="mt-6 max-w-xl text-lg text-toned">
        {{ blogDescription }}
      </p>
      <a
        href="/rss.xml"
        class="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-(--ui-primary)"
      >
        <UIcon
          name="i-lucide-rss"
          class="size-3.5"
        />rss.xml
      </a>
    </section>

    <section
      aria-labelledby="posts"
      class="pb-20"
    >
      <div class="mb-4 flex items-baseline gap-4">
        <h2
          id="posts"
          aria-label="Posts"
          class="shrink-0 font-mono text-sm"
        >
          <span aria-hidden="true">
            <span class="text-dimmed">PS&gt;</span>
            <span class="ml-2 font-semibold text-(--ui-primary)">ls</span>
          </span>
        </h2>
        <div
          class="h-px flex-1 bg-(--ui-border)"
          aria-hidden="true"
        />
      </div>

      <p class="ps-[4ch] font-mono text-xs text-dimmed">
        Directory: C:\Users\hawxy\blog
      </p>

      <div
        v-if="posts?.length"
        class="mt-6 font-mono text-xs"
      >
        <div
          class="post-grid hidden border-l-2 border-transparent px-4 text-dimmed sm:grid"
          aria-hidden="true"
        >
          <span>Mode</span>
          <span>LastWriteTime</span>
          <span class="text-right">Length</span>
          <span>Name</span>
        </div>
        <div
          class="post-grid hidden border-l-2 border-transparent px-4 text-dimmed sm:grid"
          aria-hidden="true"
        >
          <span>----</span>
          <span>-------------</span>
          <span class="text-right">------</span>
          <span>----</span>
        </div>

        <ul class="mt-1 divide-y divide-default border-b border-default">
          <li
            v-for="post in posts"
            :key="post.path"
          >
            <NuxtLink
              :to="post.path"
              class="post-row post-grid group grid items-baseline px-4 py-4"
            >
              <span
                class="hidden text-dimmed sm:block"
                aria-hidden="true"
              >{{ isDraftPost(post.path) ? '-a-h-' : '-a---' }}</span>
              <time
                :datetime="formatDate(post.date)"
                class="text-muted"
              >{{ formatDate(post.date) }}</time>
              <span class="text-muted sm:text-right">{{ post.readingTime }} min</span>
              <span class="post-name min-w-0">
                <span class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-semibold text-highlighted transition-colors group-hover:text-(--ui-primary)">{{ post.title }}</span>
                  <DraftStamp v-if="isDraftPost(post.path)" />
                </span>
                <span
                  v-if="post.description"
                  class="mt-1 block font-sans text-sm text-muted"
                >{{ post.description }}</span>
                <span
                  v-if="post.tags?.length"
                  class="mt-2 block text-dimmed"
                >{{ formatTags(post.tags) }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <p
        v-else
        class="mt-6 font-mono text-sm text-muted"
      >
        No posts yet.
      </p>
    </section>
  </div>
</template>

<style scoped>
/* Columns sized in characters, like PowerShell's table output */
.post-grid {
  grid-template-columns: auto auto 1fr;
  column-gap: 2ch;
  row-gap: 0.5rem;
}

.post-name {
  grid-column: 1 / -1;
}

@media (min-width: 40rem) {
  .post-grid {
    grid-template-columns: 5ch 13ch 6ch 1fr;
  }

  .post-name {
    grid-column: auto;
  }
}

.post-row {
  border-left: 2px solid transparent;
  transition: border-color 0.25s, background-color 0.25s;
}

.post-row:hover,
.post-row:focus-visible {
  border-left-color: var(--ui-primary);
  background-color: var(--ui-bg-elevated);
}
</style>
