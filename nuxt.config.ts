// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          // All three keys are set so none of Nuxt UI's default themes merge in.
          // Both themes keep every token at WCAG AA contrast on the elevated code block surface.
          theme: {
            default: 'github-light-high-contrast',
            light: 'github-light-high-contrast',
            dark: 'catppuccin-mocha'
          },
          langs: ['csharp', 'ts', 'js', 'vue', 'json', 'yaml', 'sql', 'powershell', 'bash', 'xml', 'diff']
        }
      }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/rss.xml': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  hooks: {
    // Reading time from the raw markdown at ~220 words per minute
    'content:file:afterParse'({ file, content, collection }) {
      if (collection.name !== 'blog') return
      const words = file.body.replace(/^---[\s\S]*?---/, '').split(/\s+/).filter(Boolean).length
      content.readingTime = Math.max(1, Math.round(words / 220))
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Berkeley Mono is declared via a local @font-face; don't resolve it from a provider
  fonts: {
    families: [
      { name: 'Berkeley Mono', provider: 'none' }
    ]
  }
})
