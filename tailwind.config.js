/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: '"Bricolage Grotesque", "Inter", -apple-system, sans-serif',
        'display-italic': '"Instrument Serif", "Times New Roman", serif',
        sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      },
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        paper: 'var(--paper)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-mute': 'var(--ink-mute)',
        'ink-faint': 'var(--ink-faint)',
      },
    },
  },
  plugins: [],
}
