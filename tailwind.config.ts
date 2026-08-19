import type { Config } from 'tailwindcss'

// Tailwind v4 is CSS-first: all colors, fonts and theme tokens live in
// src/app/globals.css (`@theme inline`), which is the single source of
// truth this build actually reads. This file has no `@config` directive
// wiring it in, so nothing below participates in utility generation —
// it's kept only for editor tooling that expects a config file to exist.
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
}
export default config
