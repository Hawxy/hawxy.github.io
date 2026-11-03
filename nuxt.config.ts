import { githubUrl, linkedinUrl, siteAuthor, siteDescription, siteName, siteUrl } from './shared/utils/site'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    // Registered before @nuxtjs/seo, which needs @nuxt/fonts 1.x to render OG images with site fonts
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Shared by the sitemap, robots, canonical URLs, schema.org and OG images
  site: {
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    defaultLocale: 'en',
    // GitHub Pages serves each page as a folder index and redirects to the trailing slash
    trailingSlash: true
  },

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

  // Nuxt UI would otherwise install its own older @nuxt/fonts
  ui: {
    fonts: false
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/rss.xml': { prerender: true }
  },

  // Match the site's trailing slashes so internal links don't go through a redirect
  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'append'
      }
    }
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

  // Berkeley Mono lives in public/fonts (gitignored, injected in CI).
  // Global so the OG image renderer can use it too.
  fonts: {
    families: [
      {
        name: 'Berkeley Mono',
        src: '/fonts/BerkeleyMonoVariable.woff2',
        weight: [400, 700],
        display: 'swap',
        global: true
      },
      // Body text, downloaded from Google Fonts at build time and served from the site.
      // Global so its @font-face rules are always included, since it's only referenced through --font-sans.
      {
        name: 'Source Sans 3',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        subsets: ['latin', 'latin-ext'],
        display: 'swap',
        global: true
      }
    ]
  },

  // GitHub Pages is static, so every OG image is rendered at build time
  ogImage: {
    zeroRuntime: true
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: siteAuthor,
      url: siteUrl,
      sameAs: [githubUrl, linkedinUrl]
    }
  },

  // Prerendered with the rest of the site
  sitemap: {
    zeroRuntime: true
  }
})
