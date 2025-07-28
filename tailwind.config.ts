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
        // Primary tones
        primary: {
          a0: '#39823c',
          a20: '#316b33', 
          a40: '#2a552a',
          a60: '#224022',
          a80: '#1a2d19',
          a100: '#111a10',
        },
        // Accent tones
        accent: {
          a0: '#1b291b',
          a20: '#182318',
          a40: '#151e15', 
          a60: '#111811',
          a80: '#0c120c',
          a100: '#060a06',
        },
        // Semantic tones - Danger
        danger: {
          a0: '#b41c2b',
          a20: '#851d22',
          a40: '#581919',
          a60: '#2f1310',
        },
        // Semantic tones - Success
        success: {
          a0: '#009f42',
          a20: '#167533',
          a40: '#184d25',
          a60: '#132916',
        },
        // Semantic tones - Warning
        warning: {
          a0: '#f0ad4e',
          a20: '#af7f3c',
          a40: '#71532a',
          a60: '#392b19',
        },
        // Semantic tones - Info
        info: {
          a0: '#386cfa',
          a20: '#3267b5',
          a40: '#284475',
          a60: '#1a253b',
        },
        // Neutral tones
        neutral: {
          a0: '#ffffff',
          a20: '#c6c6c6',
          a40: '#919191',
          a60: '#5e5e5e',
          a80: '#303030',
          a100: '#000000',
        },
        // Design system colors
        'Background-Base': '#ffffff',
        'Primary-100%': '#39823c',
        'Primary-Text': '#111a10',
        'Secondary-60%': '#5e5e5e',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-domine)', 'ui-serif', 'Georgia'],
        'outfit': ['var(--font-outfit)', 'sans-serif'],
        'domine': ['var(--font-domine)', 'serif'],
        'sen': ['Sen', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config