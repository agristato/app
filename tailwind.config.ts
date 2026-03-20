import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Reflexai-inspired forest green palette
        forest: '#061f00',
        moss: '#003a0b',
        olive: '#61881e',
        lime: '#a5e119',
        zest: '#dfffa3',
        grass: '#09cf58',
        mint: '#d4ffd6',

        // Beige neutrals (sophisticated off-whites)
        beige: '#fbfbf6',
        'beige-25': '#f9f9ef',
        'beige-50': '#edede1',
        'beige-75': '#d6d6c6',
        'beige-100': '#b8b89e',

        // Brand blacks
        ink: '#0b0b0b',

        // Primary brand green (matches frontend DaisyUI primary #39833c)
        brand: '#39833c',
        'brand-hover': '#2d6e30',

        // Legacy (kept for modals/shadcn)
        primary: {
          a0: '#39823c',
          a20: '#316b33',
          a40: '#2a552a',
          a60: '#224022',
          a80: '#1a2d19',
          a100: '#111a10',
        },
        accent: {
          a0: '#1b291b',
          a20: '#182318',
          a40: '#151e15',
          a60: '#111811',
          a80: '#0c120c',
          a100: '#060a06',
        },
        danger: {
          a0: '#b41c2b',
          a20: '#851d22',
          a40: '#581919',
          a60: '#2f1310',
        },
        success: {
          a0: '#009f42',
          a20: '#167533',
          a40: '#184d25',
          a60: '#132916',
        },
        warning: {
          a0: '#f0ad4e',
          a20: '#af7f3c',
          a40: '#71532a',
          a60: '#392b19',
        },
        info: {
          a0: '#386cfa',
          a20: '#3267b5',
          a40: '#284475',
          a60: '#1a253b',
        },
        neutral: {
          a0: '#ffffff',
          a20: '#c6c6c6',
          a40: '#919191',
          a60: '#5e5e5e',
          a80: '#303030',
          a100: '#000000',
        },
        'Background-Base': '#fbfbf6',
        'Primary-100%': '#061f00',
        'Primary-Text': '#0b0b0b',
        'Secondary-60%': '#5e5e5e',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Geist', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-domine)', 'ui-serif', 'Georgia'],
        // Legacy alias — still renders Geist (same CSS var), kept for backwards compat
        outfit: ['var(--font-geist-sans)', 'Geist', 'sans-serif'],
        geist: ['var(--font-geist-sans)', 'Geist', 'sans-serif'],
        domine: ['var(--font-domine)', 'serif'],
        sen: ['var(--font-sen)', 'Sen', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
