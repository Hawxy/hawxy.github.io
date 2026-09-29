export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neon',
      secondary: 'volt',
      info: 'volt',
      neutral: 'neutral'
    },
    prose: {
      h2: {
        slots: {
          base: 'font-mono text-xl font-semibold'
        }
      },
      h3: {
        slots: {
          base: 'font-mono text-lg font-semibold'
        }
      },
      a: {
        base: 'border-primary/40'
      },
      pre: {
        slots: {
          // Scroll long lines rather than wrapping them, which drops indentation.
          // The elevated surface keeps the highlight themes' comments above WCAG AA contrast.
          base: 'whitespace-pre wrap-normal bg-elevated'
        }
      },
      blockquote: {
        base: 'border-s-2 border-primary text-toned not-italic'
      }
    }
  }
})
