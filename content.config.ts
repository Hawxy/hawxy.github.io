import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: {
        include: 'blog/**/*.md',
        // Drafts only exist in dev builds, so they never reach the published site or its content dump
        exclude: process.env.NODE_ENV === 'production' ? ['blog/drafts/**'] : []
      },
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()).default([]),
        readingTime: z.number().default(1)
      })
    })
  }
})
