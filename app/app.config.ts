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
          base: 'font-mono text-[1.375rem] leading-snug font-semibold'
        }
      },
      h3: {
        slots: {
          base: 'font-mono text-lg font-semibold'
        }
      },
      // Relative line height, so it scales with the post copy size instead of the defaults' fixed 28px
      p: {
        base: 'my-5 leading-[1.7] text-pretty'
      },
      li: {
        base: 'my-1.5 ps-1.5 leading-[1.7] [&>ul]:my-0'
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
      },
      // Darker than the default so light-mode callout text keeps AA contrast on its tint
      callout: {
        variants: {
          color: {
            info: { base: 'text-info-700 [&_code]:text-info-700' },
            success: { base: 'text-success-800 [&_code]:text-success-800' },
            warning: { base: 'text-warning-800 [&_code]:text-warning-800' },
            error: { base: 'text-error-700 [&_code]:text-error-700' }
          }
        }
      }
    }
  }
})
