import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'oklch(0.97 0.01 256.22)',
          100: 'oklch(0.93 0.03 256.22)',
          200: 'oklch(0.87 0.06 256.22)',
          300: 'oklch(0.77 0.1 256.22)',
          400: 'oklch(0.65 0.15 256.22)',
          500: 'oklch(0.55 0.2 256.22)',
          600: 'oklch(0.45 0.18 256.22)',
          700: 'oklch(0.35 0.14 256.22)',
          800: 'oklch(0.25 0.1 256.22)',
          900: 'oklch(0.15 0.06 256.22)',
        },
        accent: {
          500: 'oklch(0.7 0.25 330)',
        },
      },
    },
  },
  plugins: [],
}

export default config
