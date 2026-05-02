/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f1a',
          'bg-warm': '#1a1510',
          surface: 'rgba(255, 255, 255, 0.05)',
          'surface-hover': 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.15)',
          text: {
            primary: '#f5f5f0',
            secondary: '#a0998c',
            muted: '#6b6560',
          },
          accent: {
            gold: '#d4af37',
            'gold-soft': '#c9a84c',
            sand: '#c2b280',
            'sand-light': '#d4c9a8',
          },
        },
      },
      fontFamily: {
        editorial: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.35em',
        tagline: '0.1em',
        label: '0.05em',
      },
      fontSize: {
        'price-tag': ['3rem', { lineHeight: '1', fontWeight: '300' }],
        brand: ['2.5rem', { lineHeight: '1.2', fontWeight: '300' }],
      },
    },
  },
  plugins: [],
}
