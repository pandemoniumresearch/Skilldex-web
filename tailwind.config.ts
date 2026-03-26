import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base:    '#0d0f12',
          raised:  '#13161b',
          overlay: '#1a1e26',
          border:  '#252a35',
        },
        text: {
          primary:   '#e8eaf0',
          secondary: '#8892a4',
          muted:     '#505a6e',
        },
        brand: {
          DEFAULT: '#5b9cf6',
          dim:     '#3b7de0',
          glow:    '#1a4a8a',
        },
        term: {
          green:   '#4ec994',
          cyan:    '#56d1d1',
          yellow:  '#e5c07b',
          red:     '#e06c75',
          comment: '#4a5568',
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
      },
    },
  },
  plugins: [],
}

export default config
