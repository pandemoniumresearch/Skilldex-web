import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base:    '#15140f',
          raised:  '#1c1b16',
          overlay: '#23211b',
          border:  '#25231c',
        },
        text: {
          primary:   '#f6f1e3',
          secondary: '#a39d8b',
          muted:     '#6a655a',
        },
        brand: {
          DEFAULT: '#ff8a1f',
          dim:     '#cc6e19',
          glow:    '#ff8a1f',
        },
        term: {
          green:   '#7ee787',
          cyan:    '#56d1d1',
          yellow:  '#e5c07b',
          red:     '#e06c75',
          comment: '#6a655a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs:    ['0.75rem',  { lineHeight: '1.4' }],
        sm:    ['0.875rem', { lineHeight: '1.5' }],
        base:  ['1rem',     { lineHeight: '1.6' }],
        lg:    ['1.125rem', { lineHeight: '1.6' }],
        xl:    ['1.25rem',  { lineHeight: '1.5' }],
        '2xl': ['1.5rem',   { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem',  { lineHeight: '1.2' }],
        '5xl': ['3rem',     { lineHeight: '1.1' }],
        '6xl': ['3.75rem',  { lineHeight: '1.04' }],
      },
    },
  },
  plugins: [],
}

export default config
