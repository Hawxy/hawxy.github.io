export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neon',
      secondary: 'volt',
      info: 'volt',
      neutral: 'neutral'
    },
    prose: {
      // The markdown markers in main.css take the place of the hover link icon, which would overlap them
      h2: {
        slots: {
          base: 'font-mono text-2xl leading-snug font-bold mt-14',
          leading: 'lg:hidden'
        }
      },
      h3: {
        slots: {
          base: 'font-mono text-lg font-semibold',
          leading: 'lg:hidden'
        }
      },
      // Relative line height, so it scales with the post copy size instead of the defaults' fixed 28px
      p: {
        base: 'my-5 leading-[1.7] text-pretty'
      },
      li: {
        base: 'my-1.5 ps-1.5 leading-[1.7] [&>ul]:my-0'
      },
      // Inline rather than inline-block, so trailing punctuation can't wrap onto its own line.
      // Cloned decoration keeps the border and padding on each piece when long code wraps.
      code: {
        base: 'inline box-decoration-clone'
      },
      a: {
        base: 'border-primary/40'
      },
      pre: {
        slots: {
          // Scroll long lines rather than wrapping them, which drops indentation.
          // The elevated surface keeps the highlight themes' comments above WCAG AA contrast.
          base: 'whitespace-pre wrap-normal bg-elevated text-[0.8125rem] leading-[1.7]'
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
